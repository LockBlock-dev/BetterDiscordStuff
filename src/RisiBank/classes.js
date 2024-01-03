const {
    Webpack: { getByKeys },
} = BdApi;

/**
 * Discord classes
 */
export default {
    global: getByKeys("profileBioInput", "buttons"),
    branding: getByKeys("lookBlank", "grow", "colorBrand"),
    manual: {
        expressionPickerChatInputButton: "expression-picker-chat-input-button",
    },
};
