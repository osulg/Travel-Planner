import "../styles/vote-card.css";

// 투표 카드 컴포넌트
function VoteCard({
    vote,       // 투표 데이터 1개
    onVote,     // 특정 선택지에 투표하는 함수
    onDelete,   // 투표 자체를 삭제하는 함수
    onClose     // 투표를 마감 처리하는 함수
}) {
    /* func: 전체 투표 수 계산 */
    // vote.options 배열 안의 각 선택지 votes 값을 모두 더함
    // 예: [2, 3, 1] -> 총 6표
    const totalVotes = vote.options.reduce((sum, option) => sum + option.votes, 0);

    /* func: 특정 선택지가 전체 투표에서 몇 %인지 계산하는 함수 */
    const getPercent = (count) => {
        // 아직 아무도 투표하지 않았으면 0% 처리
        if (totalVotes === 0)
            return 0;

        // 백분율 계산 후 반올림
        return Math.round((count / totalVotes) * 100);
    };

    // 현재 투표가 마감되었는지 여부
    // status가 "closed"면 true
    const isClosed = vote.status === "closed";

    return (
        // 투표 카드 전체 영역
        <article className="vote-card">
            {/* 카드 상단: 제목/작성자/마감시간 + 상태/버튼 */}
            <div className="vote-card-top">
                <div>
                    {/* 투표 제목 */}
                    <h3 className="vote-title">{vote.title}</h3>

                    {/* 작성자명과 작성일 */}
                    <p className="vote-meta">
                        {vote.authorName} · {vote.createdAt}
                    </p>

                    {/* 마감시간이 있을 때만 출력 */}
                    {vote.deadline && (
                        <p className="vote-deadline">
                            {/* deadline 문자열을 Date로 바꿔 한국식 날짜/시간 문자열로 출력 */}
                            마감: {new Date(vote.deadline).toLocaleString("ko-KR")}
                        </p>
                    )}
                </div>

                {/* 상태 표시 / 마감 버튼 / 삭제 버튼 */}
                <div className="vote-actions">
                    {/* 진행중 / 종료됨 뱃지 */}
                    <span className={`vote-status ${isClosed ? "closed" : "open"}`}>
                        {isClosed ? "종료됨" : "진행중"}
                    </span>

                    {/* 마감되지 않은 투표만 마감 버튼 표시 */}
                    {!isClosed && (
                        <button onClick={() => onClose(vote.id)}>마감</button>
                    )}

                    {/* 투표 삭제 버튼 */}
                    <button onClick={() => onDelete(vote.id)}>삭제</button>
                </div>
            </div>

            {/* 투표 삭제 버튼 */}
            <div className="vote-option-list">
                {vote.options.map((option) => {
                    // 현재 선택지 득표율 계산
                    const percent = getPercent(option.votes);

                    // 현재 사용자가 이 선택지를 골랐는지 여부
                    // userVote에 저장된 option id와 현재 option.id 비교
                    const isSelected = vote.userVote === option.id;

                    return (
                        <div key={option.id} className="vote-option-item">
                            {/* 선택지 버튼 + 링크 */}
                            <div className="vote-option-top-row">
                                <button
                                    // 내가 고른 선택지면 selected 클래스 추가
                                    className={`vote-option-button ${isSelected ? "selected" : ""}`}

                                    // 클릭 시 부모에 "이 투표의 이 선택지를 골랐다" 전달
                                    onClick={() => onVote(vote.id, option.id)}

                                    // 투표가 마감됐으면 더 이상 클릭 불가
                                    disabled={isClosed}
                                >
                                    {option.text}
                                </button>

                                {/* 해당 장소/선택지에 링크가 있으면 링크 버튼 표시 */}
                                {option.link && (
                                    <a
                                        href={option.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="vote-option-link small"
                                    >
                                        링크
                                    </a>
                                )}
                            </div>

                            {/* 득표율 바 영역 */}
                            <div className="vote-result-row">
                                <div className="vote-bar-wrap">
                                    <div
                                        className="vote-bar-fill"

                                        // 퍼센트만큼 가로 바 길이 설정
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>

                                {/* 득표율 숫자 출력 */}
                                <span className="vote-percent">{percent}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 총 참여자 수 */}
            <p className="vote-total">
                총 표: {totalVotes}명 참여
            </p>
        </article>
    );
}

export default VoteCard;