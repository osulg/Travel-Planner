// 홈 화면 상단 탭 컴포넌트
// 방 만들기 / 방 참여하기 버튼 영역

function HomeTab() {
    return (
        <div className="home-tab">
            <button className="home-tab-button active">방 만들기</button>
            <button className="home-tab-button">방 참여하기</button>
        </div>
    )
}

export default HomeTab