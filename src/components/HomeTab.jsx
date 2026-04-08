// 홈 화면 탭 메뉴 컴포넌트
// 부모에게서 현재 활성 탭(activeTab)과
// 탭 변경 함수(onChangeTab)를 받아 사용함

function HomeTab({ activeTab, onChangeTab }) {
    return (
        <div className="home-tab">
            {/* "방 만들기" 탭 버튼 */}
            <button
                // 현재 activeTab이 'create'이면 active 클래스 추가
                // 아니면 기본 클래스만 사용
                className={`home-tab-button ${activeTab === 'create' ? 'active' : ''}`}

                // 버튼 클릭 시 부모가 내려준 탭 변경 함수 실행
                // 'create' 탭으로 전환 요청
                onClick={() => onChangeTab('create')}
            >
                방 만들기
            </button>

            {/* "내 여행방" 탭 버튼 */}
            <button
                // 현재 activeTab이 'myTrips'이면 active 클래스 추가
                // 아니면 기본 클래스만 사용
                className={`home-tab-button ${activeTab === 'myTrips' ? 'active' : ''}`}

                // 버튼 클릭 시 부모가 내려준 탭 변경 함수 실행
                // 'myTrips' 탭으로 전환 요청
                onClick={() => onChangeTab('myTrips')}
            >
                내 여행방
            </button>
        </div>
    )
}

export default HomeTab