import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

/* 
 * 1) 부모가 startDate, endDate, onDateChange 내려줌
 * 2) 해당 날짜를 달력과 요약 카드에 표시
 * 3) 사용자 날짜 선택
 * 4) DatePicker가 onChange={onDateChange} 실행
 * 5) 실제 부모 state 변경됨
 * 6) 부모 state가 바뀌었으므로, 해당 컴포넌트 다시 렌더링
 * -> 즉, 상태는 부모가, 자식은 보여주고 변경 요청
 */

// 인라인 달력 + 날짜 요약 표시 컴포넌트
// 부모(CreateRoomForm)로부터 시작일, 종료일, 날짜 변경 함수를 props로 받아 사용함
function InlineDatePlanner({ startDate, endDate, onDateChange }) {
    /* func: 전체 여행 일수를 계산하는 함수 */
    const calculateTripDays = () => {
        // 시작일이나 종료일이 없으면 아직 계산할 수 없으므로 '-' 반환
        if (!startDate || !endDate) {
            return '-'
        }

        // 종료일 - 시작일 = 두 날짜 사이의 시간 차이(ms 단위)
        const diffTime = endDate.getTime() - startDate.getTime()

        // 밀리초를 하루 단위로 변환
        // Math.ceil로 올림 처리 후 +1을 해서
        // 시작일과 종료일을 모두 포함한 "총 일수" 계산
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

        // 예: "3일" 형태로 문자열 반환
        return `${diffDays}일`
    }

    /* func: Date 객체를 "YYYY-MM-DD" 문자열로 바꾸는 함수 */
    const formatDate = (date) => {
        // 날짜가 없으면 '-' 표시
        if (!date) return '-'

        // 연도 추출
        const year = date.getFullYear()

        // 월 추출
        // getMonth()는 0부터 시작하므로 +1 필요
        // padStart(2, '0')로 두 자리 맞춤
        const month = String(date.getMonth() + 1).padStart(2, '0')

        // 일 추출
        // padStart(2, '0')로 두 자리 맞춤
        const day = String(date.getDate()).padStart(2, '0')

        // 최종 문자열 반환
        return `${year}-${month}-${day}`
    }

    return (
        <div>
            {/* 입력 라벨 */}
            <label className="input-label">여행 기간 선택</label>

            <div className="calendar-layout">
                {/* 왼쪽 달력 영역 */}
                <div className="calendar-panel">
                    <DatePicker
                        // input 형태가 아니라 달력을 화면 안에 바로 표시
                        inline

                        // 시작일~종료일 범위 선택 모드 활성화
                        selectsRange={true}

                        // 현재 시작일
                        startDate={startDate}

                        // 현재 종료일
                        endDate={endDate}

                        // 날짜 선택이 바뀌었을 때 부모가 내려준 함수 실행
                        onChange={onDateChange}

                        // 오늘 이전 날짜는 선택 불가
                        minDate={new Date()}
                    />
                </div>

                {/* 오른쪽 날짜 요약 카드 영역 */}
                <div className="date-summary-panel">
                    {/* 시작일 표시 카드 */}
                    <div className="date-summary-card">
                        <p className="date-summary-label">시작일</p>
                        <h3 className="date-summary-value">{formatDate(startDate)}</h3>
                    </div>

                    {/* 종료일 표시 카드 */}
                    <div className="date-summary-card">
                        <p className="date-summary-label">종료일</p>
                        <h3 className="date-summary-value">{formatDate(endDate)}</h3>
                    </div>

                    {/* 전체 일정 일수 표시 카드 */}
                    <div className="date-summary-card">
                        <p className="date-summary-label">전체 일정 일수</p>
                        <h3 className="date-summary-value">{calculateTripDays()}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InlineDatePlanner