import { useState } from "react";
import "../styles/place-modal.css";

// 장소 추가 / 수정 모달 컴포넌트
function PlaceModal({ initialData, onClose, onSave }) {
    // 입력 폼 state
    // 수정 모드면 initialData 값으로 초기화
    // 추가 모드면 빈 문자열로 시작
    const [form, setForm] = useState({
        title: initialData?.title || "",
        sourceUrl: initialData?.sourceUrl || "",
        memo: initialData?.memo || "",
        estimatedCost: initialData?.estimatedCost || "",
    });

    /* func: input, textarea 값 변경 처리 */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            // estimatedCost는 숫자로 변환
            // 나머지는 문자열 그대로 저장
            [name]: name === "estimatedCost" ? Number(value) : value,
        }));
    };

    /* func: 저장 버튼 클릭 시 실행 */
    const handleSubmit = (e) => {
        e.preventDefault(); // form 기본 새로고침 방지

        // 장소명 검증
        if (!form.title.trim()) {
            alert("장소명을 입력해주세요");
            return;
        }

        // 링크 검증
        if (!form.sourceUrl.trim()) {
            alert("링크를 입력해주세요");
            return;
        }

        // 부모 컴포넌트로 입력값 전달
        onSave(form);
    };

    return (
        // 모달 바깥쪽 어두운 배경
        // 배경 클릭 시 모달 닫기
        <div className="place-modal-overlay" onClick={onClose}>
            {/* 실제 모달 창 */}
            {/* 내부 클릭 시 overlay까지 이벤트가 퍼지지 않도록 막음 */}
            <div className="place-modal" onClick={(e) => e.stopPropagation()}>
                {/* 오른쪽 위 닫기 버튼 */}
                <button
                    type="button"
                    className="place-modal-close"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* 모달 제목 */}
                <h2>{initialData ? "장소 수정" : "새 장소 추가"}</h2>

                {/* 입력 폼 */}
                <form className="place-form" onSubmit={handleSubmit}>
                    {/* 장소 이름 */}
                    <label>장소 이름*</label>
                    <input
                        name="title"
                        placeholder="장소명(필수)*"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    {/* 링크 */}
                    <label>링크*</label>
                    <input
                        name="sourceUrl"
                        placeholder={initialData ? "링크 수정 불가" : "http://map.naver.com"}
                        value={form.sourceUrl}
                        onChange={handleChange}
                        required
                        disabled={!!initialData}
                    />

                    {/* 예산 */}
                    <label>예산(선택)</label>
                    <input
                        name="estimatedCost"
                        type="number"
                        placeholder="20000"
                        value={form.estimatedCost}
                        onChange={handleChange}
                    />

                    {/* 메모 */}
                    <label>메모(선택)</label>
                    <textarea
                        name="memo"
                        placeholder="저녁 산책 가능"
                        value={form.memo}
                        onChange={handleChange}
                    />

                    {/* 하단 버튼 영역 */}
                    <div className="place-modal-actions">
                        {/* <button
                            type="button"
                            onClick={onClose}
                            className="modal-cancel-btn"
                        >
                            취소
                        </button> */}
                        <button type="submit" className="modal-save-btn">
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PlaceModal;