const {
    Webpack: { getByKeys },
} = BdApi;

// Misc modules
export const EmojiUtils = BdApi.Webpack.getByKeys(
    "isEmojiFilteredOrLocked",
    "filterUnsupportedEmojis"
);
