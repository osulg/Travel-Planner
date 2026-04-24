const LOCAL_KEYS = {
    TRIP_ROOM_IDS: "tripRoomIds",
    ROOM_MEMBERS_BY_ROOM: "roomMembersByRoom",
    INVITE_TOKEN_BY_ROOM: "inviteTokenByRoom",
    ROOMS: "travel_rooms",
};

const SESSION_KEYS = {
    CURRENT_ROOM_ID: "currentRoomId",
    ACTIVE_MEMBER_BY_ROOM: "activeMemberByRoom",
};

// =========================
// 공통 JSON 헬퍼
// =========================
const readJSON = (storage, key, defaultValue) => {
    try {
        const value = storage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const writeJSON = (storage, key, value) => {
    storage.setItem(key, JSON.stringify(value));
};

// =========================
// 여행방 목록
// =========================
export const getTripRoomIds = () => {
    return readJSON(localStorage, LOCAL_KEYS.TRIP_ROOM_IDS, []);
};

export const addTripRoomId = (roomId) => {
    const roomIds = getTripRoomIds();

    if (!roomIds.includes(roomId)) {
        roomIds.push(roomId);
        writeJSON(localStorage, LOCAL_KEYS.TRIP_ROOM_IDS, roomIds);
    }
};

export const removeTripRoomId = (roomId) => {
    const roomIds = getTripRoomIds().filter((id) => id !== roomId);
    writeJSON(localStorage, LOCAL_KEYS.TRIP_ROOM_IDS, roomIds);
};

// =========================
// 현재 탭의 현재 방
// =========================
export const getCurrentRoomId = () => {
    return sessionStorage.getItem(SESSION_KEYS.CURRENT_ROOM_ID);
};

export const setCurrentRoomId = (roomId) => {
    sessionStorage.setItem(SESSION_KEYS.CURRENT_ROOM_ID, roomId);
};

export const clearCurrentRoomId = () => {
    sessionStorage.removeItem(SESSION_KEYS.CURRENT_ROOM_ID);
};

// =========================
// 방별 전체 멤버 목록(localStorage)
// roomId별로 여러 명 저장 가능
// =========================
export const getRoomMembersByRoom = () => {
    return readJSON(localStorage, LOCAL_KEYS.ROOM_MEMBERS_BY_ROOM, {});
};

export const getMembersForRoom = (roomId) => {
    const membersByRoom = getRoomMembersByRoom();
    return membersByRoom[roomId] ?? [];
};

export const getMemberForRoomById = (roomId, memberId) => {
    const members = getMembersForRoom(roomId);
    return members.find((member) => member.memberId === memberId) ?? null;
};

export const saveMemberForRoom = (roomId, memberInfo) => {
    const membersByRoom = getRoomMembersByRoom();
    const currentMembers = membersByRoom[roomId] ?? [];

    const memberId = memberInfo?.memberId;
    const nextMembers =
        memberId == null
            ? currentMembers
            : [
                ...currentMembers.filter((member) => member.memberId !== memberId),
                memberInfo,
            ];

    membersByRoom[roomId] = nextMembers;
    writeJSON(localStorage, LOCAL_KEYS.ROOM_MEMBERS_BY_ROOM, membersByRoom);
};

export const removeMemberForRoom = (roomId, memberId) => {
    const membersByRoom = getRoomMembersByRoom();
    const currentMembers = membersByRoom[roomId] ?? [];

    if (memberId == null) {
        delete membersByRoom[roomId];
    } else {
        const filteredMembers = currentMembers.filter(
            (member) => member.memberId !== memberId
        );

        if (filteredMembers.length === 0) {
            delete membersByRoom[roomId];
        } else {
            membersByRoom[roomId] = filteredMembers;
        }
    }

    writeJSON(localStorage, LOCAL_KEYS.ROOM_MEMBERS_BY_ROOM, membersByRoom);
};

// =========================
// 현재 탭에서 방별 활성 멤버(sessionStorage)
// 같은 브라우저여도 탭마다 다르게 유지됨
// =========================
export const getActiveMemberByRoom = () => {
    return readJSON(sessionStorage, SESSION_KEYS.ACTIVE_MEMBER_BY_ROOM, {});
};

export const getActiveMemberForRoom = (roomId) => {
    const activeMembers = getActiveMemberByRoom();
    return activeMembers[roomId] ?? null;
};

export const setActiveMemberForRoom = (roomId, memberInfo) => {
    const activeMembers = getActiveMemberByRoom();
    activeMembers[roomId] = memberInfo;
    writeJSON(sessionStorage, SESSION_KEYS.ACTIVE_MEMBER_BY_ROOM, activeMembers);
};

export const clearActiveMemberForRoom = (roomId) => {
    const activeMembers = getActiveMemberByRoom();
    delete activeMembers[roomId];
    writeJSON(sessionStorage, SESSION_KEYS.ACTIVE_MEMBER_BY_ROOM, activeMembers);
};

// =========================
// 초대 토큰(localStorage)
// =========================
export const getInviteTokenByRoom = () => {
    return readJSON(localStorage, LOCAL_KEYS.INVITE_TOKEN_BY_ROOM, {});
};

export const getInviteTokenForRoom = (roomId) => {
    const tokens = getInviteTokenByRoom();
    return tokens[roomId] ?? null;
};

export const saveInviteTokenForRoom = (roomId, token) => {
    const tokens = getInviteTokenByRoom();
    tokens[roomId] = token;
    writeJSON(localStorage, LOCAL_KEYS.INVITE_TOKEN_BY_ROOM, tokens);
};

export const removeInviteTokenForRoom = (roomId) => {
    const tokens = getInviteTokenByRoom();
    delete tokens[roomId];
    writeJSON(localStorage, LOCAL_KEYS.INVITE_TOKEN_BY_ROOM, tokens);
};

// =========================
// 방 하나 초기화
// localStorage의 방 데이터 제거
// 현재 탭 session도 같이 제거
// =========================
export const clearRoomStorage = (roomId) => {
    removeTripRoomId(roomId);
    removeMemberForRoom(roomId);
    removeInviteTokenForRoom(roomId);
    clearActiveMemberForRoom(roomId);

    const currentRoomId = getCurrentRoomId();
    if (currentRoomId === roomId) {
        clearCurrentRoomId();
    }
};

// =========================
// 저장된 여행방 목록
// =========================
export const getStoredRooms = () => {
    try {
        const saved = localStorage.getItem(LOCAL_KEYS.ROOMS);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("여행방 목록 불러오기 실패:", error);
        return [];
    }
};

export const saveStoredRooms = (rooms) => {
    try {
        localStorage.setItem(LOCAL_KEYS.ROOMS, JSON.stringify(rooms));
    } catch (error) {
        console.error("여행방 목록 저장 실패:", error);
    }
};