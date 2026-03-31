// 하단 기능 카드 공통 컴포넌트
// 제목과 설명을 받아서 카드 하나를 보여줌

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-card-icon">{icon}</div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
    </div>
  )
}

export default FeatureCard