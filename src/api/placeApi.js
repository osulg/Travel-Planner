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

// POST /api/v1/rooms/{roomId}/places
export const createPlace = async (roomId, payload) => {
    const response = await client.post(
        `/rooms/${roomId}/places`,
        payload,
        getMemberHeader(roomId)
    );

    return response.data;
};

// PATCH /api/v1/places/{placeId}
export const updatePlace = async (
    roomId,
    placeId,
    { title, sourceUrl, memo, estimatedCost, isRequired }
) => {
    const response = await client.patch(
        `/places/${placeId}`,
        {
            title,
            sourceUrl,
            memo,
            estimatedCost,
            isRequired,
        },
        getMemberHeader(roomId)
    );

    return response.data;
};

// DELETE /api/v1/places/{placeId}
export const deletePlace = async (roomId, placeId) => {
    const response = await client.delete(
        `/places/${placeId}`,
        getMemberHeader(roomId)
    );

    return response.data;
};

// PATCH /api/v1/places/{placeId}/required
export const togglePlaceRequired = async (roomId, placeId, isRequired) => {
    const response = await client.patch(
        `/places/${placeId}/required`,
        { isRequired },
        getMemberHeader(roomId)
    );

    return response.data;
};

// PATCH /api/v1/places/{placeId}/reaction
export const changePlaceReaction = async (roomId, placeId, reactionType) => {
    const response = await client.patch(
        `/places/${placeId}/reaction`,
        { reactionType },
        getMemberHeader(roomId)
    );

    return response.data;
};

// GET /api/v1/places/{placeId}/comments
export const getPlaceComments = async (roomId, placeId) => {
    const response = await client.get(
        `/places/${placeId}/comments`,
        getMemberHeader(roomId)
    );

    return response.data;
};

// POST /api/v1/places/{placeId}/comments
export const createPlaceComment = async (roomId, placeId, content) => {
    const response = await client.post(
        `/places/${placeId}/comments`,
        { content },
        getMemberHeader(roomId)
    );

    return response.data;
};