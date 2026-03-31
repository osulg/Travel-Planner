import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../styles/trip-create.css'

function RoomPage() {
    const { roomId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const roomData = location.state || {}
    const [activeTab, setActiveTab] = useState('places')

    const renderTabContent = () => {
        switch (activeTab) {
            case 'places':
                return <p className='empty-message'>아직 추가된 장소가 없습니다</p>
            case 'votes':
                return <p className='empty-message'>아직 생성된 투표가 없습니다</p>
            case 'schedule':
                return <p className='empty-message'>일정을 배치할 수 있는 영역입니다</p>
            case 'timeline':
                return <p className='empty-message'>아직 확정된 일정이 없습니다</p>
            case 'settings':
                return <p className='empty-message'>설정 화면 영역입니다</p>
            default:
                return null;
        }
    }

    const getActionButton = () => {
        switch (activeTab) {
            case 'places':
                return '장소 추가'
            case 'votes':
                return '투표 추가'
            default:
                return ''
        }
    }


    return (
        <div className="room-page">
            <header className="room-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ←
                </button>

                <div className="room-header-text">
                    <h1 className="room-title">{roomData.roomName || '여행방'}</h1>
                    <p className="room-date">
                        {roomData.startDate || '-'} - {roomData.endDate || '-'}
                    </p>
                </div>
            </header>

            <nav className="room-tab-menu">
                <button
                    className={activeTab === 'places' ? 'room-tab active' : 'room-tab'}
                    onClick={() => setActiveTab('places')}
                >
                    장소
                </button>
                <button
                    className={activeTab === 'votes' ? 'room-tab active' : 'room-tab'}
                    onClick={() => setActiveTab('votes')}
                >
                    투표
                </button>
                <button
                    className={activeTab === 'schedule' ? 'room-tab active' : 'room-tab'}
                    onClick={() => setActiveTab('schedule')}
                >
                    일정
                </button>
                <button
                    className={activeTab === 'timeline' ? 'room-tab active' : 'room-tab'}
                    onClick={() => setActiveTab('timeline')}
                >
                    타임라인
                </button>
                <button
                    className={activeTab === 'settings' ? 'room-tab active' : 'room-tab'}
                    onClick={() => setActiveTab('settings')}
                >
                    설정
                </button>
            </nav>

            <section className="room-action-bar">
                {getActionButton() && (
                    <button className="action-button">
                        + {getActionButton()}
                    </button>
                )}
            </section>

            <main className="room-content">
                {renderTabContent()}
            </main>
        </div>
    )
}

export default RoomPage