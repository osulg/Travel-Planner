import "../styles/vote-card.css";

function VoteCard({ vote, onVote, onDelete, onClose }) {
    const totalVotes = vote.options.reduce((sum, option) => sum + option.votes, 0);

    const getPercent = (count) => {
        if (totalVotes === 0) return 0;
        return Math.round((count / totalVotes) * 100);
    };

    const isClosed = vote.status === "closed";

    return (
        <article className="vote-card">
            <div className="vote-card-top">
                <div>
                    <h3 className="vote-title">{vote.title}</h3>
                    <p className="vote-meta">
                        {vote.authorName} · {vote.createdAt}
                    </p>
                    {vote.deadline && (
                        <p className="vote-deadline">
                            마감: {new Date(vote.deadline).toLocaleString("ko-KR")}
                        </p>
                    )}
                </div>

                <div className="vote-actions">
                    <span className={`vote-status ${isClosed ? "closed" : "open"}`}>
                        {isClosed ? "종료됨" : "진행중"}
                    </span>

                    {!isClosed && (
                        <button onClick={() => onClose(vote.id)}>마감</button>
                    )}

                    <button onClick={() => onDelete(vote.id)}>삭제</button>
                </div>
            </div>

            <div className="vote-option-list">
                {vote.options.map((option) => {
                    const percent = getPercent(option.votes);
                    const isSelected = vote.userVote === option.id;

                    return (
                        <div key={option.id} className="vote-option-item">
                            <div className="vote-option-top-row">
                                <button
                                    className={`vote-option-button ${isSelected ? "selected" : ""}`}
                                    onClick={() => onVote(vote.id, option.id)}
                                    disabled={isClosed}
                                >
                                    {option.text}
                                </button>

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

                            <div className="vote-result-row">
                                <div className="vote-bar-wrap">
                                    <div
                                        className="vote-bar-fill"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>

                                <span className="vote-percent">{percent}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="vote-total">
                총 표: {totalVotes}명 참여
            </p>
        </article>
    );
}

export default VoteCard;