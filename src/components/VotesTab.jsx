import { useState, useEffect } from "react";
import VoteModal from "./VoteModal";
import VoteCard from "./VoteCard";
import "../styles/vote.css";

import {
    createVote,
    getVotes,
    respondVote,
    closeVote,
    deleteVote
} from "../api/voteApi";

// 투표 탭 전체 컴포넌트
function VotesTab({
    roomId,
    places,     // 현재 장소 목록
    votes,      // 투표 배열
    setVotes,    // 투표 상태 변경 함수 (부모한테 받음)
    currentUserName

}) {
    // "새 투표 추가" 모달이 열렸는지 여부
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mapVoteFromServer = (vote) => {
        console.log("vote 작성자 관련 원본:", {
            createdBy: vote.createdBy,
            authorName: vote.authorName,
            creatorName: vote.creatorName,
            writerName: vote.writerName,
            memberName: vote.memberName,
            userName: vote.userName,
        });

        const createdRaw =
            vote.createdAt ??
            vote.createdDate ??
            vote.createdDateTime ??
            vote.createAt ??
            "";

        const formattedCreatedAt = createdRaw
            ? new Date(createdRaw).toLocaleString("ko-KR")
            : "";

        return {
            id: vote.voteId ?? vote.id,
            title: vote.title ?? "",
            authorName:
                vote.createdBy ??
                vote.authorName ??
                vote.creatorName ??
                vote.writerName ??
                vote.memberName ??
                vote.userName ??
                "알 수 없음",
            createdAt: formattedCreatedAt,
            deadline: vote.deadline ?? "",
            status: vote.status === "CLOSED" ? "closed" : "open",
            myVoteOptionId: vote.myVoteOptionId ?? null,
            participantCount: vote.participantCount ?? 0,
            memberCount: vote.memberCount ?? 0,
            options: (vote.options ?? []).map((option) => {
                const rawPlaceId = option.placeId ?? option.label?.placeId ?? null;
                const matchedPlace = places.find(
                    (place) => String(place.id) === String(rawPlaceId)
                );

                return {
                    id: option.voteOptionId ?? option.id ?? rawPlaceId,
                    placeId: rawPlaceId,
                    text:
                        typeof option.optionText === "string" && option.optionText.trim() !== ""
                            ? option.optionText
                            : typeof option.label === "string" && option.label.trim() !== ""
                                ? option.label
                                : matchedPlace?.title ?? "선택지 이름 없음",
                    link:
                        typeof option.linkUrl === "string" && option.linkUrl.trim() !== ""
                            ? option.linkUrl
                            : typeof option.link === "string" && option.link.trim() !== ""
                                ? option.link
                                : matchedPlace?.sourceUrl ?? "",
                    votes: Number(option.voteCount ?? option.votes ?? 0),
                    voteRate: Number(option.voteRate ?? 0),
                };
            }),
        };
    };

    const mapCreatedVote = (voteData, currentUserName) => {
        return {
            id: voteData.voteId,
            title: voteData.title ?? "",
            authorName:
                voteData.createdBy ??
                voteData.authorName ??
                currentUserName ??
                "알 수 없음",
            createdAt:
                voteData.createdAt ??
                voteData.createdDate ??
                voteData.createdDateTime ??
                new Date().toISOString(),
            deadline: voteData.deadline ?? "",
            status: voteData.status === "CLOSED" ? "closed" : "open",
            myVoteOptionId: null,
            participantCount: 0,
            memberCount: 0,
            options: (voteData.options ?? []).map((option) => ({
                id: option.voteOptionId,
                placeId: option.placeId,
                text: option.optionText ?? option.label ?? "",
                link: option.linkUrl ?? option.link ?? "",
                votes: option.voteCount ?? 0,
                voteRate: option.voteRate ?? 0,
            })),
        };
    };

    const refreshVotes = async () => {
        if (!roomId) return;

        try {
            const result = await getVotes(roomId);

            console.log("투표 목록 조회 응답:", result);

            if (!result.success) {
                alert(result.message || "투표 목록 조회에 실패했습니다.");
                return;
            }

            const mappedVotes = (result.data?.votes ?? []).map(mapVoteFromServer);
            setVotes(mappedVotes);
        } catch (error) {
            console.error("투표 목록 조회 실패:", error);
            alert("투표 목록 조회 중 오류가 발생했습니다.");
        }
    };

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
    const handleCreateVote = async (payload) => {
        if (!roomId) {
            alert("방 ID를 찾을 수 없습니다.");
            return;
        }

        try {
            const result = await createVote(roomId, payload);

            console.log("투표 생성 응답:", result);

            if (!result.success) {
                alert(result.message || "투표 생성에 실패했습니다.");
                return;
            }

            // const refreshed = await getVotes(roomId);

            // console.log("투표 목록 재조회 응답:", refreshed);

            // if (!refreshed.success) {
            //     alert(refreshed.message || "투표 목록 재조회에 실패했습니다.");
            //     return;
            // }

            // const mappedVotes = (refreshed.data?.votes ?? []).map(mapVoteFromServer);
            // setVotes(mappedVotes);
            // setIsModalOpen(false);

            await refreshVotes();
            setIsModalOpen(false);

            alert(result.message || "투표가 생성되었습니다.");
        } catch (error) {
            console.error("투표 생성 실패:", error);
            alert(error?.response?.data?.message || "투표 생성 중 오류가 발생했습니다.");
        }
    };

    // 투표 삭제
    const handleDeleteVote = async (voteId) => {
        const targetVote = votes.find((vote) => vote.id === voteId);
        if (!targetVote) return;

        const confirmed = window.confirm("이 투표를 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            const result = await deleteVote(roomId, voteId);

            console.log("투표 삭제 응답:", result);

            if (!result.success) {
                alert(result.message || "투표 삭제에 실패했습니다.");
                return;
            }

            // setVotes((prev) => prev.filter((vote) => vote.id !== voteId));

            await refreshVotes();

            alert(result.message || "투표가 삭제되었습니다.");
        } catch (error) {
            console.error("투표 삭제 실패:", error);
            alert("투표 삭제 중 오류가 발생했습니다.");
        }
    };

    // 투표 마감
    const handleCloseVote = async (voteId) => {
        const targetVote = votes.find((vote) => vote.id === voteId);
        if (!targetVote) return;

        if (targetVote.status === "closed") {
            alert("이미 마감된 투표입니다.");
            return;
        }

        try {
            const result = await closeVote(roomId, voteId);

            console.log("투표 마감 응답:", result);

            if (!result.success) {
                alert(result.message || "투표 마감에 실패했습니다.");
                return;
            }

            // setVotes((prev) =>
            //     prev.map((vote) =>
            //         vote.id === voteId
            //             ? {
            //                 ...vote,
            //                 status:
            //                     result?.data?.status === "CLOSED" || result?.data?.status === "closed"
            //                         ? "closed"
            //                         : "open",
            //             }
            //             : vote
            //     )
            // );

            await refreshVotes();

            alert(result.message || "투표가 마감되었습니다.");
        } catch (error) {
            console.error("투표 마감 실패:", error);
            alert("투표 마감 중 오류가 발생했습니다.");
        }
    };

    // 특정 선택지에 투표 / 투표 취소 / 표 이동 처리
    const handleVoteOption = async (voteId, optionId) => {
        if (!roomId) {
            alert("방 ID를 찾을 수 없습니다.");
            return;
        }

        if (!voteId || !optionId) {
            console.error("잘못된 투표 요청:", { voteId, optionId });
            alert("선택지 정보가 올바르지 않습니다.");
            return;
        }

        const targetVote = votes.find((vote) => vote.id === voteId);
        if (!targetVote) return;

        if (targetVote.status === "closed") {
            alert("마감된 투표에는 참여할 수 없습니다.");
            return;
        }

        try {
            const result = await respondVote(roomId, voteId, optionId);

            console.log("투표 참여/변경 응답:", result);

            if (!result.success) {
                alert(result.message || "투표 반영에 실패했습니다.");
                return;
            }

            await refreshVotes();
        } catch (error) {
            console.error("투표 참여/변경 실패:", error);
            alert(error?.response?.data?.message || "투표 반영 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        if (!roomId) return;

        refreshVotes();

        const intervalId = setInterval(() => {
            refreshVotes();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [roomId]);


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
                            currentUserName={currentUserName}
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
                    currentUserName={currentUserName}
                />
            )}
        </section>
    );
}

export default VotesTab;