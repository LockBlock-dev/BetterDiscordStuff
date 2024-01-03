const {
    Webpack: { getByKeys, getModule },
} = BdApi;

// Misc modules
export const EmojiUtils = getByKeys("isEmojiFilteredOrLocked", "filterUnsupportedEmojis");
export const ExpressionPickerEmoji = getModule((m) =>
    m?.type?.toString?.()?.includes?.("emojiSpriteImage")
);
