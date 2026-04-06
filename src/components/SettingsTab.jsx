import "../styles/settings-tab.css";

export default function SettingsTab({ roomData }) {
    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(roomData.inviteLink);
        alert("초대 링크가 복사되었습니다.");
    };

    const formatJoinedAt = (joinedAt) => {
        if (!joinedAt) return "-";

        const date = new Date(joinedAt);

        if (Number.isNaN(date.getTime())) {
            return joinedAt;
        }

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}. ${month}. ${day}. 참여`;
    };

    return (
        <div className="settings-page">
            <section className="settings-title">
                <h2>설정</h2>
                <p>방 정보 및 멤버를 관리하세요</p>
            </section>

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
                            {member.role === "host" && (
                                <span className="host-badge">호스트</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3>초대하기</h3>
                    <p>친구들을 초대하여 함께 여행을 계획하세요</p>
                </div>

                <button className="link-copy-button" onClick={handleCopyLink}>
                    초대 링크 복사
                </button>
            </div>

            <div className="settings-card">
                <div className="card-header">
                    <h3>방 정보</h3>
                </div>

                <div className="info-grid">
                    <div className="info-row">
                        <span>여행 이름</span>
                        <strong>{roomData.name}</strong>
                    </div>

                    <div className="info-row">
                        <span>여행 기간</span>
                        <strong>
                            {roomData.startDate} - {roomData.endDate}
                        </strong>
                    </div>

                    <div className="info-row">
                        <span>생성일</span>
                        <strong>{roomData.createdAt}</strong>
                    </div>

                    {/* <div className="info-row">
                        <span>최대 인원</span>
                        <strong>{roomData.maxMembers}명</strong>
                    </div> */}
                </div>
            </div>
        </div>
    );
}