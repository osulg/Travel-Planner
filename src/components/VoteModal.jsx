import { useState } from "react";
import "../styles/vote-modal.css";

function VoteModal({ onClose, onCreate, places }) {
    const [title, setTitle] = useState("");
    const [deadline, setDeadline] = useState("");
    const [options, setOptions] = useState([
        { id: 1, placeId: "" },
        { id: 2, placeId: "" },
    ]);

    const handleOptionChange = (id, value) => {
        setOptions((prev) =>
            prev.map((option) =>
                option.id === id ? { ...option, placeId: value } : option
            )
        );
    };

    const handleAddOption = () => {
        setOptions((prev) => [
            ...prev,
            { id: Date.now(), placeId: "" },
        ]);
    };

    const handleDeleteOption = (id) => {
        setOptions((prev) => prev.filter((option) => option.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("투표 제목을 입력해주세요.");
            return;
        }

        const selectedPlaceIds = options
            .map((option) => option.placeId)
            .filter(Boolean);

        if (selectedPlaceIds.length < 2) {
            alert("선택지는 최소 2개 필요합니다.");
            return;
        }

        const uniqueIds = new Set(selectedPlaceIds);
        if (uniqueIds.size !== selectedPlaceIds.length) {
            alert("같은 장소를 중복 선택할 수 없습니다.");
            return;
        }

        const selectedPlaces = selectedPlaceIds
            .map((placeId) =>
                places.find((place) => String(place.id) === String(placeId))
            )
            .filter(Boolean);

        const newVote = {
            id: Date.now(),
            title,
            authorName: localStorage.getItem("userName") || "홍길동",
            createdAt: new Date().toLocaleDateString("ko-KR"),
            deadline,
            status: "open",
            userVote: null,
            options: selectedPlaces.map((place) => ({
                id: place.id,
                text: place.title,
                link: place.sourceUrl,
                votes: 0,
            })),
        };

        onCreate(newVote);
    };

    return (
        <div className="vote-modal-overlay" onClick={onClose}>
            <div className="vote-modal" onClick={(e) => e.stopPropagation()}>
                <div className="vote-modal-header">
                    <h2 className="vote-modal-title">새 투표 추가</h2>

                    <button
                        type="button"
                        className="vote-close-button"
                        onClick={onClose}
                        aria-label="모달 닫기"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="vote-form">
                    <label className="vote-label">투표 제목 *</label>
                    <input
                        className="vote-input"
                        type="text"
                        placeholder="어디로 갈까요?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <label className="vote-label">선택지 *</label>
                    <div className="vote-select-list">
                        {options.map((option, index) => (
                            <div key={option.id} className="vote-option-row">
                                <select
                                    className="vote-select"
                                    value={option.placeId}
                                    onChange={(e) =>
                                        handleOptionChange(option.id, e.target.value)
                                    }
                                >
                                    <option value="">{`선택지 ${index + 1}`}</option>
                                    {places.map((place) => (
                                        <option key={place.id} value={place.id}>
                                            {place.title}
                                        </option>
                                    ))}
                                </select>

                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        className="delete-option-button"
                                        onClick={() => handleDeleteOption(option.id)}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="add-option-button"
                        onClick={handleAddOption}
                    >
                        + 선택지 추가
                    </button>

                    <label className="vote-label">마감시간 (선택)</label>
                    <input
                        className="vote-input"
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />

                    <button type="submit" className="vote-submit-button">
                        추가하기
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VoteModal;