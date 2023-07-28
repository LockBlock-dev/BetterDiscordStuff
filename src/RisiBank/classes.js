const {
    Webpack: { getByKeys },
} = BdApi;

/**
 * Discord classes
 */
export default {
    global: getByKeys("profileBioInput", "buttons"),
    branding: getByKeys("lookBlank", "grow", "colorBrand"),
    expressionPicker: getByKeys("contentWrapper", "navItem", "positionLayer"),
    manual: {
        expressionPickerChatInputButton: "expression-picker-chat-input-button",
    },
};
