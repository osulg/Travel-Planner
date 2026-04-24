import { useState, useEffect } from "react";
import "../styles/comment-modal.css";

// 댓글 모달 컴포넌트
function CommentModal({ place, onClose, onAddComment }) {
    // 현재 입력창 값
    const [input, setInput] = useState("");

    const [comments, setComments] = useState(
        Array.isArray(place.comments) ? place.comments : []
    );

    useEffect(() => {
        setComments(Array.isArray(place.comments) ? place.comments : []);
    }, [place.comments]);

    /* func: 댓글 작성 제출 함수 */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const newComment = await onAddComment(place.id, input.trim());

        if (newComment) {
            setComments((prev) => [...prev, newComment]);
        }

        setInput("");
    };

    return (
        // 모달 바깥 배경
        // 클릭 시 모달 닫기
        <div className="comment-modal-overlay" onClick={onClose}>

            {/* 실제 모달 창 */}
            {/* 내부 클릭 시 바깥으로 이벤트 전파 방지 */}
            <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="comment-modal-header">
                    <div>
                        {/* 모달 제목 */}
                        <h2 className="comment-modal-title">{place.title} - 댓글</h2>

                        {/* 현재 어떤 장소의 댓글인지 표시 */}
                        <p className="comment-modal-subtitle">{place.title}</p>
                    </div>

                    {/* 닫기 버튼 */}
                    <button
                        type="button"
                        className="comment-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {/* 댓글 목록 영역 */}
                <div className="comment-list">
                    {/*댓글이 없을 때*/}
                    {
                        comments.length === 0 ? (
                            <p className="comment-empty">아직 댓글이 없습니다.</p>
                        ) : (
                            // 댓글이 있을 때 목록 렌더링
                            comments.map((comment, index) => (
                                <div key={`${comment.id}-${comment.createdAt}-${index}`} className="comment-item">
                                    {/* 상단: 작성자 + 삭제 버튼 */}
                                    {/* 작성자 */}
                                    <div className="comment-item-top">
                                        <strong>{comment.author}</strong>

                                        {/* 댓글 삭제
                                        <button
                                            type="button"
                                            className="comment-delete-btn"
                                            onClick={() => onDeleteComment(place.id, comment.id)}
                                        >
                                            ×
                                        </button> */}
                                    </div>

                                    {/* 댓글 본문 */}
                                    <p className="comment-text">{comment.text}</p>

                                    {/* 날짜 */}
                                    <div className="comment-date-row">
                                        <span className="comment-date">{comment.createdAt}</span>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>

                {/* 댓글 입력 폼 */}
                <form className="comment-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="comment-input"
                        placeholder="댓글을 입력하세요"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    {/* 작성 버튼 */}
                    <button type="submit" className="comment-submit-btn">
                        작성
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CommentModal;