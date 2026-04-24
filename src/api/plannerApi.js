import client from "./client";
import { getActiveMemberForRoom } from "../utils/storage";

// getPlanner(roomId)

// GET /api/v1/rooms/{roomId}/planner

export const getPlanner = async (roomId) => {
    const memberId = getActiveMemberForRoom(roomId)?.memberId;

    const response = await client.get(`/rooms/${roomId}/planner`, {
        headers: memberId
            ? {
                "X-Member-Id": memberId,
            }
            : {},
    });

    return response.data;
};