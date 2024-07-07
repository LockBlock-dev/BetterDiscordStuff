import {
    EMOJI_SRC_GITHUB_BASE,
    EMOJI_15_SRC_GITHUB_BASE,
    EMOJI_SRC_CDN_BASE,
} from "./constants";
import emojis from "./github_emojis.json" assert { type: "json" };

export const emojiSrcFromGlyph = (glyph) => {
    const unicode = [...glyph]
        .map((cp) => cp.codePointAt(0).toString(16).padStart(4, "0"))
        .join(" ");

    if (!unicode.length) return;

    let src = emojis[unicode]?.src;

    if (!src) return;

    if (emojis[unicode].branch === "willchavez")
        src = `${EMOJI_15_SRC_GITHUB_BASE}/${src}`;
    else if (emojis[unicode].cdn)
        src = `${EMOJI_SRC_CDN_BASE}/${src}/default/100_f.png`;
    else src = `${EMOJI_SRC_GITHUB_BASE}/${src}`;

    return src;
};

export * from "../common/utils";
