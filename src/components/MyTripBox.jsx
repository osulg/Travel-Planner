function MyTripBox({ trip, onClick }) {
    return (
        <section
            className="my-trip-box"
            onClick={() => onClick(trip)}
            style={{ cursor: 'pointer' }}
        >
            <h3 className="my-trip-title">{trip.roomName}</h3>
            <p className="my-trip-description">
                {trip.startDate} ~ {trip.endDate}
            </p>
        </section>
    )
}

export default MyTripBox