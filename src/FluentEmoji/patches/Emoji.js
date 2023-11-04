const { Patcher } = BdApi;

import { PLUGIN_NAME, EMOJI_SRC_BASE } from "../constants.js";
import { EmojiUtils } from "../discordModules/index.js";
import { emojiSrcFromGlyph } from "../utils";

const patch = async () => {
    Patcher.after(PLUGIN_NAME, EmojiUtils, "getURL", (_, args, ret) => {
        if (!args || !args.length) return;

        const newSrc = emojiSrcFromGlyph(args[0]);

        // unsupported emoji
        if (!newSrc) {
            // console.log(ret.props, unicode, emojis[unicode]);
            return;
        }

        return `${EMOJI_SRC_BASE}/${newSrc}`;
    });
};

export default {
    name: "Emoji",
    patch,
};
