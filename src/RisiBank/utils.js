const { Patcher, ReactUtils } = BdApi;

import { PLUGIN_NAME } from "./constants";
import { ChannelStore, Permissions, SelectedChannelStore, UserStore } from "./discordModules";

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
 * Returns the currently selected channel
 * @returns {object | undefined} The currently selected channel object from the ChannelStore.
 */
export const getCurrentChannel = () => {
    return ChannelStore.getChannel(SelectedChannelStore.getChannelId());
};

/**
 * Computer a permission for an user in a channel.
 * @param {bigint} permission - The permission flag to check.
 * @param {object} user - The user for whom the permission is checked. Defaults to the current user.
 * @param {object} channel - The channel in which the permission is checked. Defaults to the current channel.
 * @returns {boolean} Returns `true` if the user has the specified permission in the channel context, otherwise `false`.
 */
export const checkPermission = (
    permission,
    user = UserStore.getCurrentUser(),
    channel = getCurrentChannel()
) => {
    return Permissions.can({
        permission: permission,
        user: user,
        context: channel,
    });
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
