// 항상 보이는 캘린더 + 선택 날짜 요약 컴포넌트
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function InlineDatePlanner() {
    // 시작일, 종료일을 하나의 배열로 관리
    const [dateRange, setDateRange] = useState([null, null])

    // 배열 분해
    const [startDate, endDate] = dateRange

    // 전체 일정 일수 계산 함수
    const calculateTripDays = () => {
        // 시작일이나 종료일이 없으면 표시하지 않음
        if (!startDate || !endDate) {
            return '-'
        }

        // 날짜 차이 계산 (밀리초 기준)
        const diffTime = endDate.getTime() - startDate.getTime()

        // 일수 계산
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

        return `${diffDays}일`
    }

    // 날짜를 보기 좋게 문자열로 바꾸는 함수
    const formatDate = (date) => {
        if (!date) return '-'

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`
    }

    return (
        <div className="calendar-layout">
            {/* 왼쪽: 항상 보이는 달력 */}
            <div className="calendar-panel">
                <label className="input-label">여행 기간 선택</label>

                <DatePicker
                    inline
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    minDate={new Date()}
                />
            </div>

            {/* 오른쪽: 선택 날짜 요약 */}
            <div className="date-summary-panel">
                <div className="date-summary-card">
                    <p className="date-summary-label">시작일</p>
                    <h3 className="date-summary-value">{formatDate(startDate)}</h3>
                </div>

                <div className="date-summary-card">
                    <p className="date-summary-label">종료일</p>
                    <h3 className="date-summary-value">{formatDate(endDate)}</h3>
                </div>

                <div className="date-summary-card">
                    <p className="date-summary-label">전체 일정 일수</p>
                    <h3 className="date-summary-value">{calculateTripDays()}</h3>
                </div>
            </div>
        </div>
    )
}

export default InlineDatePlanner