import { useState, useMemo } from "react";
import PlaceCard from "./PlaceCard";
import PlaceModal from "./PlaceModal";
import ScheduleModal from "./ScheduleModal";

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

const getNextDateString = (dateString) => {
    const date = parseDateString(dateString);
    date.setDate(date.getDate() + 1);
    return formatDateString(date);
};

const buildRenderSchedulesForDay = (scheduledItems, dayDate) => {
    const result = [];

    scheduledItems.forEach((item) => {
        const isOvernight = item.overnight === true;

        if (!isOvernight && item.date === dayDate) {
            result.push({
                ...item,
                renderStartTime: item.startTime,
                renderEndTime: item.endTime,
            });
        }

        if (isOvernight && item.date === dayDate) {
            result.push({
                ...item,
                renderStartTime: item.startTime,
                renderEndTime: "24:00",
            });
        }

        if (isOvernight && getNextDateString(item.date) === dayDate) {
            result.push({
                ...item,
                renderStartTime: "00:00",
                renderEndTime: item.endTime,
            });
        }
    });

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
    const [selectedScheduleType, setSelectedScheduleType] = useState(null);

    const tripDays = useMemo(() => {
        return getTripDays(roomData?.startDate, roomData?.endDate);
    }, [roomData?.startDate, roomData?.endDate]);

    const hours = Array.from({ length: 24 }, (_, index) => index);
    const HOUR_HEIGHT = 64;

    const convertTimeToMinutes = (time) => {
        if (time === "24:00") return 24 * 60;

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
                comments: 0,
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
            <div className="planner-left">
                <div className="planner-section-header">
                    <h3 className="planner-title">일정표</h3>

                    <div className="planner-quick-actions">
                        <button
                            className="planner-quick-btn"
                            onClick={() => handleOpenScheduleModal(null, "취침")}
                        >
                            취침
                        </button>
                        <button
                            className="planner-quick-btn"
                            onClick={() => handleOpenScheduleModal(null, "이동")}
                        >
                            이동
                        </button>
                        <button
                            className="planner-quick-btn"
                            onClick={() => handleOpenScheduleModal(null, "휴식")}
                        >
                            휴식
                        </button>
                    </div>
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
                                const daySchedules = buildRenderSchedulesForDay(
                                    scheduledItems,
                                    day.date
                                ).sort(
                                    (a, b) =>
                                        convertTimeToMinutes(a.renderStartTime) -
                                        convertTimeToMinutes(b.renderStartTime)
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
                                                const startMinutes = convertTimeToMinutes(
                                                    item.renderStartTime
                                                );
                                                const endMinutes = convertTimeToMinutes(
                                                    item.renderEndTime
                                                );

                                                return (
                                                    <div
                                                        key={`${item.id}-${day.date}-${item.renderStartTime}`}
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
                                                            {item.renderStartTime} - {item.renderEndTime}
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

            {isScheduleModalOpen && (selectedPlace || selectedScheduleType) && (
                <ScheduleModal
                    place={selectedPlace}
                    fixedType={selectedScheduleType}
                    tripDays={tripDays}
                    onClose={handleCloseScheduleModal}
                    onSave={handleSaveSchedule}
                />
            )}
        </section>
    );
}

export default PlannerTab;