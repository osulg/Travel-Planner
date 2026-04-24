import { useEffect, useState } from "react";
import "../styles/vote-card.css";

function VoteCard({
    vote,
    onVote,
    onDelete,
    onClose,
}) {
    const options = Array.isArray(vote?.options) ? vote.options : [];

    const totalVotes = options.reduce(
        (sum, option) => sum + Number(option?.votes ?? 0),
        0
    );

    const getPercent = (voteCount) => {
        if (totalVotes === 0) return 0;
        return Math.round((Number(voteCount ?? 0) / totalVotes) * 100);
    };

    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const isDeadlinePassed =
        Boolean(vote?.deadline) && new Date(vote.deadline).getTime() <= now;

    const isClosed = vote?.status === "closed" || isDeadlinePassed;

    return (
        <article className="vote-card">
            <div className="vote-card-top">
                <div>
                    <h3 className="vote-title">{vote?.title ?? ""}</h3>

                    {/* <p className="vote-meta">
                        {vote?.authorName ?? "알 수 없음"}
                        {vote?.createdAt ? ` · ${vote.createdAt}` : ""}
                    </p> */}

                    {vote?.deadline && (
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
                        <button onClick={() => onClose?.(vote?.id)}>마감</button>
                    )}

                    <button onClick={() => onDelete?.(vote?.id)}>삭제</button>
                </div>
            </div>

            <div className="vote-option-list">
                {options.map((option, index) => {
                    const percent = getPercent(option?.votes);

                    const selectedOptionId = vote?.myVoteOptionId ?? null;
                    const isSelected = selectedOptionId === option?.id;

                    return (
                        <div
                            key={option?.id ?? `vote-option-${index}`}
                            className="vote-option-item"
                        >
                            <div className="vote-option-top-row">
                                <button
                                    className={`vote-option-button ${isSelected ? "selected" : ""}`}
                                    onClick={() => onVote(vote.id, option.id)}
                                    disabled={isClosed}
                                >
                                    {typeof option.text === "string" ? option.text : "선택지 이름 없음"}
                                </button>

                                {typeof option?.link === "string" && option.link.trim() !== "" && (
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