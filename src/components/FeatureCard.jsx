// 하단 기능 카드 공통 컴포넌트
// 부모(HomePage)에게서 icon, title, description을 받아서
// 동일한 카드 모양으로 화면에 출력하는 역할

function FeatureCard({ icon, title, description }) {
  return (
    // 카드 전체 영역
    <div className="feature-card">
      {/* 아이콘 표시 영역 */}
      <div className="feature-card-icon">{icon}</div>

      {/* 카드 제목 */}
      <h3 className="feature-card-title">{title}</h3>

      {/* 카드 설명 문구 */}
      <p className="feature-card-description">{description}</p>
    </div>
  )
}

export default FeatureCard