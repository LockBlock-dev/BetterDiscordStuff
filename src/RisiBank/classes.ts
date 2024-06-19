const {
    Webpack: { getByKeys },
} = BdApi;

/**
 * Discord classes
 */
export default {
    global: getByKeys("profileBioInput", "buttons"),
    branding: getByKeys("lookBlank", "grow", "colorBrand"),
    expressionPicker: {
        chatInputButton: "expression-picker-chat-input-button",
    },
};
