import InputField from './InputField'
import PrimaryButton from './PrimaryButton'

// 새 여행 방 만들기 폼 컴포넌트
function JoinRoomForm() {
    return (
        <section className="join-room-form">
            <h2 className="join-room-title">방 참여하기</h2>
            <p className="create-room-description">
                여행 정보를 입력하고 친구들을 초대하세요
            </p>

            <InputField
                label="여행 이름"
                placeholder="제주도 힐링 여행"
            />

            <InlineDatePlanner />

            <PrimaryButton text="방 만들기" />
        </section>
    )
}

export default CreateRoomForm