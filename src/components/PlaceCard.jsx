import "../styles/place-card.css";
import { FiEdit2 } from "react-icons/fi";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";

function PlaceCard({ place, onEdit, onLike, onDislike, onToggleMust }) {
    return (
        <div className="place-card">
            <div className="place-card-header">
                <div className="place-title-wrap">
                    <span className="place-category">{place.category}</span>
                    <h3 className="place-name">{place.name}</h3>
                </div>

                <div className="place-card-header-actions">
                    <button className="edit-btn" onClick={onEdit}>
                        <FiEdit2 />
                        수정
                    </button>
                    {place.isMust && <span className="must-badge">필수</span>}
                </div>
            </div>

            <div className="place-link-box">
                <span className="link-label">링크</span>
                <a
                    href={place.link}
                    target="_blank"
                    rel="noreferrer"
                    className="place-link"
                >
                    {place.link}
                </a>
            </div>

            <div className="place-memo-box">
                <span className="memo-label">메모</span>
                <p className="place-memo">{place.memo}</p>
            </div>

            <div className="place-budget">
                예산: {Number(place.budget || 0).toLocaleString()}원
            </div>

            <div className="place-action-row">
                <button
                    className={`action-btn small ${place.userReaction === "like" ? "active" : ""}`}
                    onClick={onLike}
                >
                    <FiThumbsUp size={16} />
                    <span>{place.likes}</span>
                </button>

                <button
                    className={`action-btn small ${place.userReaction === "dislike" ? "active" : ""}`}
                    onClick={onDislike}
                >
                    <FiThumbsDown size={16} />
                    <span>{place.dislikes}</span>
                </button>
            </div>

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