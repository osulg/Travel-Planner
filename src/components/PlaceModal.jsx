import { useState } from "react";
import "../styles/place-modal.css";

function PlaceModal({ initialData, onClose, onSave }) {
    const [form, setForm] = useState({
        name: initialData?.name || "",
        category: initialData?.category || "",
        link: initialData?.link || "",
        memo: initialData?.memo || "",
        budget: initialData?.budget || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "budget" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("장소명을 입력해주세요");
            return;
        }

        if (!form.link.trim()) {
            alert("링크를 입력해주세요");
            return;
        }

        onSave(form);
    };

    return (
        <div className="place-modal-overlay" onClick={onClose}>
            <div className="place-modal" onClick={(e) => e.stopPropagation()}>
                <h2>{initialData ? "장소 수정" : "장소 추가"}</h2>

                <form className="place-form" onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="장소명(필수)*"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="category"
                        placeholder="카테고리(선택)"
                        value={form.category}
                        onChange={handleChange}
                    />
                    <input
                        name="link"
                        placeholder="링크(필수)*"
                        value={form.link}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="budget"
                        type="number"
                        placeholder="예산(선택)"
                        value={form.budget}
                        onChange={handleChange}
                    />
                    <textarea
                        name="memo"
                        placeholder="메모(선택)"
                        value={form.memo}
                        onChange={handleChange}
                    />

                    <div className="place-modal-actions">
                        <button type="button" onClick={onClose} className="modal-cancel-btn">
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