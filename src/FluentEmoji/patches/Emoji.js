const { Patcher } = BdApi;

import { PLUGIN_NAME } from "../constants.js";
import { EmojiUtils } from "../discordModules";
import { emojiSrcFromGlyph } from "../utils";

const patch = async () => {
    Patcher.after(PLUGIN_NAME, EmojiUtils, "getURL", (_, args, ret) => {
        if (!args || !args.length) return;

        const newSrc = emojiSrcFromGlyph(args[0]);

        // unsupported emoji
        if (!newSrc) return ret;

        return newSrc;
    });
};

export default {
    name: "Emoji",
    patch,
};
