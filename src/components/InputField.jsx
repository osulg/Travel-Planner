// 공통 입력창 컴포넌트
// 여러 입력칸에서 재사용할 수 있도록 만든 UI 컴포넌트

function InputField({
    label,         // 입력칸 위 제목
    placeholder,   // 입력칸 안 안내 문구
    type = 'text', // input 타입 (기본값: text)
    value,         // 현재 입력값
    onChange,      // 값 변경 함수
    name,          // input 이름
}) {
    return (
        <div className="input-group">
            {/* 입력칸 제목 */}
            <label className="input-label">{label}</label>

            {/* 실제 입력칸 */}
            <input
                className="input-field"

                // input 타입 지정
                // 예: text, password, email
                type={type}

                // 입력 전 안내 문구
                placeholder={placeholder}

                // 현재 입력값 표시
                value={value}

                // 사용자가 입력할 때 실행되는 함수
                onChange={onChange}

                // input 식별용 name
                name={name}
            />
        </div>
    )
}

export default InputField