import "../styles/place-card.css";
import { FiThumbsUp, FiThumbsDown, FiMessageCircle } from "react-icons/fi";

// 장소 카드 컴포넌트
function PlaceCard({
    place,              // 장소 데이터 객체
    onEdit,             // 수정 버튼 클릭 함수
    onDelete,           // 삭제 버튼 클릭 함수
    onLike,             // 좋아요 클릭 함수
    onDislike,          // 싫어요 클릭 함수
    onToggleMust,       // 필수 장소 토글 함수
    onSchedule,         // 확정 버튼 클릭 함수
    onOpenComments,     // 댓글 모달 열기 함수
    isHighlighted,      // 강조 표시 여부
    ...rest             // 나머지 props
}) {

    // 댓글 개수 계산
    // comments가 배열이면 길이 반환
    // 없으면 0개 처리
    const commentCount = Array.isArray(place.comments) ? place.comments.length : 0;

    return (
        // 장소 카드 전체 박스
        // highlighted가 true이면 css 클래스 추가
        <div className={`place-card ${isHighlighted ? "highlighted" : ""}`}>
            {/* 카드 상단 영역 */}
            <div className="place-card-header">
                {/* 장소 이름 영역 */}
                <div className="place-title-wrap">
                    <h3 className="place-name">{place.title}</h3>
                </div>

                {/* 상단 버튼 영역 */}
                <div className="place-card-header-actions">
                    {/* 일정 확정 버튼 */}
                    <button className="mini-action-btn" onClick={() => onSchedule(place)}>
                        확정
                    </button>

                    {/* 수정 버튼 */}
                    <button className="mini-action-btn" onClick={onEdit}>
                        수정
                    </button>

                    {/* 삭제 버튼 */}
                    <button className="mini-action-btn" onClick={onDelete}>
                        삭제
                    </button>

                    {/* 필수 장소 뱃지 */}
                    {place.isMust && <span className="must-badge">필수</span>}
                </div>
            </div>

            {/* 링크 표시 영역 */}
            <div className="place-link-box">
                <span className="link-label">링크</span>
                <a
                    href={place.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="place-link"
                >
                    {place.sourceUrl}
                </a>
            </div>

            {/* 메모 영역 */}
            <div className="place-memo-box">
                <span className="memo-label">메모</span>
                <p className="place-memo">{place.memo}</p>
            </div>

            {/* 예산 표시 */}
            <div className="place-budget">
                예산: {Number(place.estimatedCost || 0).toLocaleString()}원
            </div>

            {/* 좋아요 / 싫어요 / 댓글 버튼 영역 */}
            <div className="place-action-row">
                {/* 좋아요 버튼 */}
                <button
                    className={`action-btn small ${place.userReaction === "like" ? "active" : ""}`}
                    onClick={onLike}
                >
                    <FiThumbsUp size={16} />
                    <span>{place.likes}</span>
                </button>

                {/* 싫어요 버튼 */}
                <button
                    className={`action-btn small ${place.userReaction === "dislike" ? "active" : ""}`}
                    onClick={onDislike}
                >
                    <FiThumbsDown size={16} />
                    <span>{place.dislikes}</span>
                </button>

                {/* 댓글 버튼 */}
                <button
                    className="action-btn small"
                    type="button"
                    onClick={() => onOpenComments(place)}
                >
                    <FiMessageCircle size={16} />
                    <span>{commentCount}</span>
                </button>
            </div>

            {/* 필수 장소 토글 버튼 */}
            <button
                className={`action-btn must-btn ${place.isMust ? "active" : ""}`}
                onClick={() => onToggleMust(place.id)}
            >
                ★ 필수 장소
            </button>
        </div>
    );
}

export default PlaceCard;