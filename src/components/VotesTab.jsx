import { useState, useEffect } from "react";
import VoteModal from "./VoteModal";
import VoteCard from "./VoteCard";
import "../styles/vote.css";

function VotesTab({ places, votes, setVotes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateVote = (newVote) => {
        setVotes((prev) => [newVote, ...prev]);
        setIsModalOpen(false);
    };

    const handleDeleteVote = (voteId) => {
        setVotes((prev) => prev.filter((vote) => vote.id !== voteId));
    };

    const handleCloseVote = (voteId) => {
        setVotes((prev) =>
            prev.map((vote) =>
                vote.id === voteId ? { ...vote, isClosed: true } : vote
            )
        );
    };

    const handleVoteOption = (voteId, optionId) => {
        setVotes((prev) =>
            prev.map((vote) => {
                if (vote.id !== voteId || vote.isClosed) return vote;

                const previousOptionId = vote.userVote;

                // 1) 같은 버튼 다시 누름 = 선택 해제
                if (previousOptionId === optionId) {
                    return {
                        ...vote,
                        userVote: null,
                        options: vote.options.map((option) =>
                            option.id === optionId
                                ? { ...option, votes: Math.max(0, option.votes - 1) }
                                : option
                        ),
                    };
                }

                // 2) 다른 버튼으로 변경 또는 처음 선택
                const updatedOptions = vote.options.map((option) => {
                    // 이전 선택이 있으면 1 감소
                    if (previousOptionId && option.id === previousOptionId) {
                        return { ...option, votes: Math.max(0, option.votes - 1) };
                    }

                    // 새로 누른 선택지는 1 증가
                    if (option.id === optionId) {
                        return { ...option, votes: option.votes + 1 };
                    }

                    return option;
                });

                return {
                    ...vote,
                    userVote: optionId,
                    options: updatedOptions,
                };
            })
        );
    };

    /* 마감시간 고려 */
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            setVotes((prev) =>
                prev.map((vote) => {
                    if (vote.isClosed) return vote;
                    if (!vote.deadline) return vote;

                    const deadlineDate = new Date(vote.deadline);

                    if (now >= deadlineDate) {
                        return {
                            ...vote,
                            isClosed: true,
                        };
                    }

                    return vote;
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [setVotes]);

    return (
        <section className="votes-page">
            <div className="votes-header">
                <h2>투표</h2>
                <button className="action-button" onClick={handleOpenModal}>
                    + 투표 추가
                </button>
            </div>

            {votes.length === 0 ? (
                <p className="empty-message">아직 생성된 투표가 없습니다</p>
            ) : (
                <div className="vote-card-list">
                    {votes.map((vote) => (
                        <VoteCard
                            key={vote.id}
                            vote={vote}
                            onVote={handleVoteOption}
                            onDelete={handleDeleteVote}
                            onClose={handleCloseVote}
                        />
                    ))}
                </div>
            )}

            {isModalOpen && (
                <VoteModal
                    onClose={handleCloseModal}
                    onCreate={handleCreateVote}
                    places={places}
                />
            )}
        </section>
    );
}

export default VotesTab;