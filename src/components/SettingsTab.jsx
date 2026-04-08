import "../styles/settings-tab.css";

// 설정 탭 컴포넌트
export default function SettingsTab({ roomData }) {
    /* func: 초대 링크 복사 함수 */
    const handleCopyLink = async () => {
        // 브라우저 클립보드에 초대 링크 복사
        await navigator.clipboard.writeText(roomData.inviteLink);
        alert("초대 링크가 복사되었습니다.");
    };

    /* func: 멤버 참여일 포맷 함수 */
    const formatJoinedAt = (joinedAt) => {
        // 값이 없으면 - 표시
        if (!joinedAt)
            return "-";

        // 날짜 객체로 변환
        const date = new Date(joinedAt);

        // 날짜 변환 실패 시 원본 그대로 반환
        if (Number.isNaN(date.getTime())) {
            return joinedAt;
        }

        // 년 / 월 / 일 추출
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // 원하는 형식으로 반환
        return `${year}. ${month}. ${day}. 참여`;
    };

    return (
        <div className="settings-page">
            <section className="settings-title">
                <h2>설정</h2>
                <p>방 정보 및 멤버를 관리하세요</p>
            </section>

            {/* 참여 멤버 카드 */}
            <div className="settings-card">
                <div className="card-header">
                    <h3>참여 멤버 ({roomData.members?.length || 0})</h3>
                    <p>현재 참여 중인 멤버 목록</p>
                </div>

                <div className="member-list">
                    {(roomData.members || []).map((member) => (
                        <div className="member-item" key={member.id}>
                            <div>
                                <strong>{member.name}</strong>
                                <p>{formatJoinedAt(member.joinedAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 초대 링크 카드 */}
            <div className="settings-card">
                <div className="card-header">
                    <h3>초대하기</h3>
                    <p>친구들을 초대하여 함께 여행을 계획하세요</p>
                </div>

                <button className="link-copy-button" onClick={handleCopyLink}>
                    초대 링크 복사
                </button>
            </div>

            {/* 방 정보 카드 */}
            <div className="settings-card">
                <div className="card-header">
                    <h3>방 정보</h3>
                </div>
                {/* 여행 이름 */}
                <div className="info-grid">
                    <div className="info-row">
                        <span>여행 이름</span>
                        <strong>{roomData.name}</strong>
                    </div>
                    {/* ㅕ행 기간 */}
                    <div className="info-row">
                        <span>여행 기간</span>
                        <strong>
                            {roomData.startDate} - {roomData.endDate}
                        </strong>
                    </div>
                    {/* 방 생성일 */}
                    <div className="info-row">
                        <span>생성일</span>
                        <strong>{roomData.createdAt}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}