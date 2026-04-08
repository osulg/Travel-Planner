// 이름/비밀번호 입력 모달 컴포넌트
// 부모에게서 name, password 값과
// 각각을 바꾸는 함수(setName, setPassword),
// 그리고 시작 버튼 클릭 함수(onStart)를 받아 사용함

/* 
 * 1) 부모가 모달을 열기
 * 2) 부모가 현재 name, password 값 넘김
 * 3) 사용자가 input에 입력
 * 4) setName, setPassword 실행됨
 * 5) 실제로는 부모 state가 바뀜
 * 6) 시작 버튼 누르면 onStart 실행
 * 7) 부모가 검증하고 페이지 이동
 */

function NameModal({
    name, // 현재 이름갑
    setName, // 이름 바꾸는 함수
    password, // 현재 비밀번호 값
    setPassword, // 비밀번호 바꾸는 함수
    onStart // 시작 버튼 클릭 함수
}) {
    return (
        // 모달 바깥 배경 오버레이
        // 보통 화면을 어둡게 덮는 역할
        <div className="modal-overlay">
            {/* 모달 박스 본체 */}
            <div className="name-modal">
                {/* 모달 제목 */}
                <h2 className="name-modal-title">
                    이름과 비밀번호를 입력해주세요
                </h2>

                {/* 모달 설명 문구 */}
                <p className="name-modal-description">
                    여행 계획에 참여하기 위해 정보가 필요합니다
                </p>
                {/* 이름 입력 라벨 */}
                <label className="name-modal-label">이름</label>
                <input
                    className="name-modal-input"
                    type="text"
                    placeholder="홍길동"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                {/* 비밀번호 입력 라벨 */}
                <label className="name-modal-label">비밀번호</label>
                <input
                    className="name-modal-input"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                {/* 시작 버튼 */}
                <button className="name-modal-button" onClick={onStart}>
                    시작하기
                </button>
            </div>
        </div>
    )
}

export default NameModal