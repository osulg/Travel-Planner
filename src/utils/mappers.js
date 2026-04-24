export const mapPlannerPlace = (place) => ({
    id: place.placeId,
    title: place.title,
    sourceUrl: place.sourceUrl,
    memo: place.memo ?? "",
    estimatedCost: place.estimatedCost ?? 0,
    isMust: place.isRequired,
    isScheduled: place.isScheduled,
    likes: place.reactionSummary?.likeCount ?? 0,
    dislikes: place.reactionSummary?.dislikeCount ?? 0,
    commentCount: place.reactionSummary?.commentCount ?? 0,
    userReaction: place.myReaction ?? null,
});

export const mapPlannerScheduleItems = (days = [], scheduleItems = []) => {
    const dayMap = Object.fromEntries(
        days.map((day) => [day.itineraryDayId, day.date])
    );

    return scheduleItems.map((item) => ({
        id: item.scheduleItemId,
        itineraryDayId: item.itineraryDayId,
        date: dayMap[item.itineraryDayId] ?? "",
        placeId: item.placeId,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
        memo: item.memo ?? null,
    }));
};

export const mapVote = (vote) => ({
    id: vote.voteId,
    title: vote.title,
    authorName: vote.createdBy,
    deadline: vote.deadline,
    status: (vote.status ?? "").toLowerCase(),
    userVote: vote.myVoteOptionId,
    participantCount: vote.participantCount ?? 0,
    memberCount: vote.memberCount ?? 0,
    options: (vote.options ?? []).map((option) => ({
        id: option.voteOptionId,
        placeId: option.placeId,
        text: option.optionText,
        link: option.linkUrl,
        votes: option.voteCount,
        voteRate: option.voteRate,
    })),
});

export const mapSettingsData = (data) => ({
    members: data.members ?? [],
    inviteLink: data.invite?.inviteUrl ?? "",
    room: data.room ?? null,
});