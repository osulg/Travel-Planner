import { FiSend } from "react-icons/fi";

// Header Component
// 홈 화면의 상단 아이콘, 제목, 설명 문구
function Header() {
  return (
    // 헤더 전체 영역
    // className="header"는 CSS에서 이 영역 전체 스타일을 줄 때 사용
    <header className="header">
      {/* 아이콘 영역 */}
      <div className="header-icon">
        <FiSend size={22} />
      </div>

      {/* 메인 제목 */}
      <h1 className="header-title">여행 플래너</h1>

      {/* 설명 문구 */}
      <p className="header-description">
        친구들과 함께 완벽한 여행 계획을 세워보세요
      </p>
    </header>
  )
}

// 다른 파일에서 import 해서 사용할 수 있도록 내보냄
export default Header