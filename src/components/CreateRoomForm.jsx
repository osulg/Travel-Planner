import { useState } from 'react'
import InputField from './InputField'
import PrimaryButton from './PrimaryButton'
import InlineDatePlanner from './InlineDatePlanner'

// 새 여행 방 만들기 폼 컴포넌트
function CreateRoomForm({ onCreateRoom }) {
    const [roomName, setRoomName] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const handleDateChange = (update) => {
        const [start, end] = update
        setStartDate(start)
        setEndDate(end)
    }

    const formatDateToString = (date) => {
        if (!date) return null

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`
    }

    const handleCreateRoom = () => {
        if (roomName.trim() === '') {
            alert('여행 이름을 입력해주세요')
            return
        }

        if (!startDate || !endDate) {
            alert('여행 기간을 선택해주세요')
            return
        }

        const newRoom = {
            id: crypto.randomUUID(),
            name: roomName,
            startDate: formatDateToString(startDate),
            endDate: formatDateToString(endDate),
            createdAt: new Date().toLocaleString('ko-KR'),
            inviteLink: `${window.location.origin}/trip/${crypto.randomUUID()}`,
            places: [],
            votes: [],
            members: [
                {
                    id: 1,
                    name: localStorage.getItem('userName') || '홍길동',
                    joinedAt: new Date().toISOString(),
                    role: 'host',
                },
            ],
        }

        onCreateRoom(newRoom)

        setRoomName('')
        setStartDate(null)
        setEndDate(null)
    }

    return (
        <section className="create-room-form">
            <h2 className="create-room-title">새 여행 방 만들기</h2>
            <p className="create-room-description">
                여행 정보를 입력하고 친구들을 초대하세요
            </p>

            <InputField
                label="여행 이름"
                placeholder="제주도 힐링 여행"
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                name="roomName"
            />

            <InlineDatePlanner
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
            />

            <PrimaryButton
                text="방 만들기"
                onClick={handleCreateRoom}
            />
        </section>
    )
}

export default CreateRoomForm