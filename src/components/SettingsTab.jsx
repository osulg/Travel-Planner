import "../styles/settings-tab.css";

// 설정 탭 컴포넌트
export default function SettingsTab({ roomData, settingsData }) {
    const members = [...(settingsData?.members || [])].sort((a, b) => {
        const aIsHost = a.role === "HOST";
        const bIsHost = b.role === "HOST";

        if (aIsHost && !bIsHost) return -1;
        if (!aIsHost && bIsHost) return 1;

        const aName = a.name ?? a.memberName ?? "";
        const bName = b.name ?? b.memberName ?? "";

        return aName.localeCompare(bName, "ko");
    });

    const inviteToken =
        settingsData?.invite?.inviteToken ||
        settingsData?.invite?.token ||
        "";

    const inviteUrl = inviteToken
        ? `${window.location.origin}/invite/${inviteToken}`
        : "";

    const room = settingsData?.room || {};

    console.log("settingsData 전체:", settingsData);
    console.log("members 전체:", members);

    /* func: 초대 링크 복사 함수 */
    const handleCopyLink = async () => {
        if (!inviteUrl) {
            alert("초대 링크가 없습니다.");
            return;
        }

        await navigator.clipboard.writeText(inviteUrl);
        alert("초대 링크가 복사되었습니다.");
    };

    /* func: 날짜를 YYYY-MM-DD 형식으로 변환 */
    const formatDateOnly = (value) => {
        if (!value) return "-";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    return (
        <div className="settings-page">
            <section className="settings-title">
                <h2>설정</h2>
                <p>방 정보 및 멤버를 관리하세요</p>
            </section>

            <div className="settings-card">
                <div className="card-header">
                    <h3>참여 멤버 ({members.length})</h3>
                    <p>현재 참여 중인 멤버 목록</p>
                </div>

                <div className="member-list">
                    {members.map((member, index) => (
                        <div
                            className="member-item"
                            key={member.memberId ?? member.id ?? index}
                        >
                            <span className="member-name">
                                {member.name ?? member.memberName ?? "이름 없음"}
                            </span>

                            {member.role === "HOST" && (
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
                        <strong>{room.name || roomData?.name || "-"}</strong>
                    </div>

                    <div className="info-row">
                        <span>여행 기간</span>
                        <strong>
                            {formatDateOnly(room.startDate || roomData?.startDate)} - {formatDateOnly(room.endDate || roomData?.endDate)}
                        </strong>
                    </div>

                    <div className="info-row">
                        <span>생성일</span>
                        <strong>{formatDateOnly(room.createdAt)}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}