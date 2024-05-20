const {
    Webpack: { getByKeys },
} = BdApi;

/**
 * Discord classes
 */
export default {
    guildListItem: getByKeys("lowerBadge", "upperBadge", "wrapper"),
};
