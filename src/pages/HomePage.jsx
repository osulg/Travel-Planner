import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";

import Header from '../components/Header'
import HomeTab from '../components/HomeTab'
import CreateRoomForm from '../components/CreateRoomForm'
import MyTripBox from '../components/MyTripBox'
import FeatureCard from '../components/FeatureCard'
import NameModal from '../components/NameModal'
import '../styles/home.css'

import { getRoomSummary } from '../api/roomApi'
import { enterInviteLink } from '../api/inviteApi'
import {
  getTripRoomIds,
  addTripRoomId,
  removeTripRoomId,
  setCurrentRoomId,
  saveMemberForRoom,
  saveInviteTokenForRoom,
  getInviteTokenForRoom,
  setActiveMemberForRoom,
  removeInviteTokenForRoom,
} from '../utils/storage'

// 홈 메인 페이지
function HomePage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const [myTrips, setMyTrips] = useState([])
  const [isTripsLoading, setIsTripsLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('homeActiveTab') || 'create'
  })

  const [selectedTrip, setSelectedTrip] = useState(null)

  // 현재 탭 저장
  useEffect(() => {
    localStorage.setItem('homeActiveTab', activeTab)
  }, [activeTab])

  const saveCurrentUserSession = (roomId, memberInfo) => {
    sessionStorage.setItem(
      "currentUser",
      JSON.stringify({
        roomId,
        memberId: memberInfo.memberId,
        name: memberInfo.name,
        role: memberInfo.role,
      })
    );
  };

  const fetchMyTrips = async () => {
    setIsTripsLoading(true)

    try {
      const roomIds = getTripRoomIds()

      const results = await Promise.all(
        roomIds.map(async (roomId) => {
          try {
            if (!roomId || roomId === 'room-uuid') {
              console.warn('잘못된 roomId 건너뜀:', roomId)
              return null
            }

            const response = await getRoomSummary(roomId)
            const summary = response.data

            if (!response.success || !summary) return null

            console.log('getRoomSummary 전체 응답:', response)
            console.log('response.data:', response.data)

            console.log('summary data:', summary)
            console.log('roomId 확인:', roomId)

            if (!response.success || !summary) return null

            return {
              id: summary.roomId,
              name: summary.name,
              startDate: summary.startDate,
              endDate: summary.endDate,
            }

          } catch (error) {
            if (error?.response?.status === 404) {
              removeTripRoomId(roomId)
            }
            console.error(`room summary 조회 실패: ${roomId}`, error)
            return null
          }
        })
      )

      setMyTrips(results.filter(Boolean))
    } finally {
      setIsTripsLoading(false)
    }
  }

  useEffect(() => {
    const roomIds = getTripRoomIds()

    if (activeTab === 'myTrips' && roomIds.length > 0 && myTrips.length === 0) {
      fetchMyTrips()
    }
  }, [activeTab, myTrips.length])

  useEffect(() => {
    const pendingInviteToken = sessionStorage.getItem("pendingInviteToken");
    if (!pendingInviteToken) return;

    setActiveTab("myTrips");

    setMyTrips((prev) => {
      const alreadyExists = prev.some(
        (trip) => trip.inviteToken === pendingInviteToken || trip.id === `pending-${pendingInviteToken}`
      );

      if (alreadyExists) return prev;

      return [
        {
          id: `pending-${pendingInviteToken}`,
          name: "초대된 여행방",
          startDate: "",
          endDate: "",
          inviteToken: pendingInviteToken,
          isPendingInvite: true,
        },
        ...prev,
      ];
    });

    sessionStorage.removeItem("pendingInviteToken");
  }, []);

  /* func: 새 여행방 생성 시 실행되는 함수 */
  // api: createRoom
  const handleCreateRoom = (roomPayload) => {
    const roomId = roomPayload?.roomId
    const memberId = roomPayload?.memberId
    const inviteToken = roomPayload?.inviteToken

    if (!roomId) {
      alert('생성된 방 ID를 찾을 수 없습니다.')
      return
    }

    addTripRoomId(roomId)
    setCurrentRoomId(roomId)

    console.log('createRoom response payload:', roomPayload)

    if (memberId) {
      const hostMember = {
        memberId,
        name: roomPayload?.name,
        role: 'HOST',
      }

      saveMemberForRoom(roomId, hostMember)
      setActiveMemberForRoom(roomId, hostMember)
      saveCurrentUserSession(roomId, hostMember)
    } else {
      console.warn("방 생성 response에 memberId가 없습니다.")
    }

    if (inviteToken) {
      saveInviteTokenForRoom(roomId, inviteToken)
    }

    setMyTrips((prev) => [
      {
        id: roomId,
        name: roomPayload?.name ?? '',
        startDate: roomPayload?.startDate ?? '',
        endDate: roomPayload?.endDate ?? '',
        inviteToken: roomPayload?.inviteToken ?? '',
      },
      ...prev.filter((trip) => trip.id !== roomId),
    ])

    setActiveTab('myTrips')
  }

  /* func: 사용자가 여행방 카드를 클릭했을 때 실행되는 함수 */
  const handleTripClick = (trip) => {
    setSelectedTrip(trip)
    setName('')
    setPassword('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTrip(null)
    setName('')
    setPassword('')
  }

  /* func: 여행방 삭제 함수
     주의: 전체 방을 지우는 게 아니라 "내 여행방 목록"에서만 제거 */
  const handleDeleteRoom = (roomId) => {
    const isConfirmed = window.confirm('이 여행방을 내 목록에서 제거할까요?')
    if (!isConfirmed) return

    removeTripRoomId(roomId)
    setMyTrips((prev) => prev.filter((trip) => trip.id !== roomId))
  }

  /* func: 모달에서 '시작하기' 버튼을 눌렀을 때 실행되는 함수 */
  const handleStart = async () => {
    const trimmedName = name.trim()
    const trimmedPassword = password.trim()

    if (trimmedName === '') {
      alert('이름을 입력해주세요')
      return
    }

    if (trimmedPassword === '') {
      alert('비밀번호를 입력해주세요')
      return
    }

    if (!selectedTrip) {
      alert('선택된 여행방이 없습니다')
      return
    }

    try {
      const pendingInviteToken = sessionStorage.getItem('pendingInviteToken')

      const inviteToken =
        pendingInviteToken ||
        selectedTrip.inviteToken ||
        getInviteTokenForRoom(selectedTrip.id)

      console.log('handleStart selectedTrip:', selectedTrip)
      console.log('handleStart inviteToken:', inviteToken)

      if (!inviteToken) {
        alert('초대 토큰을 찾을 수 없습니다')
        return
      }

      const response = await enterInviteLink(inviteToken, {
        name: trimmedName,
        password: trimmedPassword,
      })

      console.log('enterInviteLink 전체 응답:', response)
      console.log('enterInviteLink data:', response.data)

      const enteredMember = response.data

      if (!response.success || !enteredMember) {
        alert(response.message || '방 입장에 실패했습니다')
        return
      }

      // 여기서부터는 응답으로 받은 "진짜 roomId" 사용
      const realRoomId = enteredMember.roomId
      const oldRoomId = selectedTrip.id

      const activeMember = {
        memberId: enteredMember.memberId,
        name: enteredMember.name,
        role: enteredMember.role,
      }

      // 1) 진짜 roomId 기준으로 멤버/현재방 저장
      saveMemberForRoom(realRoomId, activeMember)
      setActiveMemberForRoom(realRoomId, activeMember)
      setCurrentRoomId(realRoomId)
      saveCurrentUserSession(realRoomId, activeMember)

      // 2) 기존 roomId가 realRoomId와 다르면 tripRoomIds 치환
      if (oldRoomId && oldRoomId !== realRoomId) {
        removeTripRoomId(oldRoomId)
      }
      addTripRoomId(realRoomId)

      // 3) inviteToken도 realRoomId 기준으로 다시 저장
      if (inviteToken) {
        saveInviteTokenForRoom(realRoomId, inviteToken)

        if (oldRoomId && oldRoomId !== realRoomId) {
          removeInviteTokenForRoom(oldRoomId)
        }
      }

      // 5) myTrips state도 realRoomId 기준으로 교체
      setMyTrips((prev) => {
        const next = prev.map((trip) =>
          trip.id === oldRoomId
            ? {
              ...trip,
              id: realRoomId,
              inviteToken,
            }
            : trip
        )

        const alreadyExists = next.some((trip) => trip.id === realRoomId)
        return alreadyExists
          ? next.filter(
            (trip, index, arr) =>
              arr.findIndex((item) => item.id === trip.id) === index
          )
          : [
            {
              id: realRoomId,
              name: selectedTrip.name,
              startDate: selectedTrip.startDate,
              endDate: selectedTrip.endDate,
              inviteToken,
            },
            ...next,
          ]
      })

      sessionStorage.removeItem('pendingInviteToken')

      localStorage.setItem('homeActiveTab', 'myTrips')

      setIsModalOpen(false)
      setSelectedTrip(null)
      setName('')
      setPassword('')
      navigate(`/trip/${realRoomId}`)
    } catch (error) {
      console.error('방 입장 실패:', error)

      const message =
        error?.response?.data?.message || '방 입장에 실패했습니다.'

      alert(message)

      if (error?.response?.status === 404 && selectedTrip?.id) {
        removeTripRoomId(selectedTrip.id);
        setMyTrips((prev) => prev.filter((trip) => trip.id !== selectedTrip.id));
      }
    }
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
          {isTripsLoading ? (
            <p className="empty-message">불러오는 중...</p>
          ) : myTrips.length === 0 ? (
            <p className="empty-message">아직 내 여행방이 없습니다</p>
          ) : (
            myTrips.map((trip) => (
              <MyTripBox
                key={trip.id}
                trip={trip}
                onClick={handleTripClick}
                onDelete={handleDeleteRoom}
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
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default HomePage