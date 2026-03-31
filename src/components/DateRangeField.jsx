// 날짜 범위 선택 컴포넌트
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function DateRangeField() {
  // [시작일, 종료일]을 하나의 배열 상태로 관리
  const [dateRange, setDateRange] = useState([null, null])

  // 배열 분해
  const [startDate, endDate] = dateRange

  return (
    <div className="input-group">
      {/* 라벨 */}
      <label className="input-label">여행 기간</label>

      {/* 날짜 범위 선택 달력 */}
      <DatePicker
        className="input-field"
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update)
        }}
        placeholderText="연도-월-일 ~ 연도-월-일"
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
      />
    </div>
  )
}

export default DateRangeField