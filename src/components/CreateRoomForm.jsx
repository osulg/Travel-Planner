import InputField from './InputField'
import PrimaryButton from './PrimaryButton'
import InlineDatePlanner from './InlineDatePlanner'

// 새 여행 방 만들기 폼 컴포넌트
function CreateRoomForm() {
    return (
        <section className="create-room-form">
            <h2 className="create-room-title">새 여행 방 만들기</h2>
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