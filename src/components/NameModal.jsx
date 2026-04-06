function NameModal({ name, setName, password, setPassword, onStart }) {
    return (
        <div className="modal-overlay">
            <div className="name-modal">
                <h2 className="name-modal-title">
                    이름과 비밀번호를 입력해주세요
                </h2>

                <p className="name-modal-description">
                    여행 계획에 참여하기 위해 정보가 필요합니다
                </p>

                <label className="name-modal-label">이름</label>
                <input
                    className="name-modal-input"
                    type="text"
                    placeholder="홍길동"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <label className="name-modal-label">비밀번호</label>
                <input
                    className="name-modal-input"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button className="name-modal-button" onClick={onStart}>
                    시작하기
                </button>
            </div>
        </div>
    )
}

export default NameModal