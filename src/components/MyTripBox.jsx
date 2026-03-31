// 내 여행 방 안내 박스 컴포넌트
// 현재는 제목과 설명만 보여주는 간단한 박스

function MyTripBox() {
    return (
        // 박스 전체 영역
        <section className="my-trip-box">
            {/* 박스 제목 */}
            <h3 className="my-trip-title">내 여행 방 (3)</h3>

            {/* 설명 문구 */}
            <p className="my-trip-description">참여 중인 여행 계획 목록입니다</p>
        </section>
    )
}

export default MyTripBox