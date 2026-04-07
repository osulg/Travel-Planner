import "../styles/trip-create.css";


const PlannerScheduleBoard = ({
    tripDays,
    scheduledItems,
    onDeleteSchedule,
    onOpenQuickSchedule,
    onScheduleItemClick,
}) => {
    const hours = Array.from({ length: 24 }, (_, index) => index);
    const HOUR_HEIGHT = 64;

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

    const getNextDateString = (dateString) => {
        const date = parseDateString(dateString);
        date.setDate(date.getDate() + 1);
        return formatDateString(date);
    };

    const convertTimeToMinutes = (time) => {
        if (time === "24:00") return 24 * 60;
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
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

    return (
        <div className="planner-left">
            <div className="planner-section-header">
                <h3 className="planner-title">일정표</h3>

                <div className="planner-quick-actions">
                    <button
                        type="button"
                        className="planner-quick-btn"
                        onClick={() => onOpenQuickSchedule("취침")}
                    >
                        취침
                    </button>
                    <button
                        type="button"
                        className="planner-quick-btn"
                        onClick={() => onOpenQuickSchedule("이동")}
                    >
                        이동
                    </button>
                    <button
                        type="button"
                        className="planner-quick-btn"
                        onClick={() => onOpenQuickSchedule("휴식")}
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
                                                    onClick={() => onScheduleItemClick?.(item)}
                                                    style={{
                                                        top: `${(startMinutes / 60) * HOUR_HEIGHT}px`,
                                                        height: `${((endMinutes - startMinutes) / 60) * HOUR_HEIGHT}px`,
                                                    }}
                                                >
                                                    <button
                                                        className="schedule-delete-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteSchedule(item.id);
                                                        }}
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
    );
};

export default PlannerScheduleBoard;