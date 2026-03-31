import Header from '../components/Header'
import HomeTab from '../components/HomeTab'
import CreateRoomForm from '../components/CreateRoomForm'
import MyTripBox from '../components/MyTripBox'
import FeatureCard from '../components/FeatureCard'
import NameModal from '../components/NameModal'
import '../styles/home.css'
import { useState } from 'react'

// 홈 메인 페이지
function HomePage() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(true)

  const [activeTab, setActiveTabl] = useState('create')

  const handleStart = () => {
    if (name.trim() === '') {
      alert("이름을 입력해주세요")
      return
    }

    if (password.trim() === '') {
      alert("비밀번호를 입력해주세요")
      return
    }

    localStorage.setItem('userName', name)
    setIsModalOpen(false)
  }

  return (
    <div className="app-container">
      <Header />
      <HomeTab />
      <CreateRoomForm />
      <MyTripBox />

      {/* 하단 카드 영역 */}
      <section className="feature-card-list">
        <FeatureCard
          icon="📆"
          title="일정 계획"
          description="여행 일정을 쉽게 관리하세요"
        />

        <FeatureCard
          icon="📍"
          title="장소 공유"
          description="맛집과 명소를 친구들과 공유하세요"
        />

        <FeatureCard
          icon="👥"
          title="투표 & 의견"
          description="투표로 빠르게 의견을 모아보세요"
        />
      </section>

      {/* Modal이 열려 있을 때만 화면에 표시 */}
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