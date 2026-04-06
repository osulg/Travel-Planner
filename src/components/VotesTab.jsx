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
                vote.id === voteId ? { ...vote, status: "closed" } : vote
            )
        );
    };

    const handleVoteOption = (voteId, optionId) => {
        setVotes((prev) =>
            prev.map((vote) => {
                if (vote.id !== voteId || vote.status === "closed") return vote;

                const previousOptionId = vote.userVote;

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

                const updatedOptions = vote.options.map((option) => {
                    if (previousOptionId && option.id === previousOptionId) {
                        return {
                            ...option,
                            votes: Math.max(0, option.votes - 1),
                        };
                    }

                    if (option.id === optionId) {
                        return {
                            ...option,
                            votes: option.votes + 1,
                        };
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

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            setVotes((prev) =>
                prev.map((vote) => {
                    if (vote.status === "closed") return vote;
                    if (!vote.deadline) return vote;

                    const deadlineDate = new Date(vote.deadline);

                    if (now >= deadlineDate) {
                        return {
                            ...vote,
                            status: "closed",
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