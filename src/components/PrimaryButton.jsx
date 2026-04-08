// 공통 기본 버튼 컴포넌트
// 부모에게서 버튼 글자, 클릭 함수, 버튼 타입을 받아서
// 동일한 스타일의 버튼으로 화면에 출력하는 역할

function PrimaryButton({ text, onClick, type = 'button' }) {
  return (
    <button
      // 공통 버튼 스타일 클래스
      className="primary-button"

      // 버튼 타입 지정
      // 부모가 안 넘기면 기본값은 'button'
      type={type}

      // 버튼 클릭 시 실행할 함수
      onClick={onClick}
    >
      {/* 버튼 안에 표시할 글자 */}
      {text}
    </button>
  )
}

export default PrimaryButton