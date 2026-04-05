function HomeTab({ activeTab, onChangeTab }) {
    return (
        <div className="home-tab">
            <button
                className={`home-tab-button ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => onChangeTab('create')}
            >
                방 만들기
            </button>

            <button
                className={`home-tab-button ${activeTab === 'myTrips' ? 'active' : ''}`}
                onClick={() => onChangeTab('myTrips')}
            >
                내 여행방
            </button>
        </div>
    )
}

export default HomeTab