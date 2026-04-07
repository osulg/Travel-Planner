import { useState } from "react";
import "../styles/schedule-modal.css";

function ScheduleModal({ place, fixedType, tripDays, onClose, onSave }) {
    const [date, setDate] = useState(tripDays[0]?.date || "");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");

    const convertTimeToMinutes = (time) => {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    };

    const formatKoreanTime = (time) => {
        const [hour, minute] = time.split(":").map(Number);
        const period = hour < 12 ? "오전" : "오후";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${period} ${String(displayHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    };

    const scheduleTitle = place?.title || fixedType || "";
    const isSleepSchedule = fixedType === "취침";

    const handleSubmit = (e) => {
        e.preventDefault();

        const start = convertTimeToMinutes(startTime);
        const end = convertTimeToMinutes(endTime);
        const isOvernight = isSleepSchedule && end < start;

        if (!isSleepSchedule && end <= start) {
            alert("종료 시간은 시작 시간보다 뒤여야 합니다.");
            return;
        }

        if (isSleepSchedule && end === start) {
            alert("취침 일정은 시작 시간과 종료 시간이 같을 수 없습니다.");
            return;
        }

        onSave({
            id: Date.now(),
            type: place ? "place" : "fixed",
            placeId: place?.id || null,
            title: scheduleTitle,
            date,
            startTime,
            endTime,
            overnight: isOvernight,
        });
    };

    return (
        <div className="schedule-modal-overlay" onClick={onClose}>
            <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
                <div className="schedule-modal-header">
                    <div>
                        <h2 className="schedule-modal-title">일정 확정</h2>
                        <p className="schedule-modal-place">{scheduleTitle}</p>
                    </div>

                    <button
                        type="button"
                        className="schedule-modal-close"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        ×
                    </button>
                </div>

                <form className="schedule-form" onSubmit={handleSubmit}>
                    <div className="schedule-field">
                        <label className="schedule-label">날짜</label>
                        <select
                            className="schedule-select"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        >
                            {tripDays.map((day) => (
                                <option key={day.date} value={day.date}>
                                    {day.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="schedule-time-grid">
                        <div className="schedule-field">
                            <label className="schedule-label">시작 시간</label>
                            <div className="schedule-time-box">
                                <span className="schedule-time-preview">
                                    {formatKoreanTime(startTime)}
                                </span>
                                <input
                                    className="schedule-time-input"
                                    type="time"
                                    step="60"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="schedule-field">
                            <label className="schedule-label">종료 시간</label>
                            <div className="schedule-time-box">
                                <span className="schedule-time-preview">
                                    {formatKoreanTime(endTime)}
                                </span>
                                <input
                                    className="schedule-time-input"
                                    type="time"
                                    step="60"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="schedule-modal-actions">
                        <button type="submit" className="schedule-save-btn">
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ScheduleModal;