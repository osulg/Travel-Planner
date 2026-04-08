// 날짜 범위 선택 컴포넌트
import { useState } from 'react'
import DatePicker from 'react-datepicker' // 날짜 선택용 외부 라이브러리
import 'react-datepicker/dist/react-datepicker.css'

function DateRangeField() {
  // [시작일, 종료일]을 하나의 배열 상태로 관리
  // 처음에는 아무 날짜도 선택되지 않았으므로 [null, null]
  const [dateRange, setDateRange] = useState([null, null])

  // 배열 분해
  // dateRange[0] -> startDate
  // dateRange[1] -> endDate
  const [startDate, endDate] = dateRange

  return (
    <div className="input-group">
      {/* 라벨 */}
      <label className="input-label">여행 기간</label>

      {/* 날짜 범위 선택 달력 */}
      <DatePicker
        // input에 적용될 CSS 클래스
        className="input-field"

        // 날짜 1개가 아니라 "범위"를 선택하겠다는 뜻
        selectsRange={true}

        // 현재 선택된 시작일
        startDate={startDate}

        // 현재 선택된 종료일
        endDate={endDate}

        // 날짜가 바뀌었을 때 실행되는 함수
        // update는 [시작일, 종료일] 형태의 배열로 들어옴
        onChange={(update) => {
          setDateRange(update)
        }}

        // 입력창에 아무 값이 없을 때 보여줄 안내 문구
        placeholderText="연도-월-일 ~ 연도-월-일"

        // 화면에 표시할 날짜 형식
        dateFormat="yyyy-MM-dd"

        // 오늘 이전 날짜는 선택하지 못하게 제한
        minDate={new Date()}
      />
    </div>
  )
}

export default DateRangeField