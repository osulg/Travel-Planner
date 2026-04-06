import { useState } from "react";

function ScheduleModal({ place, tripDays, onClose, onSave }) {
    const [date, setDate] = useState(tripDays[0]?.date || "");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");

    const convertTimeToMinutes = (time) => {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const start = convertTimeToMinutes(startTime);
        const end = convertTimeToMinutes(endTime);

        if (end <= start) {
            alert("종료 시간은 시작 시간보다 뒤여야 합니다.");
            return;
        }

        onSave({
            id: Date.now(),
            placeId: place.id,
            title: place.title,
            date,
            startTime,
            endTime,
        });
    };

    return (
        <div className="place-modal-overlay" onClick={onClose}>
            <div className="place-modal" onClick={(e) => e.stopPropagation()}>
                <h2>일정 확정</h2>
                <p>{place.title}</p>

                <form className="place-form" onSubmit={handleSubmit}>
                    <select value={date} onChange={(e) => setDate(e.target.value)}>
                        {tripDays.map((day) => (
                            <option key={day.date} value={day.date}>
                                {day.label}
                            </option>
                        ))}
                    </select>

                    <input
                        type="time"
                        step="60"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />

                    <input
                        type="time"
                        step="60"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />

                    <div className="place-modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="modal-cancel-btn"
                        >
                            취소
                        </button>
                        <button type="submit" className="modal-save-btn">
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ScheduleModal;