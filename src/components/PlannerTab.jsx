import { useState, useMemo } from "react";
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
    places,                 // 장소 목록
    setPlaces,              // 장소 목록 수정 함수
    scheduledItems,         // 일정표 항목 목록
    setScheduledItems,      // 일정표 항목 수정 함수
    roomData,               // 방 기본 정보 (이름, 날짜 등)
    highlightedPlaceId,     // 현재 강조 표시할 장소 id
    onScheduleItemClick,    // 일정 클릭 시 부모로 알리는 함수
}) {
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
        return getTripDays(roomData?.startDate, roomData?.endDate);
    }, [roomData?.startDate, roomData?.endDate]);

    // comments가 배열인지 확인해서 안전하게 반환하는 보조 함수
    const normalizeComments = (comments) => {
        if (Array.isArray(comments)) return comments;
        return [];
    };

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
    const handleSavePlace = (formData) => {
        // title 공백 제거 후 정리
        const normalizedFormData = {
            ...formData,
            title: formData.title?.trim() || "",
        };

        // title 공백 제거 후 정리
        if (editingPlace) {
            setPlaces((prev) =>
                prev.map((place) =>
                    place.id === editingPlace.id
                        ? {
                            // 기존 place 유지
                            ...place,

                            // 새 입력값 반영
                            ...normalizedFormData,

                            // title은 정리된 값 사용
                            title: normalizedFormData.title,

                            // 링크 관련 값은 수정 불가이므로 기존 값 유지
                            sourceUrl: place.sourceUrl,
                            sourceType: place.sourceType,
                        }
                        : place
                )
            );

            // 장소 이름이 바뀌면 일정표에 반영된 title도 같이 바꿔줌
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
        }
        // 새 장소 추가 모드
        else {
            const newPlace = {
                id: Date.now(),       // 임시 고유 id
                likes: 0,             // 좋아요 초기값
                dislikes: 0,          // 싫어요 초기값
                comments: [],         // 댓글 초기값
                isMust: false,        // 필수 장소 여부 초기값
                userReaction: null,   // 현재 사용자 반응 없음
                ...normalizedFormData,
                title: normalizedFormData.title,
            };

            // 새 장소를 목록 맨 앞에 추가
            setPlaces((prev) => [newPlace, ...prev]);
        }

        // 저장 후 모달 닫기
        handleCloseModal();
    };

    /* func: 장소 삭제 함수 */
    const handleDeletePlace = (placeId) => {
        if (isPlaceLocked(placeId))
            return;

        const confirmed = window.confirm("이 장소를 삭제하시겠습니까?");

        if (!confirmed)
            return;

        setPlaces((prev) =>
            prev.filter((place) => place.id !== placeId)
        );
    };

    /* func: 필수 장소 토글 */
    const handleToggleMust = (placeId) => {
        if (isPlaceLocked(placeId))
            return;

        setPlaces((prev) =>
            prev.map((place) =>
                place.id === placeId
                    ? { ...place, isMust: !place.isMust }
                    : place
            )
        );
    };

    /* func: 좋아요 처리 */
    const handleLike = (placeId) => {
        if (isPlaceLocked(placeId))
            return;

        setPlaces((prev) =>
            prev.map((place) => {
                // 새 장소를 목록 맨 앞에 추가
                if (place.id !== placeId)
                    return place;

                // 클릭한 장소가 아니면 그대로 반환
                if (place.userReaction === "like") {
                    return {
                        ...place,
                        likes: Math.max(0, place.likes - 1),
                        userReaction: null,
                    };
                }

                // 이미 좋아요 상태였다면 좋아요 취소
                if (place.userReaction === "dislike") {
                    return {
                        ...place,
                        likes: place.likes + 1,
                        dislikes: Math.max(0, place.dislikes - 1),
                        userReaction: "like",
                    };
                }

                // 아무 반응이 없었다면 좋아요만 추가
                return {
                    ...place,
                    likes: place.likes + 1,
                    userReaction: "like",
                };
            })
        );
    };

    /* func: 싫어요 처리 */
    const handleDislike = (placeId) => {
        if (isPlaceLocked(placeId))
            return;

        setPlaces((prev) =>
            prev.map((place) => {
                if (place.id !== placeId) return place;

                // 아무 반응이 없었다면 좋아요만 추가
                if (place.userReaction === "dislike") {
                    return {
                        ...place,
                        dislikes: Math.max(0, place.dislikes - 1),
                        userReaction: null,
                    };
                }

                // 이미 싫어요 상태였다면 싫어요 취소
                if (place.userReaction === "like") {
                    return {
                        ...place,
                        likes: Math.max(0, place.likes - 1),
                        dislikes: place.dislikes + 1,
                        userReaction: "dislike",
                    };
                }

                // 기존에 좋아요였다면 좋아요 1 감소 + 싫어요 1 증가
                return {
                    ...place,
                    dislikes: place.dislikes + 1,
                    userReaction: "dislike",
                };
            })
        );
    };

    /* func: 댓글 모달 열기 함수 */
    const handleOpenComments = (place) => {
        if (isPlaceLocked(place.id))
            return;

        setSelectedCommentPlace(place);
        setIsCommentModalOpen(true);
    };

    /* func: 댓글 모달 닫기 함수 */
    const handleCloseComments = () => {
        setSelectedCommentPlace(null);
        setIsCommentModalOpen(false);
    };

    /* func: 댓글 추가 함수 */
    const handleAddComment = (placeId, text) => {
        const newComment = {
            id: Date.now(),
            author: localStorage.getItem("userName") || "홍길동",
            text,
            createdAt: new Date().toLocaleString("ko-KR"),
        };

        // places 배열 안의 해당 장소 comments에 댓글 추가
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

        // 현재 열려 있는 댓글 모달의 선택 장소에도 즉시 반영
        setSelectedCommentPlace((prev) =>
            prev
                ? {
                    ...prev,
                    comments: [...(Array.isArray(prev.comments) ? prev.comments : []), newComment],
                }
                : prev
        );
    };

    /* func: 댓글 삭제 함수 */
    const handleDeleteComment = (placeId, commentId) => {
        // places 배열에서 해당 댓글 삭제
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

        // places 배열에서 해당 댓글 제거
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
    const handleSaveSchedule = (scheduleData) => {
        setScheduledItems((prev) => [scheduleData, ...prev]);
        handleCloseScheduleModal();
    };

    /* func: 일정 삭제 */
    const handleDeleteSchedule = (scheduleId) => {
        setScheduledItems((prev) =>
            prev.filter((item) => item.id !== scheduleId)
        );
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
                    onDeleteComment={handleDeleteComment}
                />
            )}
        </section>
    );
}

export default PlannerTab;