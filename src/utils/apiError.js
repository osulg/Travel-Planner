export const ERROR_MESSAGES = {
    // ROOM
    ROOM_40001: "잘못된 방 생성 요청입니다.",
    ROOM_40002: "시작일이 종료일보다 늦습니다.",
    ROOM_40401: "존재하지 않는 방입니다.",

    // MEMBER
    MEMBER_40001: "잘못된 멤버 요청입니다.",
    MEMBER_40101: "이름 또는 비밀번호가 올바르지 않습니다.",
    MEMBER_40301: "방 소속 멤버가 아닙니다.",
    MEMBER_40901: "같은 방에 이미 존재하는 이름입니다.",

    // INVITE
    INVITE_40401: "존재하지 않는 초대 링크입니다.",
    INVITE_41001: "만료되었거나 유효하지 않은 초대 링크입니다.",

    // PLACE
    PLACE_40001: "잘못된 장소 요청입니다.",
    PLACE_40002: "장소 이름이 누락되었습니다.",
    PLACE_40003: "링크가 누락되었거나 형식이 올바르지 않습니다.",
    PLACE_40401: "존재하지 않는 장소입니다.",
    PLACE_40901: "이미 일정표에 확정된 장소라 삭제할 수 없습니다.",

    // COMMENT
    COMMENT_40001: "댓글 내용이 누락되었습니다.",
    COMMENT_40401: "존재하지 않는 댓글입니다.",

    // ITINERARY
    ITINERARY_40001: "잘못된 일정 요청입니다.",
    ITINERARY_40401: "존재하지 않는 일정 일자입니다.",
    ITINERARY_40402: "존재하지 않는 일정 아이템입니다.",
    ITINERARY_40901: "동일 시간대 일정이 충돌합니다.",

    // VOTE
    VOTE_40001: "잘못된 투표 생성 요청입니다.",
    VOTE_40002: "투표 제목 누락입니다.",
    VOTE_40003: "선택지가 2개 미만입니다.",
    VOTE_40004: "마감 시간이 현재보다 과거입니다.",
    VOTE_40401: "존재하지 않는 투표입니다.",
    VOTE_40901: "이미 마감된 투표입니다.",
    VOTE_40902: "같은 방에 속하지 않는 장소를 선택지로 지정합니다.",

    // VOTE OPTION
    VOTE_OPTION_40401: "존재하지 않는 선택지입니다.",

    // VOTE RESPONSE
    VOTE_RESPONSE_40001: "잘못된 투표 요청입니다.",
    VOTE_RESPONSE_40901: "이미 마감된 투표에는 참여할 수 없습니다.",

    // MEMBER
    MEMBER_40101: "유효하지 않은 멤버입니다.",
    MEMBER_40301: "방 소속 멤버가 아닙니다."

};

export function getApiErrorMessage(error) {
    return (
        ERROR_MESSAGES[error.code] ||
        error.message ||
        "알 수 없는 오류가 발생했습니다."
    );
}