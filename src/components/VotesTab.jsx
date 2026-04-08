import { useState, useEffect } from "react";
import VoteModal from "./VoteModal";
import VoteCard from "./VoteCard";
import "../styles/vote.css";

// 투표 탭 전체 컴포넌트
function VotesTab({
    places,     // 현재 장소 목록
    votes,      // 투표 배열
    setVotes    // 투표 상태 변경 함수 (부모한테 받음)
}) {
    // "새 투표 추가" 모달이 열렸는지 여부
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모달 열기
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // 새 투표 생성
    // 새 투표를 배열 맨 앞에 추가하고 모달 닫기
    const handleCreateVote = (newVote) => {
        setVotes((prev) => [newVote, ...prev]);
        setIsModalOpen(false);
    };

    // 투표 삭제
    const handleDeleteVote = (voteId) => {
        setVotes((prev) => prev.filter((vote) => vote.id !== voteId));
    };

    // 투표 마감
    const handleCloseVote = (voteId) => {
        setVotes((prev) =>
            prev.map((vote) =>
                vote.id === voteId ? { ...vote, status: "closed" } : vote
            )
        );
    };

    // 특정 선택지에 투표 / 투표 취소 / 표 이동 처리
    const handleVoteOption = (voteId, optionId) => {
        setVotes((prev) =>
            prev.map((vote) => {
                // 다른 투표이거나 마감된 투표면 그대로 반환
                if (vote.id !== voteId || vote.status === "closed") return vote;

                // 이전에 내가 투표했던 선택지 id
                const previousOptionId = vote.userVote;

                // 같은 선택지를 다시 누르면 투표 취소
                if (previousOptionId === optionId) {
                    return {
                        ...vote,
                        userVote: null, // 내 선택 해제

                        // 해당 선택지 표 -1
                        options: vote.options.map((option) =>
                            option.id === optionId
                                ? { ...option, votes: Math.max(0, option.votes - 1) }
                                : option
                        ),
                    };
                }

                // 다른 선택지를 누른 경우
                // 이전 선택지는 -1, 새 선택지는 +1
                const updatedOptions = vote.options.map((option) => {
                    // 예전에 골랐던 선택지 표 감소
                    if (previousOptionId && option.id === previousOptionId) {
                        return {
                            ...option,
                            votes: Math.max(0, option.votes - 1),
                        };
                    }

                    // 새로 고른 선택지 표 증가
                    if (option.id === optionId) {
                        return {
                            ...option,
                            votes: option.votes + 1,
                        };
                    }

                    // 관련 없는 선택지는 그대로
                    return option;
                });

                return {
                    ...vote,
                    userVote: optionId, // 현재 내가 고른 선택지 저장
                    options: updatedOptions,
                };
            })
        );
    };

    // 마감시간이 지난 투표를 자동으로 마감 처리하는 effect
    useEffect(() => {
        // 1초마다 한 번씩 검사
        const interval = setInterval(() => {
            const now = new Date();

            setVotes((prev) =>
                prev.map((vote) => {
                    // 이미 마감된 투표는 그대로
                    if (vote.status === "closed") return vote;

                    // 마감시간이 없는 투표는 그대로
                    if (!vote.deadline)
                        return vote;

                    // 마감시간을 Date 객체로 변환
                    const deadlineDate = new Date(vote.deadline);

                    // 현재 시간이 마감시간 이상이면 자동 마감
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

        // 컴포넌트가 사라질 때 interval 정리
        return () => clearInterval(interval);
    }, [setVotes]);

    return (
        // 투표 탭 전체 영역
        <section className="votes-page">
            <div className="votes-header">
                <h2>투표</h2>
                <button className="action-button" onClick={handleOpenModal}>
                    + 투표 추가
                </button>
            </div>

            {/* 투표가 하나도 없을 때 */}
            {votes.length === 0 ? (
                <p className="empty-message">아직 생성된 투표가 없습니다</p>
            ) : (
                // 투표 목록이 있을 때 카드 렌더링
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

            {/* 모달이 열려 있을 때만 VoteModal 렌더링 */}
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