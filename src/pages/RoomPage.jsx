import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PlannerTab from '../components/PlannerTab'
import VotesTab from '../components/VotesTab'
import SettingsTab from '../components/SettingsTab'
import '../styles/trip-create.css'

/* 
 * 1) 방 id 읽음 
 * 2) localStorage에서 해당 방 찾기
 * 3) 찾은 방 데이터를 state에 넣음
 * 4) 하위 탭 컴포넌트에 props로 내려줌
 * 5) 하위에서 수정 발새? -> 상위 state가 바뀜
 *    - 장소 수정 → setPlaces
 *    - 투표 수정 → setVotes
 *    - 설정 수정 → setRoomData
 * 6) state가 바뀌면 다시 localStorage에 저장
 */


// 여행방 상세 페이지
function RoomPage() {
    // URL 파라미터에서 roomId 값을 가져옴
    // 예: /trip/123 이면 roomId는 "123"
    const { roomId } = useParams()

    // 페이지 이동 함수
    // 뒤로 가기 버튼 등에 사용
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true) // 현재 데이터를 불러오는 중인지 여부

    // 현재 선택된 탭 상태
    // 기본값은 planner 탭
    const [activeTab, setActiveTab] = useState('planner')

    // 현재 여행방의 전체 정보
    // 예: 방 이름, 시작일, 종료일 등
    const [roomData, setRoomData] = useState(null)


    const [places, setPlaces] = useState([]) // 장소 목록 상태
    const [votes, setVotes] = useState([])  // 투표 목록 상태
    const [scheduledItems, setScheduledItems] = useState([]) // 일정표에 올라간 항목들 상태

    // 현재 강조 표시할 장소 id
    // 예: 일정표에서 어떤 항목을 눌렀을 때
    // 그 항목과 연결된 장소 카드를 강조하고 싶을 때 사용
    const [highlightedPlaceId, setHighlightedPlaceId] = useState(null);

    // roomId가 바뀔 때 실행되는 effect
    // 즉, 다른 여행방 페이지로 들어가면 다시 해당 방 정보를 불러옴
    useEffect(() => {
        // 데이터 불러오기 시작
        setIsLoading(true)

        // localStorage에 저장된 rooms 배열을 가져옴
        // 없으면 빈 배열 사용
        const savedRooms = JSON.parse(localStorage.getItem('rooms')) || []

        // 현재 URL의 roomId와 일치하는 여행방 찾기
        const foundRoom = savedRooms.find(
            (room) => String(room.id) === String(roomId)
        )

        // 해당 여행방을 찾은 경우
        if (foundRoom) {
            // places 안의 각 장소 데이터를 한 번 정리(normalize)
            // title이 없고 name만 있을 수도 있으니
            // title이 비어 있으면 name 값을 대신 넣어줌
            const normalizedPlaces = (foundRoom.places || []).map((place) => ({
                ...place,
                title: place.title || place.name || '',
            }))

            setRoomData(foundRoom) // 방 기본 정보 저장
            setPlaces(normalizedPlaces) // 정리된 장소 목록 저장
            setVotes(foundRoom.votes || []) // 저장된 투표 목록 불러오기
            setScheduledItems(foundRoom.scheduledItems || []) //저장된 일정 항목 불러오기
        }

        // 데이터 불러오기 종료
        setIsLoading(false)
    }, [roomId])

    // roomData, places, votes, scheduledItems 값이 바뀔 때마다
    // 현재 방 데이터를 localStorage에 다시 저장하는 effect
    useEffect(() => {
        // roomData가 아직 없으면 저장하지 않음
        if (!roomData) return

        // 기존 여행방 목록 불러오기
        const savedRooms = JSON.parse(localStorage.getItem('rooms')) || []

        // 현재 roomId에 해당하는 방만 새 데이터로 교체
        const updatedRooms = savedRooms.map((room) =>
            String(room.id) === String(roomId)
                ? {
                    // 기존 room 정보 유지
                    ...room,

                    // roomData에 들어 있는 최신 정보 반영
                    ...roomData,

                    // 장소, 투표, 일정표 상태값도 같이 반영
                    places,
                    votes,
                    scheduledItems,
                }
                : room
        )

        // 업데이트된 전체 rooms 배열을 다시 저장
        localStorage.setItem('rooms', JSON.stringify(updatedRooms))
    }, [roomId, roomData, places, votes, scheduledItems])

    /* func: 일정표 항목을 클릭했을 때 실행되는 함수 */
    const handleScheduleItemClick = (item) => {
        // 클릭된 항목 확인용 로그
        console.log("clicked item:", item);

        // 클릭한 일정 항목과 연결된 장소를 강조 표시하도록 id 저장
        if (!item.placeId) return;
        setHighlightedPlaceId(item.placeId);
    }

    /* func: 현재 activeTab 값에 따라 어떤 컴포넌트를 보여줄지 결정하는 함수 */
    const renderTabContent = () => {
        switch (activeTab) {
            // 일정 플래너 탭
            case 'planner':
                return (
                    <PlannerTab
                        // 장소 목록 전달
                        places={places}

                        // 장소 수정 함수 전달
                        setPlaces={setPlaces}

                        // 일정 항목 목록 전달
                        scheduledItems={scheduledItems}

                        // 일정 항목 수정 함수 전달
                        setScheduledItems={setScheduledItems}

                        // 방 기본 정보 전달
                        roomData={roomData}

                        // 현재 강조 중인 장소 id 전달
                        highlightedPlaceId={highlightedPlaceId}

                        // 일정표 항목 클릭 시 실행할 함수 전달
                        onScheduleItemClick={handleScheduleItemClick}
                    />
                )

            // 투표 탭
            case 'votes':
                return (
                    <VotesTab
                        // 장소 목록 전달
                        // 투표에서 장소 리스트를 활용할 수 있음
                        places={places}

                        // 투표 목록 전달
                        votes={votes}

                        // 투표 수정 함수 전달
                        setVotes={setVotes}
                    />
                )

            // 설정 탭
            case 'settings':
                return (
                    <SettingsTab
                        // 방 정보 전달
                        roomData={roomData}

                        // 방 정보 수정 함수 전달
                        setRoomData={setRoomData}
                    />
                )

            // 정의되지 않은 탭
            default:
                return null
        }
    }

    // 아직 데이터를 불러오는 중이면 로딩 문구 출력
    if (isLoading) {
        return <div className="room-page">불러오는 중...</div>
    }

    // 로딩은 끝났는데 방 정보가 없으면 에러 안내 문구 출력
    if (!roomData) {
        return <div className="room-page">방 정보를 찾을 수 없습니다.</div>
    }

    return (
        <div className="room-page">
            <header className="room-header">
                {/* 뒤로 가기 버튼 */}
                <button className="back-button" onClick={() => navigate(-1)}>
                    ←
                </button>

                {/* 여행방 제목과 날짜 표시 영역 */}
                {/* 여행방 페이지 상단에 제목과 날짜 의미 */}
                <div className="room-header-text">
                    <h1 className="room-title">{roomData.name}</h1>
                    <p className="room-date">
                        {roomData.startDate} - {roomData.endDate}
                    </p>
                </div>
            </header>

            <nav className="room-tab-menu">
                {/* planner 탭 버튼 */}
                <button
                    className={activeTab === 'planner' ? 'room-tab active' : 'room-tab'}
                    onClick={() => setActiveTab('planner')}
                >
                    일정 플래너
                </button>

                {/* votes 탭 버튼 */}
                <button
                    className={activeTab === 'votes' ? 'room-tab active' : 'room-tab'}
                    onClick={() => setActiveTab('votes')}
                >
                    투표
                </button>

                {/* settings 탭 버튼 */}
                <button
                    className={activeTab === 'settings' ? 'room-tab active' : 'room-tab'}
                    onClick={() => setActiveTab('settings')}
                >
                    설정
                </button>
            </nav>

            {/* 현재 탭에 맞는 내용 표시 */}
            <main className="room-content">{renderTabContent()}</main>
        </div>
    )
}

export default RoomPage