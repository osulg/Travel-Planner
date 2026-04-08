import { useState } from "react";
import "../styles/schedule-modal.css";

// 일정 확정 모달 컴포넌트
function ScheduleModal({ place, fixedType, tripDays, onClose, onSave }) {
    // 선택된 날짜
    // tripDays 첫 번째 날짜를 기본값으로 사용
    const [date, setDate] = useState(tripDays[0]?.date || "");

    // 시작 시간 기본값
    const [startTime, setStartTime] = useState("09:00");

    // 종료 시간 기본값
    const [endTime, setEndTime] = useState("10:00");

    // "09:30" 같은 시간을 분 단위 숫자로 변환하는 함수
    // 예: "09:30" -> 570
    const convertTimeToMinutes = (time) => {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    };

    // 시간을 "오전 09:00", "오후 01:30" 형식으로 바꿔주는 함수
    const formatKoreanTime = (time) => {
        const [hour, minute] = time.split(":").map(Number);
        const period = hour < 12 ? "오전" : "오후";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;

        return `${period} ${String(displayHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    };

    // 일정 제목 결정
    // place가 있으면 장소 이름 사용
    // 없으면 fixedType(취침/이동/휴식 등) 사용
    const scheduleTitle = place?.title || fixedType || "";

    // 취침 일정인지 여부
    const isSleepSchedule = fixedType === "취침";

    // 저장 버튼 클릭 시 실행
    const handleSubmit = (e) => {
        e.preventDefault(); // form 기본 동작 방지

        const start = convertTimeToMinutes(startTime);
        const end = convertTimeToMinutes(endTime);

        // 취침 일정은 자정을 넘길 수 있으므로
        // 종료 시간이 시작 시간보다 작으면 overnight 처리
        const isOvernight = isSleepSchedule && end < start;

        // 일반 일정은 종료 시간이 시작 시간보다 뒤여야 함
        if (!isSleepSchedule && end <= start) {
            alert("종료 시간은 시작 시간보다 뒤여야 합니다.");
            return;
        }

        // 취침 일정은 시작/종료 시간이 같으면 안 됨
        if (isSleepSchedule && end === start) {
            alert("취침 일정은 시작 시간과 종료 시간이 같을 수 없습니다.");
            return;
        }

        // 부모 컴포넌트로 저장할 일정 데이터 전달
        onSave({
            id: Date.now(),                     // 임시 고유 id
            type: place ? "place" : "fixed",   // 장소 일정인지 고정 일정인지 구분
            placeId: place?.id || null,        // 장소 일정이면 place id 저장
            title: scheduleTitle,              // 일정 제목
            date,                              // 선택 날짜
            startTime,                         // 시작 시간
            endTime,                           // 종료 시간
            overnight: isOvernight,            // 자정 넘김 여부
        });
    };


    return (
        // 모달 배경
        // 바깥 클릭 시 닫기
        <div className="schedule-modal-overlay" onClick={onClose}>
            {/* 실제 모달 창 */}
            {/* 내부 클릭 시 바깥으로 이벤트 전파 방지 */}
            <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
                <div className="schedule-modal-header">
                    <div>
                        <h2 className="schedule-modal-title">일정 확정</h2>
                        <p className="schedule-modal-place">{scheduleTitle}</p>
                    </div>

                    {/* 닫기 버튼 */}
                    <button
                        type="button"
                        className="schedule-modal-close"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        ×
                    </button>
                </div>

                {/* 입력 폼 */}
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

                    {/* 시작 시간 선택 */}
                    <div className="schedule-time-grid">
                        <div className="schedule-field">
                            <label className="schedule-label">시작 시간</label>
                            <div className="schedule-time-box">
                                {/* 사람이 보기 좋은 한글 시간 표시 */}
                                <span className="schedule-time-preview">
                                    {formatKoreanTime(startTime)}
                                </span>

                                {/* 실제 입력용 time input */}
                                <input
                                    className="schedule-time-input"
                                    type="time"
                                    step="60"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 종료 시간 선택 */}
                        <div className="schedule-field">
                            <label className="schedule-label">종료 시간</label>
                            <div className="schedule-time-box">
                                {/* 사람이 보기 좋은 한글 시간 표시 */}
                                <span className="schedule-time-preview">
                                    {formatKoreanTime(endTime)}
                                </span>

                                {/* 실제 입력용 time input */}
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

                    {/* 저장 버튼 */}
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