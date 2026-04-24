import client from "./client";
import { getActiveMemberForRoom } from "../utils/storage";

const getMemberHeader = (roomId) => {
    const memberId = getActiveMemberForRoom(roomId)?.memberId;

    return {
        headers: memberId
            ? {
                "X-Member-Id": memberId,
            }
            : {},
    };
};

// POST /api/v1/rooms/{roomId}/votes
export const createVote = async (roomId, { title, deadline, options }) => {
    const response = await client.post(
        `/rooms/${roomId}/votes`,
        {
            title,
            deadline,
            options,
        },
        getMemberHeader(roomId)
    );

    return response.data;
};

// GET /api/v1/rooms/{roomId}/votes
export const getVotes = async (roomId) => {
    const response = await client.get(
        `/rooms/${roomId}/votes`,
        getMemberHeader(roomId)
    );

    return response.data;
};

// PATCH /api/v1/votes/{voteId}/response
export const respondVote = async (roomId, voteId, voteOptionId) => {
    const response = await client.patch(
        `/votes/${voteId}/response`,
        { voteOptionId },
        getMemberHeader(roomId)
    );

    return response.data;
};

// PATCH /api/v1/votes/{voteId}/close
export const closeVote = async (roomId, voteId) => {
    const response = await client.patch(
        `/votes/${voteId}/close`,
        {},
        getMemberHeader(roomId)
    );

    return response.data;
};

// DELETE /api/v1/votes/{voteId}
export const deleteVote = async (roomId, voteId) => {
    const response = await client.delete(
        `/votes/${voteId}`,
        getMemberHeader(roomId)
    );

    return response.data;
};