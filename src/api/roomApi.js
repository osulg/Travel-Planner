import client from "./client";
import { getActiveMemberForRoom } from "../utils/storage";

// createRoom(payload)
// getRoomSummary(roomId)
// getRoomSettings(roomId)

// 방 생성: POST /api/v1/rooms
// 방 요약 조회: GET /api/v1/rooms/{roomId}/summary
// 설정 조회: GET /api/v1/rooms/{roomId}/settings

export const createRoom = async ({ name, startDate, endDate }) => {
    const response = await client.post("/rooms", {
        name,
        startDate,
        endDate,
    });

    return response.data;
};

export const getRoomSummary = async (roomId) => {
    const response = await client.get(`/rooms/${roomId}/summary`);
    return response.data;
};

export const getRoomSettings = async (roomId) => {
    const memberId = getActiveMemberForRoom(roomId)?.memberId;

    console.log("getRoomSettings roomId:", roomId);
    console.log("getRoomSettings memberId:", memberId);

    const response = await client.get(`/rooms/${roomId}/settings`, {
        headers: memberId
            ? {
                "X-Member-Id": memberId,
            }
            : {},
    });

    console.log("getRoomSettings response:", response);

    return response.data;
};