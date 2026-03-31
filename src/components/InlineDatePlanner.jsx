import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function InlineDatePlanner({ startDate, endDate, onDateChange }) {
    const calculateTripDays = () => {
        if (!startDate || !endDate) {
            return '-'
        }

        const diffTime = endDate.getTime() - startDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

        return `${diffDays}일`
    }

    const formatDate = (date) => {
        if (!date) return '-'

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`
    }

    return (
        <div>
            <label className="input-label">여행 기간 선택</label>

            <div className="calendar-layout">
                <div className="calendar-panel">
                    <DatePicker
                        inline
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={onDateChange}
                        minDate={new Date()}
                    />
                </div>

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
        </div>
    )
}

export default InlineDatePlanner