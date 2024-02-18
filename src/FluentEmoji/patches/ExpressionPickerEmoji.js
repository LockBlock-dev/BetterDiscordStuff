const { Patcher } = BdApi;

import { PLUGIN_NAME } from "../constants";
import { ExpressionPickerEmoji } from "../discordModules";
import { emojiSrcFromGlyph } from "../utils";

const patch = async () => {
    Patcher.after(
        PLUGIN_NAME,
        ExpressionPickerEmoji,
        "type",
        (_, args, ret) => {
            if (!args || !args[0]) return;

            const glyph = args[0]?.emoji?.surrogates;

            if (!glyph) return;

            const newSrc = emojiSrcFromGlyph(glyph);

            // unsupported emoji
            if (!newSrc) return;

            if (!ret?.props?.children?.[0]?.props?.style) return;

            ret.props.children[0].props.style = {
                backgroundImage: `url("${newSrc}")`,
                backgroundSize: "contain",
                height: "40px",
                width: "40px",
            };
        }
    );
};

export default {
    name: "ExpressionPickerEmoji",
    patch,
};
