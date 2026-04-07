import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PlannerTab from '../components/PlannerTab'
import VotesTab from '../components/VotesTab'
import SettingsTab from '../components/SettingsTab'
import '../styles/trip-create.css'

function RoomPage() {
    const { roomId } = useParams()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('planner')
    const [roomData, setRoomData] = useState(null)

    const [places, setPlaces] = useState([])
    const [votes, setVotes] = useState([])
    const [scheduledItems, setScheduledItems] = useState([])

    useEffect(() => {
        setIsLoading(true)

        const savedRooms = JSON.parse(localStorage.getItem('rooms')) || []
        const foundRoom = savedRooms.find(
            (room) => String(room.id) === String(roomId)
        )

        if (foundRoom) {
            const normalizedPlaces = (foundRoom.places || []).map((place) => ({
                ...place,
                title: place.title || place.name || '',
            }))

            setRoomData(foundRoom)
            setPlaces(normalizedPlaces)
            setVotes(foundRoom.votes || [])
            setScheduledItems(foundRoom.scheduledItems || [])
        }

        setIsLoading(false)
    }, [roomId])

    useEffect(() => {
        if (!roomData) return

        const savedRooms = JSON.parse(localStorage.getItem('rooms')) || []
        const updatedRooms = savedRooms.map((room) =>
            String(room.id) === String(roomId)
                ? {
                    ...room,
                    ...roomData,
                    places,
                    votes,
                    scheduledItems,
                }
                : room
        )

        localStorage.setItem('rooms', JSON.stringify(updatedRooms))
    }, [roomId, roomData, places, votes, scheduledItems])

    const renderTabContent = () => {
        switch (activeTab) {
            case 'planner':
                return (
                    <PlannerTab
                        places={places}
                        setPlaces={setPlaces}
                        scheduledItems={scheduledItems}
                        setScheduledItems={setScheduledItems}
                        roomData={roomData}
                    />
                )

            case 'votes':
                return (
                    <VotesTab
                        places={places}
                        votes={votes}
                        setVotes={setVotes}
                    />
                )

            case 'settings':
                return (
                    <SettingsTab
                        roomData={roomData}
                        setRoomData={setRoomData}
                    />
                )

            default:
                return null
        }
    }

    if (isLoading) {
        return <div className="room-page">불러오는 중...</div>
    }

    if (!roomData) {
        return <div className="room-page">방 정보를 찾을 수 없습니다.</div>
    }

    return (
        <div className="room-page">
            <header className="room-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ←
                </button>

                <div className="room-header-text">
                    <h1 className="room-title">{roomData.name}</h1>
                    <p className="room-date">
                        {roomData.startDate} - {roomData.endDate}
                    </p>
                </div>
            </header>

            <nav className="room-tab-menu">
                <button
                    className={activeTab === 'planner' ? 'room-tab active' : 'room-tab'}
                    onClick={() => setActiveTab('planner')}
                >
                    일정 플래너
                </button>

                <button
                    className={activeTab === 'votes' ? 'room-tab active' : 'room-tab'}
                    onClick={() => setActiveTab('votes')}
                >
                    투표
                </button>

                <button
                    className={activeTab === 'settings' ? 'room-tab active' : 'room-tab'}
                    onClick={() => setActiveTab('settings')}
                >
                    설정
                </button>
            </nav>

            <main className="room-content">{renderTabContent()}</main>
        </div>
    )
}

export default RoomPage