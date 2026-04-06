function MyTripBox({ trip, onClick, onDelete }) {
    return (
        <section
            className="my-trip-box"
            onClick={() => onClick(trip)}
            style={{ cursor: 'pointer' }}
        >
            <button
                className="trip-delete-button"
                onClick={(event) => {
                    event.stopPropagation()
                    onDelete(trip.id)
                }}
                aria-label="여행방 삭제"
            >
                ×
            </button>

            <h3 className="my-trip-title">{trip.name}</h3>
            <p className="my-trip-description">
                {trip.startDate} ~ {trip.endDate}
            </p>
        </section>
    )
}

export default MyTripBox