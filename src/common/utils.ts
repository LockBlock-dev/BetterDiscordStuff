const { Patcher, ReactUtils } = BdApi;

/**
 * Logs a message prefixed by the module name to the console.
 * @param {string} pluginName - The name of the current plugin.
 * @param {string} message - The message to display.
 * @returns {void}
 */
export const log = (pluginName: string, message: string) =>
    console.log(
        `%c[${pluginName}]%c ${message}`,
        "color: #3a71c1; font-weight: 700;",
        ""
    );

/**
 * Logs a warning message prefixed by the module name to the console.
 * @param {string} pluginName - The name of the current plugin.
 * @param {string} message - The warning message to display.
 * @returns {void}
 */
export const warn = (pluginName: string, message: string) =>
    console.warn(
        `%c[${pluginName}]%c ${message}`,
        "color: #E8A400; font-weight: 700;",
        ""
    );

/**
 * Logs an error message prefixed by the module name and optional error details to the console.
 * @param {string} pluginName - The name of the current plugin.
 * @param {string} message - The error message to display.
 * @param {Error} [error] - The optional error object to display additional details.
 * @returns {void}
 */
export const err = (pluginName: string, message: string, error?: Error) => {
    console.log(
        `%c[${pluginName}]%c ${message}`,
        "color: red; font-weight: 700;",
        ""
    );
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
export const toSelector = (className: string | string[]) => {
    return Array.isArray(className)
        ? `.${className.join(".")}`
        : `.${className}`;
};

/**
 * Re-renders a React component instance.
 * @param {string} pluginName - The name of the current plugin.
 * @param {string} selector - The CSS selector used to find the target element.
 * @returns {void}
 */
export const reRender = (pluginName: string, selector: string) => {
    const target: HTMLElement | null = document.querySelector(selector);
    if (!target) return;
    const instance = ReactUtils.getOwnerInstance(target);
    if (!instance) return;
    const unpatch = Patcher.instead(pluginName, instance, "render", () =>
        unpatch()
    );
    instance.forceUpdate(() => instance.forceUpdate());
};

/**
 * Waits for the specified selector to become available in the DOM.
 * @async
 * @param {string} selector - The CSS selector to wait for.
 * @returns {Promise<void>} - A promise that resolves when the selector is found.
 */
export const waitForSelector = async (selector: string) => {
    return new Promise<void>((resolve, reject) => {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (
                    mutation.type === "childList" &&
                    document.querySelector(selector)
                ) {
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
