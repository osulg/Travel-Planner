import { useState } from "react";
import "../styles/comment-modal.css";

function CommentModal({ place, onClose, onAddComment, onDeleteComment }) {
    const [input, setInput] = useState("");

    const comments = Array.isArray(place.comments) ? place.comments : [];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        onAddComment(place.id, input.trim());
        setInput("");
    };

    return (
        <div className="comment-modal-overlay" onClick={onClose}>
            <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="comment-modal-header">
                    <div>
                        <h2 className="comment-modal-title">한강 · 댓글</h2>
                        <p className="comment-modal-subtitle">{place.title}</p>
                    </div>

                    <button
                        type="button"
                        className="comment-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="comment-list">
                    {comments.length === 0 ? (
                        <p className="comment-empty">아직 댓글이 없습니다.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment-item">
                                <div className="comment-item-top">
                                    <strong>{comment.author}</strong>
                                    <span>{comment.createdAt}</span>
                                </div>

                                <p className="comment-text">{comment.text}</p>

                                <button
                                    type="button"
                                    className="comment-delete-btn"
                                    onClick={() => onDeleteComment(place.id, comment.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <form className="comment-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="comment-input"
                        placeholder="댓글을 입력하세요"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" className="comment-submit-btn">
                        작성
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CommentModal;