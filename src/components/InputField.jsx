// 공통 입력창 컴포넌트
// 여러 입력칸에서 재사용 가능

// 공통 입력창 컴포넌트
function InputField({ label, placeholder, type = 'text' }) {
    return (
        <div className="input-group">
            {/* 입력칸 제목 */}
            <label className="input-label">{label}</label>

            {/* 실제 입력칸 */}
            <input
                className="input-field"
                type={type}
                placeholder={placeholder}
            />
        </div>
    )
}

export default InputField