// 내 여행방 카드 컴포넌트
// 여행방 하나를 카드 형태로 보여주고
// 카드 클릭 시 입장, 삭제 버튼 클릭 시 삭제를 담당

function MyTripBox({ trip, onClick, onDelete }) {
    return (
        <section
            // 카드 전체 영역 스타일 클래스
            className="my-trip-box"

            // 카드 전체를 클릭하면 해당 여행방 클릭 함수 실행
            // 부모에게 현재 trip 객체를 전달
            onClick={() => onClick(trip)}

            // 마우스를 올렸을 때 손가락 모양 커서 표시
            style={{ cursor: 'pointer' }}
        >
            {/* 카드 우측 상단 삭제 버튼 */}
            <button
                className="trip-delete-button"

                // 삭제 버튼 클릭 이벤트
                onClick={(event) => {
                    // 부모 section의 클릭 이벤트로 전파되지 않도록 막음
                    // 즉 삭제 버튼 클릭 시 카드 입장 이벤트가 같이 실행되지 않음
                    event.stopPropagation()

                    // 부모에게 trip.id 전달해서 삭제 요청
                    onDelete(trip.id)
                }}

                // 접근성용 설명 텍스트
                aria-label="여행방 삭제"
            >
                ×
            </button>

            {/* 여행방 이름 */}
            <h3 className="my-trip-title">{trip.name}</h3>

            {/* 여행 기간 표시 */}
            <p className="my-trip-description">
                {trip.startDate} ~ {trip.endDate}
            </p>
        </section>
    )
}

export default MyTripBox