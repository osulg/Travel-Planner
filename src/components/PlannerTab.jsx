import { useState, useMemo } from "react";
import PlaceCard from "./PlaceCard";
import PlaceModal from "./PlaceModal";
import ScheduleModal from "./ScheduleModal";
import PlannerScheduleBoard from "./PlannerScheduleBoard";
import CommentModal from "./CommentModal";

const parseDateString = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getTripDays = (startDate, endDate) => {
    if (!startDate || !endDate) return [];

    const result = [];
    const current = parseDateString(startDate);
    const end = parseDateString(endDate);

    current.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
        result.push({
            date: formatDateString(current),
            label: `${current.getMonth() + 1}/${current.getDate()}`,
        });
        current.setDate(current.getDate() + 1);
    }

    return result;
};

function PlannerTab({
    places,
    setPlaces,
    scheduledItems,
    setScheduledItems,
    roomData,
    highlightedPlaceId,
    onScheduleItemClick,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlace, setEditingPlace] = useState(null);

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedScheduleType, setSelectedScheduleType] = useState(null);

    const tripDays = useMemo(() => {
        return getTripDays(roomData?.startDate, roomData?.endDate);
    }, [roomData?.startDate, roomData?.endDate]);

    // 댓글
    const normalizeComments = (comments) => {
        if (Array.isArray(comments)) return comments;
        return [];
    };

    // 댓글
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedCommentPlace, setSelectedCommentPlace] = useState(null);

    const handleOpenAddModal = () => {
        setEditingPlace(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (place) => {
        setEditingPlace(place);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlace(null);
    };

    const handleSavePlace = (formData) => {
        const normalizedFormData = {
            ...formData,
            title: formData.title?.trim() || "",
        };

        if (editingPlace) {
            setPlaces((prev) =>
                prev.map((place) =>
                    place.id === editingPlace.id
                        ? {
                            ...place,
                            ...normalizedFormData,
                            title: normalizedFormData.title,
                        }
                        : place
                )
            );

            setScheduledItems((prev) =>
                prev.map((item) =>
                    item.placeId === editingPlace.id
                        ? {
                            ...item,
                            title: normalizedFormData.title,
                        }
                        : item
                )
            );
        } else {
            const newPlace = {
                id: Date.now(),
                likes: 0,
                dislikes: 0,
                comments: [],
                isMust: false,
                userReaction: null,
                ...normalizedFormData,
                title: normalizedFormData.title,
            };

            setPlaces((prev) => [newPlace, ...prev]);
        }

        handleCloseModal();
    };

    const handleToggleMust = (placeId) => {
        setPlaces((prev) =>
            prev.map((place) =>
                place.id === placeId
                    ? { ...place, isMust: !place.isMust }
                    : place
            )
        );
    };

    const handleLike = (placeId) => {
        setPlaces((prev) =>
            prev.map((place) => {
                if (place.id !== placeId) return place;

                if (place.userReaction === "like") {
                    return {
                        ...place,
                        likes: Math.max(0, place.likes - 1),
                        userReaction: null,
                    };
                }

                if (place.userReaction === "dislike") {
                    return {
                        ...place,
                        likes: place.likes + 1,
                        dislikes: Math.max(0, place.dislikes - 1),
                        userReaction: "like",
                    };
                }

                return {
                    ...place,
                    likes: place.likes + 1,
                    userReaction: "like",
                };
            })
        );
    };

    const handleDislike = (placeId) => {
        setPlaces((prev) =>
            prev.map((place) => {
                if (place.id !== placeId) return place;

                if (place.userReaction === "dislike") {
                    return {
                        ...place,
                        dislikes: Math.max(0, place.dislikes - 1),
                        userReaction: null,
                    };
                }

                if (place.userReaction === "like") {
                    return {
                        ...place,
                        likes: Math.max(0, place.likes - 1),
                        dislikes: place.dislikes + 1,
                        userReaction: "dislike",
                    };
                }

                return {
                    ...place,
                    dislikes: place.dislikes + 1,
                    userReaction: "dislike",
                };
            })
        );
    };

    // 댓글 열기/닫기
    const handleOpenComments = (place) => {
        setSelectedCommentPlace(place);
        setIsCommentModalOpen(true);
    };

    const handleCloseComments = () => {
        setSelectedCommentPlace(null);
        setIsCommentModalOpen(false);
    };

    // 댓글 추가
    const handleAddComment = (placeId, text) => {
        const newComment = {
            id: Date.now(),
            author: localStorage.getItem("userName") || "홍길동",
            text,
            createdAt: new Date().toLocaleString("ko-KR"),
        };

        setPlaces((prev) =>
            prev.map((place) =>
                place.id === placeId
                    ? {
                        ...place,
                        comments: [...(Array.isArray(place.comments) ? place.comments : []), newComment],
                    }
                    : place
            )
        );

        setSelectedCommentPlace((prev) =>
            prev
                ? {
                    ...prev,
                    comments: [...(Array.isArray(prev.comments) ? prev.comments : []), newComment],
                }
                : prev
        );
    };

    // 댓글 삭제
    const handleDeleteComment = (placeId, commentId) => {
        setPlaces((prev) =>
            prev.map((place) =>
                place.id === placeId
                    ? {
                        ...place,
                        comments: (Array.isArray(place.comments) ? place.comments : []).filter(
                            (comment) => comment.id !== commentId
                        ),
                    }
                    : place
            )
        );

        setSelectedCommentPlace((prev) =>
            prev
                ? {
                    ...prev,
                    comments: (Array.isArray(prev.comments) ? prev.comments : []).filter(
                        (comment) => comment.id !== commentId
                    ),
                }
                : prev
        );
    };

    // 스케줄 확정 모달
    const handleOpenScheduleModal = (place = null, type = null) => {
        setSelectedPlace(place);
        setSelectedScheduleType(type);
        setIsScheduleModalOpen(true);
    };

    const handleCloseScheduleModal = () => {
        setSelectedPlace(null);
        setSelectedScheduleType(null);
        setIsScheduleModalOpen(false);
    };

    const handleSaveSchedule = (scheduleData) => {
        setScheduledItems((prev) => [scheduleData, ...prev]);
        handleCloseScheduleModal();
    };

    const handleDeleteSchedule = (scheduleId) => {
        setScheduledItems((prev) =>
            prev.filter((item) => item.id !== scheduleId)
        );
    };

    return (
        <section className="planner-layout">
            <PlannerScheduleBoard
                tripDays={tripDays}
                scheduledItems={scheduledItems}
                onDeleteSchedule={handleDeleteSchedule}
                onOpenQuickSchedule={(type) => handleOpenScheduleModal(null, type)}
                onScheduleItemClick={onScheduleItemClick}
            />

            <aside className="planner-sidebar">
                <div className="planner-sidebar-header">
                    <h3>장소 목록</h3>
                    <button
                        className="add-place-button"
                        onClick={handleOpenAddModal}
                    >
                        + 장소 추가
                    </button>
                </div>

                <div className="place-card-list">
                    {places.map((place) => (
                        <PlaceCard
                            key={place.id}
                            place={place}
                            onEdit={() => handleOpenEditModal(place)}
                            onToggleMust={handleToggleMust}
                            onLike={() => handleLike(place.id)}
                            onDislike={() => handleDislike(place.id)}
                            onSchedule={handleOpenScheduleModal}
                            onOpenComments={handleOpenComments}
                            isHighlighted={highlightedPlaceId === place.id}
                        />
                    ))}
                </div>
            </aside>

            {isModalOpen && (
                <PlaceModal
                    initialData={editingPlace}
                    onClose={handleCloseModal}
                    onSave={handleSavePlace}
                />
            )}

            {isScheduleModalOpen && (selectedPlace || selectedScheduleType) && (
                <ScheduleModal
                    place={selectedPlace}
                    fixedType={selectedScheduleType}
                    tripDays={tripDays}
                    onClose={handleCloseScheduleModal}
                    onSave={handleSaveSchedule}
                />
            )}

            {isCommentModalOpen && selectedCommentPlace && (
                <CommentModal
                    place={selectedCommentPlace}
                    onClose={handleCloseComments}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                />
            )}
        </section>
    );
}

export default PlannerTab;