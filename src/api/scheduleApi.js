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

// POST /api/v1/rooms/{roomId}/schedule-items
export const createScheduleItem = async (roomId, payload) => {
    const response = await client.post(
        `/rooms/${roomId}/schedule-items`,
        payload,
        getMemberHeader(roomId)
    );

    return response.data;
};

// DELETE /api/v1/schedule-items/{scheduleItemId}
export const deleteScheduleItem = async (roomId, scheduleItemId) => {
    const response = await client.delete(
        `/schedule-items/${scheduleItemId}`,
        getMemberHeader(roomId)
    );

    return response.data;
};