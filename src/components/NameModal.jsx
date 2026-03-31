// 이름 입력 팝업 컴포넌트

function NameModal({ name, setName, password, setPassword, onStart }) {
    return (
        <div className="modal-overlay">
            {/* 가운데 흰색 팝업 박스 */}
            <div className="name-modal">
                {/* 제목 */}
                <h2 className="name-modal-title">
                    이름과 비밀번호를 입력해주세요
                </h2>

                {/* 설명 */}
                <p className="name-modal-description">
                    여행 계획에 참여하기 위해 정보가 필요합니다
                </p>

                {/* 이름 입력창 */}
                <label className="name-modal-label">
                    이름
                </label>

                {/* 이름 입력창 */}
                <input
                    className="name-modal-input"
                    type="text"
                    placeholder="홍길동"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <label className="name-modal-label">        비밀번호
                </label>

                {/* 비밀번호 입력창 */}
                <input
                    className="name-modal-input"
                    type="text"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                {/* 시작하기 버튼 */}
                <button className="name-modal-button" onClick={onStart}>
                    시작하기
                </button>
            </div>
        </div>
    )
}

export default NameModal