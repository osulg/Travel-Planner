import Header from '../components/Header'
import HomeTab from '../components/HomeTab'
import CreateRoomForm from '../components/CreateRoomForm'
import MyTripBox from '../components/MyTripBox'
import FeatureCard from '../components/FeatureCard'
import NameModal from '../components/NameModal'
import '../styles/home.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";

// 홈 메인 페이지
function HomePage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [rooms, setRooms] = useState(() => {
    const savedRooms = localStorage.getItem('rooms')
    return savedRooms ? JSON.parse(savedRooms) : []
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('homeActiveTab') || 'create'
  })
  const [selectedTrip, setSelectedTrip] = useState(null)

  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms))
  }, [rooms])

  useEffect(() => {
    localStorage.setItem('homeActiveTab', activeTab)
  }, [activeTab])

  const handleCreateRoom = (newRoom) => {
    setRooms((prev) => [newRoom, ...prev])
    setActiveTab('myTrips')
  }

  const handleTripClick = (trip) => {
    setSelectedTrip(trip)
    setName('')
    setPassword('')
    setIsModalOpen(true)
  }

  const handleStart = () => {
    if (name.trim() === '') {
      alert('이름을 입력해주세요')
      return
    }

    if (password.trim() === '') {
      alert('비밀번호를 입력해주세요')
      return
    }

    if (!selectedTrip) {
      return
    }

    localStorage.setItem('userName', name)
    localStorage.setItem('homeActiveTab', 'myTrips')

    setIsModalOpen(false)

    navigate(`/trip/${selectedTrip.id}`)
  }

  return (
    <div className="app-container">
      <Header />

      <HomeTab
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {activeTab === 'create' && (
        <CreateRoomForm onCreateRoom={handleCreateRoom} />
      )}

      {activeTab === 'myTrips' && (
        <section className="my-trip-list">
          {rooms.length === 0 ? (
            <p className="empty-message">아직 생성된 여행방이 없습니다</p>
          ) : (
            rooms.map((trip) => (
              <MyTripBox
                key={trip.id}
                trip={trip}
                onClick={handleTripClick}
              />
            ))
          )}
        </section>
      )}

      <section className="feature-card-list">
        <FeatureCard
          icon={<FiCalendar size={22} />}
          title="일정 계획"
          description="여행 일정을 쉽게 관리하세요"
        />

        <FeatureCard
          icon={<FiMapPin size={22} />}
          title="장소 공유"
          description="맛집과 명소를 친구들과 공유하세요"
        />

        <FeatureCard
          icon={<FiUsers size={22} />}
          title="투표 & 의견"
          description="투표로 빠르게 의견을 모아보세요"
        />
      </section>

      {isModalOpen && (
        <NameModal
          name={name}
          setName={setName}
          password={password}
          setPassword={setPassword}
          onStart={handleStart}
        />
      )}
    </div>
  )
}

export default HomePage