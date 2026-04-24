import { useState, useMemo, useEffect } from "react";
import { getPlanner } from "../api/plannerApi";
import {
    createPlace,
    updatePlace,
    deletePlace,
    togglePlaceRequired,
    changePlaceReaction,
    getPlaceComments,
    createPlaceComment
} from "../api/placeApi";
import {
    createScheduleItem,
    deleteScheduleItem
} from "../api/scheduleApi";

import PlaceCard from "./PlaceCard";
import PlaceModal from "./PlaceModal";
import ScheduleModal from "./ScheduleModal";
import PlannerScheduleBoard from "./PlannerScheduleBoard";
import CommentModal from "./CommentModal";

/* func: 'YYYY-MM-DD' 형식의 문자열을 Date 객체로 바꾸는 함수 */
const parseDateString = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
};

/* func: Date 객체를 "YYYY-MM-DD" 문자열로 바꾸는 함수 */
const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

/* func: 여행 시작일~종료일 사이의 날짜 배열을 만드는 함수 */
const getTripDays = (startDate, endDate) => {
    // 여행 시작일~종료일 사이의 날짜 배열을 만드는 함수
    if (!startDate || !endDate) return [];

    const result = [];

    // 문자열 날짜를 Date 객체로 변환
    const current = parseDateString(startDate);
    const end = parseDateString(endDate);

    // 시간 정보를 00:00:00으로 맞춰 날짜 비교 오차 방지
    current.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // 시작일부터 종료일까지 하루씩 증가시키며 배열 생성
    while (current <= end) {
        result.push({
            // 저장/비교용 날짜 문자열
            date: formatDateString(current),
            // 화면 표시용 라벨 (예: 4/8)
            label: `${current.getMonth() + 1}/${current.getDate()}`,
        });

        // 화면 표시용 라벨 (예: 4/8)
        current.setDate(current.getDate() + 1);
    }

    return result;
};

function PlannerTab({
    roomId,
    places,
    setPlaces,
    scheduledItems,
    setScheduledItems,
    highlightedPlaceId,
    onScheduleItemClick,
    currentUserName
}) {

    const [roomInfo, setRoomInfo] = useState(null);
    const [plannerDays, setPlannerDays] = useState([]);
    // const [places, setPlaces] = useState([]);
    // const [scheduledItems, setScheduledItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [apiStatus, setApiStatus] = useState({
        success: null,
        code: "",
        message: "",
    });

    // 장소 추가/수정 모달 열림 여부
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 현재 수정 중인 장소 데이터
    // null이면 새 장소 추가 모드
    const [editingPlace, setEditingPlace] = useState(null);

    // 일정 추가/확정 모달 열림 여부
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    // 일정 추가 시 선택된 장소
    const [selectedPlace, setSelectedPlace] = useState(null);

    // 빠른 일정 추가 시 선택된 일정 타입
    // 예: 이동, 휴식, 취침 등
    const [selectedScheduleType, setSelectedScheduleType] = useState(null);

    // 여행 시작일~종료일을 기반으로 tripDays 배열 생성
    // roomData의 날짜가 바뀔 때만 다시 계산하도록 useMemo 사용
    const tripDays = useMemo(() => {
        if (plannerDays.length > 0) {
            return plannerDays.map((day, index) => {
                const date = parseDateString(day.date);

                return {
                    id: day.itineraryDayId ?? `day-${index + 1}`,
                    date: day.date,
                    label: `${date.getMonth() + 1}/${date.getDate()}`,
                    dayOrder: day.dayOrder ?? index + 1,
                };
            });
        }

        return getTripDays(roomInfo?.startDate, roomInfo?.endDate).map((day, index) => ({
            id: `day-${index + 1}`,
            date: day.date,
            label: day.label,
            dayOrder: index + 1,
        }));
    }, [plannerDays, roomInfo?.startDate, roomInfo?.endDate]);

    const mapPlannerPlace = (place) => {
        return {
            id: place.placeId ?? place.id,
            title: place.title ?? "",
            sourceUrl: place.sourceUrl ?? "",
            memo: place.memo ?? "",
            estimatedCost: place.estimatedCost ?? 0,
            isMust: place.isRequired ?? false,
            isScheduled: place.isScheduled ?? false,
            likes: place.reactionSummary?.likeCount ?? 0,
            dislikes: place.reactionSummary?.dislikeCount ?? 0,
            commentCount: place.reactionSummary?.commentCount ?? 0,
            comments: [],
            userReaction: place.myReaction ?? null,
        };
    };

    const mapScheduleItem = (item, places = []) => {
        const safePlaces = Array.isArray(places) ? places : [];

        const startMinutes =
            Number(item.startTime?.split(":")[0] || 0) * 60 +
            Number(item.startTime?.split(":")[1] || 0);

        const endMinutes =
            Number(item.endTime?.split(":")[0] || 0) * 60 +
            Number(item.endTime?.split(":")[1] || 0);

        const matchedPlace = safePlaces.find((place) => place.id === item.placeId);

        return {
            id: item.scheduleItemId || item.id,
            itineraryDayId: item.itineraryDayId || null,
            placeId: item.placeId || null,
            title: matchedPlace?.title || item.title || "",
            date: item.date || "",
            startTime: item.startTime || "",
            endTime: item.endTime || "",
            memo: item.memo ?? "",
            overnight: endMinutes < startMinutes,
        };
    };

    const mapComment = (comment) => ({
        id: comment.commentId ?? comment.id,
        author:
            comment.author ??
            comment.authorName ??
            comment.createdBy ??
            comment.memberName ??
            comment.userName ??
            "익명",
        text: comment.text ?? comment.content ?? "",
        createdAt: comment.createdAt
            ? new Date(comment.createdAt).toLocaleString("ko-KR")
            : "",
    })

    // comments가 배열인지 확인해서 안전하게 반환하는 보조 함수
    const normalizeComments = (comments) => {
        if (Array.isArray(comments)) return comments;
        return [];
    };

    const refreshPlanner = async () => {
        if (!roomId) return;

        try {
            setLoading(true);

            const result = await getPlanner(roomId);

            console.log("===== planner api raw response =====");
            console.log(result);

            if (!result.success || !result.data) {
                console.warn(result.message || "플래너 조회 실패");
                return;
            }

            const data = result.data;

            const mappedPlaces = (data.places ?? [])
                .map(mapPlannerPlace)
                .sort((a, b) => a.title.localeCompare(b.title, "ko"));

            console.log("mappedPlaces:", mappedPlaces);

            const normalizedDays = (data.days ?? []).map((day, index) => ({
                itineraryDayId: day.itineraryDayId ?? null,
                date: day.date,
                dayOrder: day.dayOrder ?? index + 1,
                scheduleItems: day.scheduleItems ?? [],
            }));

            const flattenedScheduleItems =
                (data.scheduleItems ?? []).length > 0
                    ? data.scheduleItems
                    : normalizedDays.flatMap((day) =>
                        (day.scheduleItems ?? []).map((item) => ({
                            ...item,
                            date: item.date ?? day.date,
                            itineraryDayId:
                                item.itineraryDayId ??
                                day.itineraryDayId ??
                                null,
                        }))
                    );

            setRoomInfo(data.room ?? null);
            setPlannerDays(normalizedDays);
            setPlaces(mappedPlaces);
            setScheduledItems(
                flattenedScheduleItems.map((item) =>
                    mapScheduleItem(item, mappedPlaces)
                )
            );
        } catch (error) {
            console.error("===== planner api error =====");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!roomId) return;

        refreshPlanner();

        const intervalId = setInterval(() => {
            refreshPlanner();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [roomId]);

    // 댓글 모달 여부
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    // 현재 댓글 모달에서 보고 있는 장소
    const [selectedCommentPlace, setSelectedCommentPlace] = useState(null);

    /* func: 장소 잠금 */
    const isPlaceLocked = (placeId) => {
        return scheduledItems.some((item) => item.placeId === placeId);
    };

    /* func: 장소 추가 모달 열기 */
    const handleOpenAddModal = () => {
        // 새 추가이므로 editingPlace는 비움
        setEditingPlace(null);
        setIsModalOpen(true);
    };

    /* func: 장소 수정 모달 */
    const handleOpenEditModal = (place) => {
        if (isPlaceLocked(place.id))
            return;

        // 수정할 장소를 저장
        setEditingPlace(place);
        setIsModalOpen(true);
    };

    /* func: 장소 모달 닫기 */
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlace(null);
    };

    /* func: 장소 저장 함수 */
    // 추가/수정 모드 -> 여기서 처리
    const handleSavePlace = async (formData) => {
        const normalizedFormData = {
            ...formData,
            title: formData.title?.trim() || "",
        };

        if (editingPlace) {
            try {
                const result = await updatePlace(roomId, editingPlace.id, {
                    title: normalizedFormData.title,
                    sourceUrl: editingPlace.sourceUrl,
                    memo: normalizedFormData.memo,
                    estimatedCost: Number(normalizedFormData.estimatedCost) || 0,
                    isRequired: editingPlace.isMust,
                });

                console.log("장소 수정 응답:", result);

                if (!result.success) {
                    alert(result.message || "장소 수정에 실패했습니다.");
                    return;
                }

                await refreshPlanner();

                alert(result.message || "장소가 수정되었습니다.");
                handleCloseModal();
                return;
            } catch (error) {
                console.error("장소 수정 실패:", error);
                alert("장소 수정 중 오류가 발생했습니다.");
                return;
            }
        }

        try {
            const result = await createPlace(roomId, {
                title: normalizedFormData.title,
                sourceUrl: normalizedFormData.sourceUrl,
                memo: normalizedFormData.memo,
                estimatedCost: Number(normalizedFormData.estimatedCost) || 0,
            });

            console.log("새 장소 추가 응답:", result);

            if (!result.success) {
                alert(result.message || "장소 추가에 실패했습니다.");
                return;
            }

            await refreshPlanner();


            alert(result.message || "장소가 추가되었습니다.");
            handleCloseModal();

        } catch (error) {
            console.error("새 장소 추가 실패:", error);
            alert("장소 추가 중 오류가 발생했습니다.");
        }
    };

    /* func: 장소 삭제 함수 */
    const handleDeletePlace = async (placeId) => {
        if (isPlaceLocked(placeId))
            return;

        const confirmed = window.confirm("이 장소를 삭제하시겠습니까?");
        if (!confirmed)
            return;

        try {
            const result = await deletePlace(roomId, placeId);

            console.log("장소 삭제 응답:", result);

            if (!result.success) {
                alert(result.message || "장소 삭제에 실패했습니다.");
                return;
            }

            await refreshPlanner();
            setSelectedCommentPlace((prev) =>
                prev?.id === placeId ? null : prev
            );

            alert(result.message || "장소가 삭제되었습니다.");
        } catch (error) {
            console.error("장소 삭제 실패:", error);
            alert("장소 삭제 중 오류가 발생했습니다.");
        }
    };

    /* func: 필수 장소 토글 */
    const handleToggleMust = async (placeId) => {
        if (isPlaceLocked(placeId)) return;

        const targetPlace = places.find((place) => place.id === placeId);
        if (!targetPlace) return;

        try {
            const result = await togglePlaceRequired(
                roomId,
                placeId,
                !targetPlace.isMust
            );

            console.log("필수 장소 변경 응답:", result);

            if (!result.success) {
                alert(result.message || "필수 장소 변경에 실패했습니다.");
                return;
            }

            await refreshPlanner();

            alert(result.message || "필수 여부가 변경되었습니다.");
        } catch (error) {
            console.error("필수 장소 변경 실패:", error);
            alert("필수 여부 변경 중 오류가 발생했습니다.");
        }
    };

    /* func: 좋아요 */
    const handleLike = async (placeId) => {
        if (isPlaceLocked(placeId)) return;

        const targetPlace = places.find((place) => place.id === placeId);
        if (!targetPlace) return;

        const nextReaction =
            targetPlace.userReaction === "LIKE" ? "NONE" : "LIKE";

        try {
            const result = await changePlaceReaction(roomId, placeId, nextReaction);

            console.log("좋아요 변경 응답:", result);

            if (!result.success) {
                alert(result.message || "리액션 변경에 실패했습니다.");
                return;
            }

            // await refreshPlanner();

            setPlaces((prev) =>
                prev.map((place) => {
                    if (place.id !== placeId) return place;

                    const wasLike = place.userReaction === "LIKE";
                    const wasDislike = place.userReaction === "DISLIKE";

                    return {
                        ...place,
                        userReaction: nextReaction === "NONE" ? null : nextReaction,
                        likes: wasLike ? place.likes - 1 : place.likes + 1,
                        dislikes: wasDislike ? place.dislikes - 1 : place.dislikes,
                    };
                })
            );

        } catch (error) {
            console.error("좋아요 변경 실패:", error);
            alert(error?.response?.data?.message || "좋아요 변경 중 오류가 발생했습니다.");
        }
    };

    /* func: 싫어요 */
    const handleDislike = async (placeId) => {
        if (isPlaceLocked(placeId)) return;

        const targetPlace = places.find((place) => place.id === placeId);
        if (!targetPlace) return;

        const nextReaction =
            targetPlace.userReaction === "DISLIKE" ? "NONE" : "DISLIKE";

        try {
            const result = await changePlaceReaction(roomId, placeId, nextReaction);

            console.log("싫어요 변경 응답:", result);

            if (!result.success) {
                alert(result.message || "리액션 변경에 실패했습니다.");
                return;
            }

            // await refreshPlanner();

            setPlaces((prev) =>
                prev.map((place) => {
                    if (place.id !== placeId) return place;

                    const wasLike = place.userReaction === "LIKE";
                    const wasDislike = place.userReaction === "DISLIKE";

                    return {
                        ...place,
                        userReaction: nextReaction === "NONE" ? null : nextReaction,
                        likes: wasLike ? place.likes - 1 : place.likes,
                        dislikes: wasDislike ? place.dislikes - 1 : place.dislikes + 1,
                    };
                })
            );

        } catch (error) {
            console.error("싫어요 변경 실패:", error);
            alert(error?.response?.data?.message || "싫어요 변경 중 오류가 발생했습니다.");
        }
    };

    /* func: 댓글 모달 열기 함수 */
    const handleOpenComments = async (place) => {
        if (isPlaceLocked(place.id))
            return;

        try {
            const result = await getPlaceComments(roomId, place.id);

            console.log("댓글 목록 조회 응답:", result);

            if (!result.success) {
                alert(result.message || "댓글 목록 조회에 실패했습니다.");
                return;
            }

            const fetchedComments = (result.data?.comments ?? []).map(mapComment);

            setSelectedCommentPlace({
                ...place,
                comments: fetchedComments,
            });

            setPlaces((prev) =>
                prev.map((item) =>
                    item.id === place.id
                        ? {
                            ...item,
                            comments: fetchedComments,
                            commentCount: fetchedComments.length,
                        }
                        : item
                )
            );

            setIsCommentModalOpen(true);
        } catch (error) {
            console.error("댓글 목록 조회 실패:", error);
            alert("댓글 목록 조회 중 오류가 발생했습니다.");
        }
    };

    /* func: 댓글 모달 닫기 함수 */
    const handleCloseComments = () => {
        setSelectedCommentPlace(null);
        setIsCommentModalOpen(false);
    };

    /* func: 댓글 추가 함수 */
    const handleAddComment = async (placeId, text) => {
        try {
            const result = await createPlaceComment(roomId, placeId, text);

            console.log("댓글 작성 응답:", result);

            if (!result.success) {
                alert(result.message || "댓글 작성에 실패했습니다.");
                return null;
            }

            await refreshPlanner();

            if (selectedCommentPlace?.id === placeId) {
                const commentsResult = await getPlaceComments(roomId, placeId);

                if (commentsResult.success) {
                    const fetchedComments = (commentsResult.data?.comments ?? []).map(mapComment);

                    setSelectedCommentPlace((prev) =>
                        prev
                            ? {
                                ...prev,
                                comments: fetchedComments,
                                commentCount: fetchedComments.length,
                            }
                            : prev
                    );

                    return fetchedComments[fetchedComments.length - 1];
                }
            }

            return result.data ? mapComment(result.data) : null;

        } catch (error) {
            console.error("댓글 작성 실패:", error);
            alert("댓글 작성 중 오류가 발생했습니다.");
            return null;
        }
    };

    useEffect(() => {
        if (!selectedCommentPlace) return;

        const intervalId = setInterval(async () => {
            try {
                const commentsResult = await getPlaceComments(
                    roomId,
                    selectedCommentPlace.id
                );

                if (commentsResult.success) {
                    const fetchedComments = (commentsResult.data?.comments ?? []).map(mapComment);

                    setSelectedCommentPlace((prev) =>
                        prev
                            ? {
                                ...prev,
                                comments: fetchedComments,
                                commentCount: fetchedComments.length,
                            }
                            : prev
                    );
                }
            } catch (error) {
                console.error("댓글 자동 갱신 실패:", error);
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, [roomId, selectedCommentPlace?.id]);

    /* func: 댓글 삭제 함수 */
    const handleDeleteComment = (placeId, commentId) => {
        setPlaces((prev) =>
            prev.map((place) => {
                if (place.id !== placeId) return place;

                const nextComments = (Array.isArray(place.comments) ? place.comments : []).filter(
                    (comment) => comment.id !== commentId
                );

                return {
                    ...place,
                    comments: nextComments,
                    commentCount: nextComments.length,
                };
            })
        );

        setSelectedCommentPlace((prev) => {
            if (!prev) return prev;

            const nextComments = (Array.isArray(prev.comments) ? prev.comments : []).filter(
                (comment) => comment.id !== commentId
            );

            return {
                ...prev,
                comments: nextComments,
                commentCount: nextComments.length,
            };
        });
    };

    /* func: 일정 확정 모달 열기 */
    const handleOpenScheduleModal = (place = null, type = null) => {
        if (place && isPlaceLocked(place.id))
            return;

        setSelectedPlace(place);
        setSelectedScheduleType(type);
        setIsScheduleModalOpen(true);
    };

    /* func: 일정 확정 모달 닫기 */
    const handleCloseScheduleModal = () => {
        setSelectedPlace(null);
        setSelectedScheduleType(null);
        setIsScheduleModalOpen(false);
    };

    /* func: 일정 저장 */
    const handleSaveSchedule = async (scheduleData) => {
        try {
            const payload = scheduleData.placeId
                ? {
                    placeId: scheduleData.placeId,
                    date: scheduleData.date,
                    startTime: scheduleData.startTime,
                    endTime: scheduleData.endTime,
                    memo: scheduleData.memo ?? null,
                }
                : {
                    title: scheduleData.title,
                    date: scheduleData.date,
                    startTime: scheduleData.startTime,
                    endTime: scheduleData.endTime,
                    memo: scheduleData.memo ?? null,
                };

            const result = await createScheduleItem(roomId, payload);

            console.log("일정 추가 응답:", result);

            if (!result.success) {
                alert(result.message || "일정 추가에 실패했습니다.");
                return;
            }

            await refreshPlanner();

            console.log("일정 추가 요청 payload:", payload);

            alert(result.message || "일정이 추가되었습니다.");
            handleCloseScheduleModal();
        } catch (error) {
            console.error("일정 추가 실패:", error);
            alert("일정 추가 중 오류가 발생했습니다.");
        }
    };

    /* func: 일정 삭제 */
    const handleDeleteSchedule = async (scheduleId) => {
        const targetItem = scheduledItems.find((item) => item.id === scheduleId);

        if (!targetItem) {
            alert("삭제할 일정을 찾을 수 없습니다.");
            return;
        }

        try {
            const result = await deleteScheduleItem(roomId, scheduleId);

            console.log("일정 삭제 응답:", result);

            if (!result.success) {
                alert(result.message || "일정 삭제에 실패했습니다.");
                return;
            }

            await refreshPlanner();

            alert(result.message || "일정 아이템이 삭제되었습니다.");

            console.log("삭제할 scheduleId:", scheduleId);
        } catch (error) {
            console.error("일정 삭제 실패:", error);
            alert("일정 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <section className="planner-layout">
            {/* 왼쪽 일정표 보드 */}
            <PlannerScheduleBoard
                tripDays={tripDays}
                scheduledItems={scheduledItems}
                onDeleteSchedule={handleDeleteSchedule}
                onOpenQuickSchedule={(type) => handleOpenScheduleModal(null, type)}
                onScheduleItemClick={onScheduleItemClick}
            />

            {/* 왼쪽 일정표 보드 */}
            <aside className="planner-sidebar">
                <div className="planner-sidebar-header">
                    <h3>장소 목록</h3>

                    {/* 장소 추가 버튼 */}
                    <button
                        className="add-place-button"
                        onClick={handleOpenAddModal}
                    >
                        + 장소 추가
                    </button>
                </div>

                {/* 장소 목록 리스트 */}
                <div className="place-card-list">
                    {places.map((place) => (
                        <PlaceCard
                            key={place.id}
                            place={place}
                            onEdit={() => handleOpenEditModal(place)}
                            onDelete={() => handleDeletePlace(place.id)}
                            onToggleMust={handleToggleMust}
                            onLike={() => handleLike(place.id)}
                            onDislike={() => handleDislike(place.id)}
                            onSchedule={handleOpenScheduleModal}
                            onOpenComments={handleOpenComments}
                            isHighlighted={highlightedPlaceId === place.id}
                            isLocked={isPlaceLocked(place.id)}
                        />
                    ))}
                </div>
            </aside>

            {/* 장소 추가/수정 모달 */}
            {isModalOpen && (
                <PlaceModal
                    initialData={editingPlace}
                    onClose={handleCloseModal}
                    onSave={handleSavePlace}
                />
            )}

            {/* 일정 추가/확정 모달 */}
            {isScheduleModalOpen && (selectedPlace || selectedScheduleType) && (
                <ScheduleModal
                    place={selectedPlace}
                    fixedType={selectedScheduleType}
                    tripDays={tripDays}
                    onClose={handleCloseScheduleModal}
                    onSave={handleSaveSchedule}
                />
            )}

            {/* 댓글 모달 */}
            {isCommentModalOpen && selectedCommentPlace && (
                <CommentModal
                    place={selectedCommentPlace}
                    onClose={handleCloseComments}
                    onAddComment={handleAddComment}
                // onDeleteComment={handleDeleteComment}
                />
            )}
        </section>
    );
}

export default PlannerTab;