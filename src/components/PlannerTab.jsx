import { useState } from "react";
import PlaceCard from "./PlaceCard";
import PlaceModal from "./PlaceModal";

function PlannerTab({ places, setPlaces }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlace, setEditingPlace] = useState(null);

    const handleOpenAddModal = () => {
        setEditingPlace(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (place) => {
        setEditingPlace(place);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlace(null);
    };

    const handleSavePlace = (formData) => {
        if (editingPlace) {
            setPlaces((prev) =>
                prev.map((place) =>
                    place.id === editingPlace.id
                        ? { ...place, ...formData }
                        : place
                )
            );
        } else {
            const newPlace = {
                id: Date.now(),
                likes: 0,
                dislikes: 0,
                isMust: false,
                userReaction: null,
                ...formData,
            };

            setPlaces((prev) => [newPlace, ...prev]);
        }

        handleCloseModal();
    };

    const handleToggleMust = (placeId) => {
        setPlaces((prev) =>
            prev.map((place) =>
                place.id === placeId
                    ? { ...place, isMust: !place.isMust }
                    : place
            )
        );
    };

    const handleLike = (placeId) => {
        setPlaces((prev) =>
            prev.map((place) => {
                if (place.id !== placeId) return place;

                if (place.userReaction === "like") {
                    return {
                        ...place,
                        likes: Math.max(0, place.likes - 1),
                        userReaction: null,
                    };
                }

                if (place.userReaction === "dislike") {
                    return {
                        ...place,
                        likes: place.likes + 1,
                        dislikes: Math.max(0, place.dislikes - 1),
                        userReaction: "like",
                    };
                }

                return {
                    ...place,
                    likes: place.likes + 1,
                    userReaction: "like",
                };
            })
        );
    };

    const handleDislike = (placeId) => {
        setPlaces((prev) =>
            prev.map((place) => {
                if (place.id !== placeId) return place;

                if (place.userReaction === "dislike") {
                    return {
                        ...place,
                        dislikes: Math.max(0, place.dislikes - 1),
                        userReaction: null,
                    };
                }

                if (place.userReaction === "like") {
                    return {
                        ...place,
                        likes: Math.max(0, place.likes - 1),
                        dislikes: place.dislikes + 1,
                        userReaction: "dislike",
                    };
                }

                return {
                    ...place,
                    dislikes: place.dislikes + 1,
                    userReaction: "dislike",
                };
            })
        );
    };

    return (
        <section className="planner-layout">
            <div className="planner-left">
                <div className="planner-section-header">
                    <h3 className="planner-title">일정표</h3>
                </div>

                <div className="planner-board">
                    <div className="planner-grid">시간표 영역</div>
                </div>
            </div>

            <aside className="planner-sidebar">
                <div className="planner-sidebar-header">
                    <h3>장소 목록</h3>
                    <button
                        className="add-place-button"
                        onClick={handleOpenAddModal}
                    >
                        + 장소 추가
                    </button>
                </div>

                <div className="place-card-list">
                    {places.map((place) => (
                        <PlaceCard
                            key={place.id}
                            place={place}
                            onEdit={() => handleOpenEditModal(place)}
                            onToggleMust={handleToggleMust}
                            onLike={() => handleLike(place.id)}
                            onDislike={() => handleDislike(place.id)}
                        />
                    ))}
                </div>
            </aside>

            {isModalOpen && (
                <PlaceModal
                    initialData={editingPlace}
                    onClose={handleCloseModal}
                    onSave={handleSavePlace}
                />
            )}
        </section>
    );
}

export default PlannerTab;