// Header Component
// 홈 화면의 상단 아이콘, 제목, 설명 문구

function Header() {
  return (
    // 헤더 전체 영역
    <header className="header">
      {/* 비행기 아이콘 */}
      <div className="header-icon">✈️</div>

      {/* 메인 제목 */}
      <h1 className="header-title">여행 플래너</h1>

      {/* 설명 문구 */}
      <p className="header-description">
        친구들과 함께 완벽한 여행 계획을 세워보세요
      </p>
    </header>
  )
}

export default Header