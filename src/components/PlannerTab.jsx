import { useState, useMemo } from "react";
import PlaceCard from "./PlaceCard";
import PlaceModal from "./PlaceModal";
import ScheduleModal from "./ScheduleModal";

const getTripDays = (startDate, endDate) => {
    if (!startDate || !endDate) return [];

    const result = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    current.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
        result.push({
            date: current.toISOString().split("T")[0],
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
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlace, setEditingPlace] = useState(null);

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const tripDays = useMemo(() => {
        return getTripDays(roomData?.startDate, roomData?.endDate);
    }, [roomData?.startDate, roomData?.endDate]);

    const hours = Array.from({ length: 24 }, (_, index) => index);
    const HOUR_HEIGHT = 64;

    const convertTimeToMinutes = (time) => {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    };

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
        if (editingPlace) {
            setPlaces((prev) =>
                prev.map((place) =>
                    place.id === editingPlace.id
                        ? { ...place, ...formData }
                        : place
                )
            );
        } else {
            const newPlace = {
                id: Date.now(),
                likes: 0,
                dislikes: 0,
                isMust: false,
                userReaction: null,
                ...formData,
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

    const handleOpenScheduleModal = (place) => {
        setSelectedPlace(place);
        setIsScheduleModalOpen(true);
    };

    const handleCloseScheduleModal = () => {
        setSelectedPlace(null);
        setIsScheduleModalOpen(false);
    };

    // 스케줄 저장
    const handleSaveSchedule = (scheduleData) => {
        setScheduledItems((prev) => [scheduleData, ...prev]);
        handleCloseScheduleModal();
    };

    // 스케줄 삭제
    const handleDeleteSchedule = (scheduleId) => {
        setScheduledItems((prev) =>
            prev.filter((item) => item.id !== scheduleId)
        );
    };

    return (
        <section className="planner-layout">
            <div className="planner-left">
                <div className="planner-section-header">
                    <h3 className="planner-title">일정표</h3>
                </div>

                <div className="planner-board">
                    <div className="planner-grid-column-layout">
                        <div className="planner-time-column">
                            <div className="planner-top-empty"></div>

                            {hours.map((hour) => (
                                <div key={hour} className="planner-time-label-cell">
                                    {String(hour).padStart(2, "0")}:00
                                </div>
                            ))}
                        </div>

                        <div
                            className="planner-days-columns"
                            style={{
                                gridTemplateColumns: `repeat(${tripDays.length}, minmax(180px, 1fr))`,
                            }}
                        >
                            {tripDays.map((day) => {
                                const daySchedules = scheduledItems.filter(
                                    (item) => item.date === day.date
                                );

                                return (
                                    <div key={day.date} className="planner-day-column">
                                        <div className="planner-day-column-header">
                                            {day.label}
                                        </div>

                                        <div className="planner-day-column-body">
                                            {hours.map((hour) => (
                                                <div key={hour} className="planner-hour-cell" />
                                            ))}

                                            {daySchedules.map((item) => {
                                                const startMinutes = convertTimeToMinutes(item.startTime);
                                                const endMinutes = convertTimeToMinutes(item.endTime);

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="schedule-block"
                                                        style={{
                                                            top: `${(startMinutes / 60) * HOUR_HEIGHT}px`,
                                                            height: `${((endMinutes - startMinutes) / 60) * HOUR_HEIGHT}px`,
                                                        }}
                                                    >
                                                        <button
                                                            className="schedule-delete-btn"
                                                            onClick={() => handleDeleteSchedule(item.id)}
                                                        >
                                                            ×
                                                        </button>

                                                        <strong>{item.title}</strong>
                                                        <span>
                                                            {item.startTime} - {item.endTime}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

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

            {isScheduleModalOpen && selectedPlace && (
                <ScheduleModal
                    place={selectedPlace}
                    tripDays={tripDays}
                    onClose={handleCloseScheduleModal}
                    onSave={handleSaveSchedule}
                />
            )}
        </section>
    );
}

export default PlannerTab;