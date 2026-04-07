import { useState } from "react";
import "../styles/place-modal.css";

function PlaceModal({ initialData, onClose, onSave }) {
    const [form, setForm] = useState({
        title: initialData?.title || "",
        sourceUrl: initialData?.sourceUrl || "",
        memo: initialData?.memo || "",
        estimatedCost: initialData?.estimatedCost || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "estimatedCost" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.title.trim()) {
            alert("장소명을 입력해주세요");
            return;
        }

        if (!form.sourceUrl.trim()) {
            alert("링크를 입력해주세요");
            return;
        }

        onSave(form);
    };

    return (
        <div className="place-modal-overlay" onClick={onClose}>
            <div className="place-modal" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="place-modal-close"
                    onClick={onClose}
                >
                    ×
                </button>

                <h2>{initialData ? "장소 수정" : "새 장소 추가"}</h2>

                <form className="place-form" onSubmit={handleSubmit}>
                    <label>장소 이름*</label>
                    <input
                        name="title"
                        placeholder="장소명(필수)*"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                    <label>링크*</label>
                    <input
                        name="sourceUrl"
                        placeholder={initialData ? "링크 수정 불가" : "http://map.naver.com"}
                        value={form.sourceUrl}
                        onChange={handleChange}
                        required
                        disabled={!!initialData}
                    />
                    <label>예산(선택)</label>
                    <input
                        name="estimatedCost"
                        type="number"
                        placeholder="20000"
                        value={form.estimatedCost}
                        onChange={handleChange}
                    />
                    <label>메모(선택)</label>
                    <textarea
                        name="memo"
                        placeholder="저녁 산책 가능"
                        value={form.memo}
                        onChange={handleChange}
                    />

                    <div className="place-modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="modal-cancel-btn"
                        >
                            취소
                        </button>
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