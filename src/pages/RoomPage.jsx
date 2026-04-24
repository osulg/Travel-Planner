import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PlannerTab from '../components/PlannerTab'
import VotesTab from '../components/VotesTab'
import SettingsTab from '../components/SettingsTab'
import '../styles/trip-create.css'

import { getRoomSummary, getRoomSettings } from '../api/roomApi'
import { addTripRoomId, saveInviteTokenForRoom, getActiveMemberForRoom } from '../utils/storage'


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

    const activeMember = getActiveMemberForRoom(roomId)

    const currentUserName =
        activeMember?.name || activeMember?.memberName || ''

    useEffect(() => {
        if (!roomId) return
        addTripRoomId(roomId)
    }, [roomId])

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

    const [settingsData, setSettingsData] = useState(null)

    // roomId가 바뀔 때 실행되는 effect
    // 즉, 다른 여행방 페이지로 들어가면 다시 해당 방 정보를 불러옴
    useEffect(() => {
        const fetchRoomSummary = async () => {
            if (!roomId) return

            setIsLoading(true)

            try {
                const response = await getRoomSummary(roomId)
                const summary = response.data

                if (!response.success || !summary) {
                    setRoomData(null)
                    return
                }

                setRoomData((prev) => ({
                    ...(prev || {}),
                    id: summary.roomId,
                    name: summary.name,
                    startDate: summary.startDate,
                    endDate: summary.endDate,
                }))
            } catch (error) {
                console.error('방 요약 조회 실패:', error)
                setRoomData(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRoomSummary()
    }, [roomId])

    const refreshRoomSettings = async () => {
        if (!roomId) return;

        try {
            const response = await getRoomSettings(roomId);

            console.log('getRoomSettings 전체 응답:', response);
            console.log('settings response.data:', response.data);

            const settings = response.data;

            console.log('settings data:', settings);

            if (!response.success || !settings) {
                setSettingsData(null);
                return;
            }

            setSettingsData(settings);

            if (settings.invite?.token) {
                saveInviteTokenForRoom(roomId, settings.invite.token);
                console.log('저장된 invite token:', settings.invite.token);
            }
        } catch (error) {
            console.error('설정 조회 실패:', error);
            setSettingsData(null);
        }
    };

    useEffect(() => {
        if (!roomId) return;

        refreshRoomSettings();

        const intervalId = setInterval(() => {
            refreshRoomSettings();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [roomId]);

    /* func: 일정표 항목을 클릭했을 때 실행되는 함수 */
    const handleScheduleItemClick = (item) => {
        // 클릭된 항목 확인용 로그
        console.log("clicked item:", item);

        // 클릭한 일정 항목과 연결된 장소를 강조 표시하도록 id 저장
        if (!item.placeId) return;

        setHighlightedPlaceId((prev) =>
            prev === item.placeId ? null : item.placeId
        );
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
            <main className="room-content">
                <div style={{ display: activeTab === 'planner' ? 'block' : 'none' }}>
                    <PlannerTab
                        roomId={roomId}
                        places={places}
                        setPlaces={setPlaces}
                        scheduledItems={scheduledItems}
                        setScheduledItems={setScheduledItems}
                        highlightedPlaceId={highlightedPlaceId}
                        onScheduleItemClick={handleScheduleItemClick}
                        currentUserName={currentUserName}
                    />
                </div>

                <div style={{ display: activeTab === 'votes' ? 'block' : 'none' }}>
                    <VotesTab
                        roomId={roomId}
                        places={places}
                        votes={votes}
                        setVotes={setVotes}
                        currentUserName={currentUserName}
                    />
                </div>

                <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
                    <SettingsTab
                        roomData={roomData}
                        settingsData={settingsData}
                    />
                </div>
            </main>
        </div>
    )
}

export default RoomPage