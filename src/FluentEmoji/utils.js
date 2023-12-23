const { Patcher, ReactUtils } = BdApi;

import {
    PLUGIN_NAME,
    EMOJI_SRC_GITHUB_BASE,
    EMOJI_15_SRC_GITHUB_BASE,
    EMOJI_SRC_CDN_BASE,
} from "./constants";
import emojis from "./github_emojis.json" assert { type: "json" };

/**
 * Logs a message prefixed by the module name to the console.
 * @param {string} message - The message to display.
 * @returns {void}
 */
export const log = (message) => {
    console.log(`%c[${PLUGIN_NAME}]%c ${message}`, "color: #3a71c1; font-weight: 700;", "");
};

/**
 * Logs a warning message prefixed by the module name to the console.
 * @param {string} message - The warning message to display.
 * @returns {void}
 */
export const warn = (message) => {
    console.warn(`%c[${PLUGIN_NAME}]%c ${message}`, "color: #E8A400; font-weight: 700;", "");
};

/**
 * Logs an error message prefixed by the module name and optional error details to the console.
 * @param {string} message - The error message to display.
 * @param {Error} [error] - The optional error object to display additional details.
 * @returns {void}
 */
export const err = (message, error) => {
    console.log(`%c[${PLUGIN_NAME}]%c ${message}`, "color: red; font-weight: 700;", "");
    if (error) {
        console.groupCollapsed("%cError: " + error.message, "color: red;");
        console.error(error.stack);
        console.groupEnd();
    }
};

/**
 * Converts a CSS class name or an array of CSS class names to a CSS selector.
 * @param {string|string[]} className - The class name(s) to convert.
 * @returns {string} - The resulting CSS selector.
 */
export const toSelector = (className) => {
    return Array.isArray(className) ? `.${className.join(".")}` : `.${className}`;
};

/**
 * Waits for the specified selector to become available in the DOM.
 * @async
 * @param {string} selector - The CSS selector to wait for.
 * @returns {Promise<void>} - A promise that resolves when the selector is found.
 */
export const waitForSelector = async (selector) => {
    return new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList" && document.querySelector(selector)) {
                    observer.disconnect();
                    resolve();
                    return;
                }
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    });
};

/**
 * Re-renders a React component instance.
 * @param {string} moduleName - The name of the current module.
 * @param {string} selector - The CSS selector used to find the target element.
 * @returns {void}
 */
export const reRender = (moduleName, selector) => {
    const target = document.querySelector(selector);
    if (!target) return;
    const instance = ReactUtils.getOwnerInstance(target);
    const unpatch = Patcher.instead(moduleName, instance, "render", () => unpatch());
    instance.forceUpdate(() => instance.forceUpdate());
};

export const emojiSrcFromGlyph = (glyph) => {
    const unicode = [...glyph]
        .map((cp) => cp.codePointAt(0).toString(16).padStart(4, "0"))
        .join(" ");

    if (!unicode.length) return;

    let src = emojis[unicode]?.src;

    if (!src) return;

    if (emojis[unicode].branch === "williamch") src = `${EMOJI_15_SRC_GITHUB_BASE}/${src}`;
    else if (emojis[unicode].cdn) src = `${EMOJI_SRC_CDN_BASE}/${src}/default/100_f.png`;
    else src = `${EMOJI_SRC_GITHUB_BASE}/${src}`;

    return src;
};
