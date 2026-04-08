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
  // 페이지 이동을 위한 함수
  // ex) 특정 여행 방 페이지로 이동할 때 사용
  const navigate = useNavigate()

  const [name, setName] = useState('') // 사용자가 모달에서 입력하는 이름
  const [password, setPassword] = useState('') // 사용자가 모달에서 입력하는 비밀번호

  // 여행방 목록 state
  // 처음 렌더링될 때 LocalStorage에 저장된 rooms 값 읽어옴
  // 저장된 값이 있으면 JSON.parse로 배열로 복원
  // 없으면 빈 값으로 시작
  const [rooms, setRooms] = useState(() => {
    const savedRooms = localStorage.getItem('rooms')
    return savedRooms ? JSON.parse(savedRooms) : []
  })

  const [isModalOpen, setIsModalOpen] = useState(false) // 이름/비밀번호 입력용 모달이 열려 있는지 여부

  // 홈 탭의 현재 활성 탭 상태
  // LocalStorage에 이전 탭 기록이 있으면 그 값을 사용
  // 없으면 기본 값은 'create'
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('homeActiveTab') || 'create'
  })

  // 현재 사용자가 클릭한 여행방 정보
  // 처음에는 아무것도 선택되지 않았으므로 null
  const [selectedTrip, setSelectedTrip] = useState(null)

  // rooms 값이 바뀔 때마다 localStorage에 자동 저장
  // 새로고침해도 여행방 목록이 유지되도록 하기 위한 용도
  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms))
  }, [rooms])

  // activeTab 값이 바뀔 때마다 localStorage에 저장
  // 사용자가 마지막에 보던 탭을 기억하기 위한 용도
  useEffect(() => {
    localStorage.setItem('homeActiveTab', activeTab)
  }, [activeTab])

  /* func: 새 여행방 생성 시 실행되는 함수 */
  const handleCreateRoom = (newRoom) => {
    // 기존 rooms 앞쪽에 새 여행방 추가
    // 최신 여행방이 위에 보이도록 [newRoom, ...prev] 형태 사용
    setRooms((prev) => [newRoom, ...prev])

    // 여행방을 만든 뒤에는 자동으로 '내 여행방' 탭으로 이동
    setActiveTab('myTrips')
  }

  /* func: 사용자가 여행방 카드를 클릭했을 때 실행되는 함수*/
  const handleTripClick = (trip) => {
    setSelectedTrip(trip) // 어떤 여행방을 눌렀는지 저장

    // 이전 입력값이 남지 않도록 이름/비밀번호 초기화
    setName('')
    setPassword('')

    setIsModalOpen(true) // 이름 입력 모달 열기
  }

  /* func: 여행방 삭제 함수 */
  const handleDeleteRoom = (roomId) => {
    // 삭제할지 사용자에게 다시 확인
    const isConfirmed = window.confirm('이 여행방을 삭제할까요?')

    // 취소 누르면 바로 함수 종료
    if (!isConfirmed)
      return

    // room.id가 삭제할 roomId와 다른 것만 남김
    // 즉, 해당 id의 여행방 목록만 제거
    setRooms((prev) => prev.filter((room) => room.id !== roomId))
  }

  /* func: 모달에서 '시작하기' 버튼을 눌렀을 때 실행되는 함수 */
  const handleStart = () => {
    // 이름 필수 -> 없으면 경고창
    if (name.trim() === '') {
      alert('이름을 입력해주세요')
      return
    }

    // 비밀번호 필수 -> 없으면 경고창
    if (password.trim() === '') {
      alert('비밀번호를 입력해주세요')
      return
    }

    // 선택된 여행방이 없으면 더 진행하지 않음
    if (!selectedTrip) {
      return
    }

    // 입력한 이름을 LocalStorage에 저장
    // 이후 다른 페이지에서 사용자 이름이 필요할 때 사용 가능
    localStorage.setItem('userName', name)

    // 현재 활성 탭도 'myTrips'로 저장
    // 홈으로 다시 돌아왔을 때 내 여행 탭이 유지되도록 함
    localStorage.setItem('homeActiveTab', 'myTrips')

    // 모달 닫기
    setIsModalOpen(false)

    // 선택한 여행방의 상세 페이지로 이동
    // 예: /trip/123
    navigate(`/trip/${selectedTrip.id}`)
  }

  return (
    <div className="app-container">
      {/* 상단 공통 헤더 */}
      <Header />

      {/* 홈 탭 컴포넌트
          activeTab: 현재 어떤 탭이 선택되어 있는지 전달
          onChangeTab: 탭 바꾸는 함수 전달 */}
      <HomeTab
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* 현재 탭이 create일 때만 여행방 생성 폼 표시 */}
      {activeTab === 'create' && (
        <CreateRoomForm onCreateRoom={handleCreateRoom} />
      )}

      {/* 현재 탭이 myTrips일 때만 여행방 목록 표시 */}
      {activeTab === 'myTrips' && (
        <section className="my-trip-list">
          {/* 여행방이 하나도 없으면 안내 문구 출력 */}
          {rooms.length === 0 ? (
            <p className="empty-message">아직 생성된 여행방이 없습니다</p>
          ) : (
            // 여행방이 있으면 배열을 순회하면서 카드 렌더링
            rooms.map((trip) => (
              <MyTripBox
                key={trip.id} // React가 각 요소를 구분하기 위한 고유 key
                trip={trip} // 여행방 데이터 전달
                onClick={handleTripClick} // 카드 클릭 시 실행할 함수
                onDelete={handleDeleteRoom} // 삭제 버튼 클릭 시 실행할 함수
              />
            ))
          )}
        </section>
      )}

      {/* 하단 기능 소개 카드 영역 - 서비스 소개 */}
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

      {/* 모달이 열려 있을 때만 NameModal 표시 */}
      {isModalOpen && (
        <NameModal
          name={name} // 현재 이름 값
          setName={setName} // 이름 변경 함수
          password={password} // 현재 비밀번호 값
          setPassword={setPassword} // 비밀번호 변경 함수
          onStart={handleStart} // 시작 버튼 클릭 시 실행할 함수
        />
      )}
    </div>
  )
}

export default HomePage