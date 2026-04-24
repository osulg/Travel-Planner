import { useState } from "react";
import "../styles/vote-modal.css";

// 새 투표 생성 모달
function VoteModal({
    onClose,    // 모달 닫기
    onCreate,   // 새 투표 생성 완료 시 부모로 전달
    places,      // 현재 장소 목록 (투표 선택지)
}) {
    // 투표 제목 입력값
    const [title, setTitle] = useState("");

    // 마감시간 입력값
    // datetime-local input 값이 들어감
    const [deadline, setDeadline] = useState("");

    // 선택지 목록 state
    // 처음엔 2개 기본 생성
    // 각 선택지는 "이 선택지 칸에서 어떤 place를 고를지"를 placeId로 저장
    const [options, setOptions] = useState([
        { id: 1, placeId: "" },
        { id: 2, placeId: "" },
    ]);

    // 특정 선택지 칸에서 선택된 placeId를 바꾸는 함수
    const handleOptionChange = (id, value) => {
        setOptions((prev) =>
            prev.map((option) =>
                option.id === id ? { ...option, placeId: value } : option
            )
        );
    };

    // 선택지 추가
    // 새로운 선택지 row를 하나 더 넣음
    const handleAddOption = () => {
        setOptions((prev) => [
            ...prev,
            { id: Date.now(), placeId: "" },
        ]);
    };

    // 선택지 삭제
    // 해당 id를 가진 선택지 row 제거
    const handleDeleteOption = (id) => {
        setOptions((prev) => prev.filter((option) => option.id !== id));
    };

    // 폼 제출
    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            alert("투표 제목을 입력해주세요.");
            return;
        }

        if (!deadline) {
            alert("마감시간을 선택해주세요.");
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

        const payload = {
            title: trimmedTitle,
            deadline,
            options: selectedPlaceIds.map((placeId) => ({
                placeId,
            })),
        };

        onCreate(payload);
    };

    return (
        // 배경 클릭 시 모달 닫기
        <div className="vote-modal-overlay" onClick={onClose}>
            {/* 모달 본체 클릭 시 배경 클릭 이벤트 전파 방지 */}
            <div className="vote-modal" onClick={(e) => e.stopPropagation()}>
                <div className="vote-modal-header">
                    <h2 className="vote-modal-title">새 투표 추가</h2>

                    {/* 닫기 버튼 */}
                    <button
                        type="button"
                        className="vote-close-button"
                        onClick={onClose}
                        aria-label="모달 닫기"
                    >
                        ×
                    </button>
                </div>

                {/* 투표 생성 폼 */}
                <form onSubmit={handleSubmit} className="vote-form">
                    {/* 제목 입력 */}
                    <label className="vote-label">투표 제목 *</label>
                    <input
                        className="vote-input"
                        type="text"
                        placeholder="어디로 갈까요?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    {/* 선택지 목록 */}
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
                                    {/* 기본 placeholder option */}
                                    <option value="">{`선택지 ${index + 1}`}</option>

                                    {/* 현재 등록된 장소 목록을 선택지 후보로 보여줌 */}
                                    {places.map((place) => (
                                        <option key={place.id} value={place.id}>
                                            {place.title}
                                        </option>
                                    ))}
                                </select>

                                {/* 선택지가 3개 이상일 때만 삭제 버튼 허용
                                   최소 2개는 유지하려는 의도 */}
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

                    {/* 선택지 추가 버튼 */}
                    <button
                        type="button"
                        className="add-option-button"
                        onClick={handleAddOption}
                    >
                        + 선택지 추가
                    </button>

                    {/* 마감시간 입력 */}
                    <label className="vote-label">마감시간 *</label>
                    <input
                        className="vote-input"
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />

                    {/* 제출 버튼 */}
                    <button type="submit" className="vote-submit-button">
                        추가하기
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VoteModal;