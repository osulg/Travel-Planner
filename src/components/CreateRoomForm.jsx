import { useState } from 'react'
import InputField from './InputField'
import PrimaryButton from './PrimaryButton'
import InlineDatePlanner from './InlineDatePlanner'

/* 
 * 1) 사용자 여행 이름 입력 
 * 2) 사용자 여행 날짜 선택
 * 3) 버튼 누름
 * 4) 입력값 검사
 * 5) 새 방 객체 생성
 * 6) 부모에게 전달
 */

// 새 여행 방 만들기 폼 컴포넌트
// 부모(HomePage)에게 onCreateRoom 함수를 props로 받아서
// 새 여행방 데이터를 만들어 전달하는 역할
function CreateRoomForm({ onCreateRoom }) {
    // 여행방 이름 입력값 state
    const [roomName, setRoomName] = useState('')

    // 여행 시작일 state
    const [startDate, setStartDate] = useState(null)

    // 여행 종료일 state
    const [endDate, setEndDate] = useState(null)

    /* func: 날짜 선택 컴포넌트에서 날짜가 바뀌었을 때 실행되는 함수 */
    const handleDateChange = (update) => {
        // update는 [시작일, 종료일] 형태의 배열이라고 가정
        const [start, end] = update

        // 배열에서 꺼낸 시작일, 종료일을 각각 state에 저장
        setStartDate(start)
        setEndDate(end)
    }

    /* func: Date 객체를 'YYYY-MM-DD' 문자열 형식으로 바꾸는 함수 */
    const formatDateToString = (date) => {
        // date가 없으면 null 반환
        if (!date) return null

        // 연도 추출
        const year = date.getFullYear()

        // 월 추출
        // getMonth()는 0부터 시작하므로 +1 필요
        // padStart(2, '0')로 1 → 01 형태 맞춤
        const month = String(date.getMonth() + 1).padStart(2, '0')

        // 일 추출
        // padStart(2, '0')로 3 → 03 형태 맞춤
        const day = String(date.getDate()).padStart(2, '0')

        // 최종적으로 YYYY-MM-DD 문자열 반환
        return `${year}-${month}-${day}`
    }

    /* func: 방 만들기 버튼 클릭 시 실행되는 함수 */
    const handleCreateRoom = () => {
        // 여행 이름이 비어 있으면 경고창 띄우고 종료
        if (roomName.trim() === '') {
            alert('여행 이름을 입력해주세요')
            return
        }

        // 시작일 또는 종료일이 없으면 경고창 띄우고 종료
        if (!startDate || !endDate) {
            alert('여행 기간을 선택해주세요')
            return
        }

        // 새 여행방 객체 생성
        const newRoom = {
            // 방 자체의 고유 id 생성
            id: crypto.randomUUID(),

            // 사용자가 입력한 여행 이름
            name: roomName,

            // 시작일을 문자열로 변환해서 저장
            startDate: formatDateToString(startDate),

            // 종료일을 문자열로 변환해서 저장
            endDate: formatDateToString(endDate),

            // 생성 시각 저장
            // 날짜/시간을 한국 형식 문자열로 바꿈
            createdAt: new Date().toLocaleString('ko-KR'),

            // 초대 링크 생성
            // 현재 사이트 주소 + /trip/ + 새 uuid 형태
            inviteLink: `${window.location.origin}/trip/${crypto.randomUUID()}`,

            // 처음에는 장소 목록이 없으므로 빈 배열
            places: [],

            // 처음에는 투표 목록이 없으므로 빈 배열
            votes: [],

            // 처음 생성 시 기본 참여자 1명 추가
            // userName이 localStorage에 있으면 그 이름 사용
            // 없으면 기본값 '홍길동'
            members: [
                {
                    id: 1,
                    name: localStorage.getItem('userName') || '홍길동',
                    joinedAt: new Date().toISOString(),
                },
            ],
        }

        // 부모 컴포넌트(HomePage)에게 새 방 데이터를 전달
        onCreateRoom(newRoom)

        // 생성 후 입력값 초기화
        setRoomName('')
        setStartDate(null)
        setEndDate(null)
    }

    return (
        <section className="create-room-form">
            {/* 폼 제목 */}
            <h2 className="create-room-title">새 여행 방 만들기</h2>
            {/* 폼 설명 문구 */}
            <p className="create-room-description">
                여행 정보를 입력하고 친구들을 초대하세요
            </p>

            {/* 여행 이름 입력 컴포넌트 */}
            <InputField
                label="여행 이름"
                placeholder="제주도 힐링 여행"
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                name="roomName"
            />

            {/* 날짜 선택 컴포넌트 */}
            <InlineDatePlanner
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
            />

            {/* 방 만들기 버튼 */}
            <PrimaryButton
                text="방 만들기"
                onClick={handleCreateRoom}
            />
        </section>
    )
}

export default CreateRoomForm