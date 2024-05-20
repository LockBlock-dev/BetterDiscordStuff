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
        chatInputButton: getByKeys("CHAT_INPUT_BUTTON_CLASSNAME")
            .CHAT_INPUT_BUTTON_CLASSNAME,
    },
};
