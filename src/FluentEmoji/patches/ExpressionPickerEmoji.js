const { Patcher, ReactUtils } = BdApi;

import Classes from "../classes";
import { PLUGIN_NAME } from "../constants";
import { reRender, toSelector, waitForSelector, emojiSrcFromGlyph } from "../utils";

const patch = async () => {
    const ExpressionPickerEmojiSelector = toSelector(Classes.emojiSpriteImage.emojiSpriteImage);

    await waitForSelector(ExpressionPickerEmojiSelector);

    const ExpressionPickerEmoji = ReactUtils.getInternalInstance(
        document.querySelector(ExpressionPickerEmojiSelector)
    )?.return?.elementType;

    Patcher.after(PLUGIN_NAME, ExpressionPickerEmoji, "type", (_, args, ret) => {
        if (!args || !args[0]) return;

        const glyph = args[0]?.emoji?.surrogates;

        if (!glyph) return;

        const newSrc = emojiSrcFromGlyph(glyph);

        // unsupported emoji
        if (!newSrc) return;

        if (!ret?.props?.style) return;

        ret.props.style = {
            backgroundImage: `url("${newSrc}")`,
            backgroundSize: "contain",
            height: "40px",
            width: "40px",
        };
    });

    reRender(PLUGIN_NAME, ExpressionPickerEmojiSelector);
};

export default {
    name: "ExpressionPickerEmoji",
    patch,
};
