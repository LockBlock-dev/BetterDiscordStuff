const {
    Webpack: { getByKeys },
} = BdApi;

export const MediaBadges = getByKeys("renderMediaBadge", "renderMentionBadge");
