// 홈 화면 상단 탭 컴포넌트
// 방 만들기 / 방 참여하기 버튼 영역

function HomeTab() {
    return (
        // 탭 전체 영역
        <div className="home-tab">
            {/* 방 만들기 탭 */}
            <button
                className={`home-tab-button ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
            >
                방 만들기
            </button>

            {/* 방 참여하기 탭 */}
            <button
                className={`home-tab-button ${activeTab === 'join' ? 'active' : ''}`}
                onClick={() => setActiveTab('join')}
            >
                방 만들기
            </button>
        </div>
    )
}

export default HomeTab