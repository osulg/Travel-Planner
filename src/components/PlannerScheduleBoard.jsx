import "../styles/trip-create.css";

// 일정표 보드 컴포넌트
const PlannerScheduleBoard = ({
    tripDays,              // 여행 날짜 목록
    scheduledItems,        // 저장된 일정 목록
    onDeleteSchedule,      // 일정 삭제 함수
    onOpenQuickSchedule,   // 빠른 일정 추가 모달 열기 함수
    onScheduleItemClick,   // 일정 블록 클릭 함수
}) => {
    // 0시 ~ 23시까지 시간 배열 생성
    const hours = Array.from({ length: 24 }, (_, index) => index);

    // 1시간 칸의 높이(px)
    const HOUR_HEIGHT = 64;

    // "2026-04-08" 같은 문자열을 Date 객체로 바꾸는 함수
    const parseDateString = (dateString) => {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    /* func: Date 객체를 다시 "YYYY-MM-DD" 문자열로 바꾸는 함수 */
    const formatDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // 하루 뒤 날짜 문자열 구하기
    const getNextDateString = (dateString) => {
        const date = parseDateString(dateString);
        date.setDate(date.getDate() + 1);
        return formatDateString(date);
    };

    // "09:30" 같은 시간을 분 단위 숫자로 바꾸는 함수
    const convertTimeToMinutes = (time) => {
        // 자정까지의 끝 시각을 처리하기 위한 예외
        if (time === "24:00") return 24 * 60;
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    };

    // func: 특정 날짜(dayDate)에 실제로 렌더링할 일정 목록 만들기
    const buildRenderSchedulesForDay = (scheduledItems, dayDate) => {
        const result = [];

        scheduledItems.forEach((item) => {
            const isOvernight = item.overnight === true;

            // 일반 일정: 일정 날짜와 현재 날짜가 같으면 그대로 렌더링
            if (!isOvernight && item.date === dayDate) {
                result.push({
                    ...item,
                    renderStartTime: item.startTime,
                    renderEndTime: item.endTime,
                });
            }

            // 자정 넘기는 일정의 첫째 날 부분
            // 예: 23:00 ~ 07:00 이면 첫째 날은 23:00 ~ 24:00 으로 그림
            if (isOvernight && item.date === dayDate) {
                result.push({
                    ...item,
                    renderStartTime: item.startTime,
                    renderEndTime: "24:00",
                });
            }

            // 자정 넘기는 일정의 둘째 날 부분
            // 예: 23:00 ~ 07:00 이면 다음 날은 00:00 ~ 07:00 으로 그림
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
            {/* 일정표 상단 헤더 */}
            <div className="planner-section-header">
                <h3 className="planner-title">일정표</h3>

                {/* 빠른 고정 일정 추가 버튼 */}
                <div className="planner-quick-actions">
                    {/* 취침 버튼 */}
                    <button
                        type="button"
                        className="planner-quick-btn"
                        onClick={() => onOpenQuickSchedule("취침")}
                    >
                        취침
                    </button>

                    {/* 이동 버튼 */}
                    <button
                        type="button"
                        className="planner-quick-btn"
                        onClick={() => onOpenQuickSchedule("이동")}
                    >
                        이동
                    </button>

                    {/* 휴식 버튼 */}
                    <button
                        type="button"
                        className="planner-quick-btn"
                        onClick={() => onOpenQuickSchedule("휴식")}
                    >
                        휴식
                    </button>
                </div>
            </div>

            {/* 일정표 전체 보드 */}
            <div className="planner-board">
                <div className="planner-grid-column-layout">

                    {/* 왼쪽 시간축 */}
                    <div className="planner-time-column">
                        <div className="planner-top-empty"></div>

                        {hours.map((hour) => (
                            <div key={hour} className="planner-time-label-cell">
                                {String(hour).padStart(2, "0")}:00
                            </div>
                        ))}
                    </div>

                    {/* 날짜별 컬럼 영역 */}
                    <div
                        className="planner-days-columns"
                        style={{
                            gridTemplateColumns: `repeat(${tripDays.length}, minmax(180px, 1fr))`,
                        }}
                    >
                        {tripDays.map((day) => {
                            // 현재 날짜에 렌더링할 일정들만 추출 후 시작 시간순 정렬
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
                                    {/* 날짜 헤더 */}
                                    <div className="planner-day-column-header">
                                        {day.label}
                                    </div>

                                    {/* 날짜 본문 */}
                                    <div className="planner-day-column-body">
                                        {/* 24시간 칸 배경 */}
                                        {hours.map((hour) => (
                                            <div key={hour} className="planner-hour-cell" />
                                        ))}

                                        {/* 실제 일정 블록 */}
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
                                                        // 시작 시간을 기준으로 위에서부터 위치 계산
                                                        top: `${(startMinutes / 60) * HOUR_HEIGHT}px`,

                                                        // 일정 길이에 따라 높이 계산
                                                        height: `${((endMinutes - startMinutes) / 60) * HOUR_HEIGHT}px`,
                                                    }}
                                                >
                                                    {/* 일정 삭제 버튼 */}
                                                    <button
                                                        className="schedule-delete-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteSchedule(item.id);
                                                        }}
                                                    >
                                                        ×
                                                    </button>

                                                    {/* 일정 제목과 시간 */}
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