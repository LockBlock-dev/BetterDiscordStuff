/**
 * @name RisiBank
 * @author LockBlock
 * @description Brings RisiBank to the Discord client.
 * @version 3.1.1
 * @donate https://ko-fi.com/lockblock
 * @source https://github.com/LockBlock-dev/BetterDiscordStuff/tree/master/src/RisiBank
 */

// src/RisiBank/index.js
var { Webpack, Patcher, React, ReactUtils, UI, Utils } = BdApi;
var { getModule, getByKeys, getStore } = Webpack;
var CONTAINER_ID = "risibank-container";
var Classes = {
    global: getByKeys("profileBioInput", "buttons"),
    branding: getByKeys("lookBlank", "grow", "colorBrand"),
    manual: {
        expressionPickerChatInputButton: "expression-picker-chat-input-button",
    },
};
var Dispatcher = getByKeys("dispatch", "subscribe");
var MessageActions = getByKeys("_sendMessage", "sendMessage");
var Permissions = getByKeys("can", "computePermissions");
var PermissionsConstants = getByKeys("ADD_REACTIONS", "EMBED_LINKS", {
    searchExports: true,
});
var ChannelStore = getStore("ChannelStore");
var PendingReplyStore = getStore("PendingReplyStore");
var SelectedChannelStore = getStore("SelectedChannelStore");
var UserStore = getStore("UserStore");
var ComponentDispatch;
var TextAreaButtonsMemo;
var RisiBankButton = class {
    /**
     * Constructs a new instance of the RisiBankButton class.
     * @constructor
     */
    constructor() {
        this.self = React.createElement(
            "div",
            {
                className: [
                    Classes.manual.expressionPickerChatInputButton,
                    Classes.global.buttonContainer,
                ].join(" "),
            },
            React.createElement(
                "button",
                {
                    type: "button",
                    "aria-label": "Open RisiBank sticker picker",
                    onClick: RisiBankContainer.hide,
                    className: [
                        Classes.global.button,
                        Classes.branding.button,
                        Classes.branding.lookBlank,
                        Classes.branding.colorBrand,
                        Classes.branding.grow,
                    ].join(" "),
                },
                React.createElement(
                    "svg",
                    {
                        width: "24",
                        height: "24",
                        className: Classes.global.stickerIcon,
                        viewBox: "0 0 20 20",
                    },
                    React.createElement("path", {
                        style: { fill: "#010101", stroke: "none" },
                        d: "M0 0L1 1L0 0z",
                    }),
                    React.createElement("path", {
                        style: { fill: "#fe83b3", stroke: "none" },
                        d: "M1.6034 1.02778C-0.564398 2.7447 0.00482528 6.58035 0 9C-0.00536454 11.6901 -0.769009 16.128 1.02778 18.3966C3.2502 21.2026 15.7091 21.1008 18.3966 18.9722C20.5644 17.2553 19.9952 13.4196 20 11C20.0054 8.30995 20.769 3.87202 18.9722 1.60339C16.7498 -1.20264 4.29094 -1.1008 1.6034 1.02778z",
                    }),
                    React.createElement("path", {
                        style: { fill: "#010101", stroke: "none" },
                        d: "M19 0L20 1L19 0z",
                    }),
                    React.createElement("path", {
                        style: { fill: "#b15b8c", stroke: "none" },
                        d: "M2 13L2 16L3 16L2 13z",
                    }),
                    React.createElement("path", {
                        style: { fill: "#251547", stroke: "none" },
                        d: "M3 16L13 16C12.0438 11.5379 3.95617 11.5379 3 16z",
                    }),
                    React.createElement("path", {
                        style: { fill: "#b15b8c", stroke: "none" },
                        d: "M13 13L13 16L14 16L13 13z",
                    }),
                    React.createElement("path", {
                        style: { fill: "#582f61", stroke: "none" },
                        d: "M4 15L5 16L4 15M11 15L12 16L11 15z",
                    }),
                    React.createElement("path", {
                        style: { fill: "#010101", stroke: "none" },
                        d: "M0 19L1 20L0 19M19 19L20 20L19 19z",
                    })
                )
            )
        );
    }
};
var RisiBankContainer = class {
    /**
     * Constructs a new instance of the RisiBankContainer class.
     * @constructor
     */
    constructor() {
        this.self = document.createElement("div");
        this.self.setAttribute("id", CONTAINER_ID);
        this.self.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50%;
            height: 50%;
            z-index: 9999;
            justify-content: center;
            align-items: center;
            display: none;
        `;
    }
    /**
     * Inserts the RisiBank container into the document body.
     * Any existing remnants of the container with the same id will be removed before insertion.
     * @returns {HTMLElement} - The RisiBank container element.
     */
    insert() {
        const remnants = document.querySelectorAll(`#${CONTAINER_ID}`);
        if (remnants.length > 0) remnants.forEach((node) => node.remove());
        document.body.appendChild(this.self);
        return this.self;
    }
    /**
     * Toggles the visibility of the RisiBank container by changing its display style.
     * If the container is currently hidden, it will be displayed as flex. Otherwise, it will be hidden.
     * @static
     * @returns {void}
     */
    static hide() {
        const container = document.querySelector(`#${CONTAINER_ID}`);
        if (container) {
            if (container.style.display === "none") {
                container.style.display = "flex";
            } else {
                container.style.display = "none";
            }
        }
    }
};
module.exports = class RisiBank {
    /**
     * Constructs a new instance of the RisiBank plugin class.
     * @param {object} meta - The meta information to initialize the instance.
     * @constructor
     */
    constructor(meta) {
        this.meta = meta;
        this.initialized = false;
        this.RBWrapper = new RisiBankWrapper();
    }
    /**
     * Logs a message prefixed by the module name to the console.
     * @static
     * @param {string} moduleName - he name of the current module.
     * @param {string} message - The message to display.
     * @returns {void}
     */
    static log(moduleName, message) {
        console.log(`%c[${moduleName}]%c ${message}`, "color: #3a71c1; font-weight: 700;", "");
    }
    /**
     * Logs a warning message prefixed by the module name to the console.
     * @static
     * @param {string} moduleName - The name of the current module.
     * @param {string} message - The warning message to display.
     * @returns {void}
     */
    static warn(moduleName, message) {
        console.warn(`%c[${moduleName}]%c ${message}`, "color: #E8A400; font-weight: 700;", "");
    }
    /**
     * Logs an error message prefixed by the module name and optional error details to the console.
     * @static
     * @param {string} moduleName - The name of the current module.
     * @param {string} message - The error message to display.
     * @param {Error} [error] - The optional error object to display additional details.
     * @returns {void}
     */
    static err(moduleName, message, error) {
        console.log(`%c[${moduleName}]%c ${message}`, "color: red; font-weight: 700;", "");
        if (error) {
            console.groupCollapsed("%cError: " + error.message, "color: red;");
            console.error(error.stack);
            console.groupEnd();
        }
    }
    /**
     * Converts a CSS class name or an array of CSS class names to a CSS selector.
     * @static
     * @param {string|string[]} className - The class name(s) to convert.
     * @returns {string} - The resulting CSS selector.
     */
    static toSelector(className) {
        return Array.isArray(className) ? `.${className.join(".")}` : `.${className}`;
    }
    /**
     * Waits for the specified selector to become available in the DOM.
     * @static
     * @async
     * @param {string} selector - The CSS selector to wait for.
     * @returns {Promise<void>} - A promise that resolves when the selector is found.
     */
    static async waitForSelector(selector) {
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
    }
    /**
     * Re-renders a React component instance.
     * @static
     * @param {string} moduleName - The name of the current module.
     * @param {string} selector - The CSS selector used to find the target element.
     * @returns {void}
     */
    static reRender(moduleName, selector) {
        const target = document.querySelector(selector);
        if (!target) return;
        const instance = ReactUtils.getOwnerInstance(target);
        const unpatch = Patcher.instead(moduleName, instance, "render", () => unpatch());
        instance.forceUpdate(() => instance.forceUpdate());
    }
    /**
     * Returns the currently selected channel
     * @returns {object | undefined} The currently selected channel object from the ChannelStore.
     */
    getCurrentChannel() {
        ChannelStore.getChannel(SelectedChannelStore.getChannelId());
    }
    /**
     * Computer a permission for an user in a channel.
     * @param {bigint} permission - The permission flag to check.
     * @param {object} user - The user for whom the permission is checked. Defaults to the current user.
     * @param {object} channel - The channel in which the permission is checked. Defaults to the current channel.
     * @returns {boolean} Returns `true` if the user has the specified permission in the channel context, otherwise `false`.
     */
    checkPermission(
        permission,
        user = UserStore.getCurrentUser(),
        channel = this.getCurrentChannel()
    ) {
        return Permissions.can({
            permission,
            user,
            context: channel,
        });
    }
    /**
     * Initializes the plugin.
     * @async
     * @returns {Promise<void>}
     */
    async init() {
        this.RBButton = new RisiBankButton();
        this.RBContainer = new RisiBankContainer();
        this.RBContainer.insert();
        await RisiBank.waitForSelector(RisiBank.toSelector(Classes.global.buttons));
        ComponentDispatch = getModule(
            (m) => m.dispatchToLastSubscribed && m.emitter?.listeners("TEXTAREA_FOCUS").length,
            { searchExports: true }
        );
        TextAreaButtonsMemo = ReactUtils.getInternalInstance(
            document.querySelector(RisiBank.toSelector(Classes.global.buttons))
        )?.return?.elementType;
        Patcher.after(this.meta.name, TextAreaButtonsMemo, "type", (_, [props], ret) => {
            if (props?.disabled) return;
            if (!props?.type?.attachments) return;
            if (
                props?.channel?.type === 1 ||
                props?.channel?.type === 3 ||
                this.checkPermission(PermissionsConstants.EMBED_LINKS)
            )
                ret.props.children.splice(-1, 0, this.RBButton.self);
        });
        RisiBank.reRender(this.meta.name, RisiBank.toSelector(Classes.global.buttons));
    }
    /**
     * Starts the plugin.
     * @returns {void}
     */
    start() {
        this.initialized = false;
        RisiBank.log(this.meta.name, `version ${this.meta.version} has started.`);
        try {
            this.RBWrapper.init();
            this.init();
            this.initialized = true;
        } catch (e) {
            RisiBank.err(this.meta.name, "Failed to initialize!", e);
            UI.showToast(`Failed to initialize ${this.meta.name}!`, {
                type: "error",
            });
        }
        if (this.initialized) {
            window.RisiBank.activate({
                type: "iframe",
                container: `#${CONTAINER_ID}`,
                theme: "dark",
                mediaSize: "sm",
                defaultTab: "hot",
                showNSFW: false,
                allowUsernameSelection: false,
                onSelectMedia: ({ id, type, media }) => {
                    RisiBankContainer.hide();
                    let mediaUrl = media.cache_url;
                    if (mediaUrl.includes("full")) mediaUrl = mediaUrl.replace("full", "thumb");
                    const currentChannelId = SelectedChannelStore.getChannelId();
                    const pendingReply = PendingReplyStore.getPendingReply(currentChannelId);
                    const { allowedMentions, messageReference } =
                        MessageActions.getSendMessageOptionsForReply(pendingReply);
                    if (pendingReply)
                        Dispatcher.dispatch({
                            type: "DELETE_PENDING_REPLY",
                            channelId: currentChannelId,
                        });
                    MessageActions.sendMessage(
                        currentChannelId,
                        {
                            content: mediaUrl,
                            invalidEmojis: [],
                            tts: false,
                            validNonShortcutEmojis: [],
                        },
                        true,
                        // whether to wait for the channel to be ready
                        {
                            messageReference,
                            allowedMentions,
                        }
                    );
                    ComponentDispatch.dispatch("TEXTAREA_FOCUS", null);
                },
            });
        }
    }
    /**
     * Stops the plugin by undoing any changes made during initialization.
     * @returns {void}
     */
    stop() {
        Patcher.unpatchAll(this.meta.name);
        this.RBWrapper.unload();
        this.RBContainer.self.remove();
        delete this.RBButton;
        delete this.RBContainer;
        RisiBank.log(this.meta.name, `version ${this.meta.version} has stopped.`);
    }
};
var RisiBankWrapper = class {
    /**
     * Initializes the RisiBank integration.
     * @returns {void}
     */
    init() {
        "use strict";
        class e {
            static getPreferredModalOpenPosition() {
                const t2 = { width: 600, height: 300 },
                    i2 = 25;
                if (!document.activeElement)
                    return e.adjustPositionForWindowBounds(
                        {
                            x: window.innerWidth / 2 - t2.width / 2,
                            y: window.innerHeight / 2 - t2.height / 2,
                        },
                        t2,
                        i2
                    );
                const a2 = document.activeElement.getBoundingClientRect();
                return a2.bottom + i2 + t2.height > window.innerHeight
                    ? e.adjustPositionForWindowBounds(
                          { x: a2.left, y: a2.top - t2.height - i2 },
                          t2,
                          i2
                      )
                    : e.adjustPositionForWindowBounds({ x: a2.left, y: a2.bottom + i2 }, t2, i2);
            }
            static adjustPositionForWindowBounds({ x: e2, y: t2 }, { width: i2, height: a2 }, n2) {
                const o2 = window.innerWidth,
                    s = window.innerHeight;
                return (
                    e2 + i2 + n2 > o2 && (e2 = o2 - i2 - n2),
                    e2 < n2 && (e2 = n2),
                    t2 + a2 + n2 > s && (t2 = s - a2 - n2),
                    t2 < n2 && (t2 = n2),
                    { x: e2, y: t2 }
                );
            }
        }
        const t = {
                defaultTab: "top",
                showNSFW: false,
                allowUsernameSelection: true,
                showCopyButton: false,
                onCopyMedia: void 0,
                onSelectMedia: void 0,
            },
            i = {
                Light: { theme: "light" },
                Dark: { theme: "dark" },
                LightClassic: { theme: "light-old" },
                DarkClassic: { theme: "dark-old" },
            },
            a = (e2) =>
                Object.entries(i).reduce(
                    (i2, [a2, n2]) => ((i2[a2] = { ...t, ...n2, ...e2 }), i2),
                    {}
                );
        class n {
            static get Frame() {
                return a({
                    container: void 0,
                    type: "iframe",
                    mediaSize: "md",
                    navbarSize: "md",
                });
            }
            static get Modal() {
                return a({
                    openPosition: e.getPreferredModalOpenPosition(),
                    type: "modal",
                    mediaSize: "md",
                    navbarSize: "lg",
                });
            }
            static get Overlay() {
                return a({ type: "overlay", mediaSize: "lg", navbarSize: "lg" });
            }
        }
        class o {
            static addImageLink(e2, t2) {
                return ({ id: i2, data: a2, media: n2 }) => {
                    let o2;
                    o2 = "string" == typeof e2 ? document.querySelector(e2) : e2;
                    const s = "source" === t2 ? n2.source_url : n2.cache_url,
                        r = o2.selectionStart,
                        d = `${o2.value[r - 1] && !o2.value[r - 1].match(/\s/) ? " " : ""}${s}${
                            void 0 !== o2.value[r] && o2.value[r].match(/\s/) ? "" : " "
                        }`;
                    (o2.value =
                        o2.value.substring(0, o2.selectionStart) +
                        d +
                        o2.value.substring(o2.selectionStart)),
                        o2.dispatchEvent(new Event("change")),
                        o2.dispatchEvent(new Event("input")),
                        o2.focus();
                };
            }
            static addSourceImageLink(e2) {
                return o.addImageLink(e2, "source");
            }
            static addRisiBankImageLink(e2) {
                return o.addImageLink(e2, "risibank");
            }
            static pasteImage() {
                return async ({ id: e2, data: t2, media: i2 }) => {
                    const a2 = await fetch(i2.cache_url),
                        n2 = await a2.blob();
                    await navigator.clipboard.write([new ClipboardItem({ [n2.type]: n2 })]),
                        document.execCommand("paste");
                };
            }
        }
        "undefined" != typeof window &&
            (window.RisiBank = new (class {
                static Defaults = n;
                static UI = e;
                static Actions = o;
                constructor() {
                    if (
                        ((this._location = "https://risibank.fr"),
                        (this._integrations = {}),
                        (this._overlayContainer = null),
                        (this._modalContainer = null),
                        (this._currentIntegrationId = 2),
                        (this._selectedUsername = null),
                        "undefined" != typeof localStorage)
                    ) {
                        const e2 = localStorage.getItem("risibank-userscript-selected-username");
                        "string" == typeof e2 &&
                            e2.match(/^[a-zA-Z0-9\]\[_-]+$/i) &&
                            (this._selectedUsername = e2);
                    }
                    (this.Defaults = n),
                        (this.UI = e),
                        (this.Actions = o),
                        (this.addImageToTextArea = o.addImageLink),
                        (this.addSourceImageToTextArea = o.addSourceImageLink),
                        (this.addRisiBankImageToTextArea = o.addRisiBankImageLink),
                        addEventListener("message", this._onIFrameMessage.bind(this), false);
                }
                activate(e2) {
                    if (
                        ((e2.type = e2.type || "iframe"),
                        !["iframe", "overlay", "modal"].includes(e2.type))
                    )
                        throw new Error("Invalid type");
                    if (
                        ((e2.theme = e2.theme || "light"),
                        !["light", "dark", "light-old", "dark-old"].includes(e2.theme))
                    )
                        throw new Error("Unsupported theme");
                    if (
                        ((e2.mediaSize = e2.mediaSize || "md"),
                        !["sm", "md", "lg"].includes(e2.mediaSize))
                    )
                        throw new Error("Unsupported media size. Allowed sizes are sm, md and lg");
                    if (
                        ((e2.navbarSize = e2.navbarSize || "md"),
                        !["sm", "md", "lg"].includes(e2.navbarSize))
                    )
                        throw new Error("Unsupported navbar size. Allowed sizes are sm, md and lg");
                    if (
                        ((e2.defaultTab = e2.defaultTab || "top"),
                        !["search", "fav", "hot", "top", "new", "rand"].includes(e2.defaultTab))
                    )
                        throw new Error(
                            "Unsupported default tab. Allowed values are search, fav, hot, top, new and rand"
                        );
                    if (
                        ((e2.showNSFW = "boolean" != typeof e2.showNSFW || e2.showNSFW),
                        (e2.allowUsernameSelection =
                            "boolean" != typeof e2.allowUsernameSelection ||
                            e2.allowUsernameSelection),
                        (e2.showCopyButton =
                            "boolean" == typeof e2.showCopyButton && e2.showCopyButton),
                        "function" != typeof e2.onSelectMedia)
                    )
                        throw new Error(
                            "A callback must be specified for when a media is selected"
                        );
                    if ("iframe" === e2.type) {
                        if ((++this._currentIntegrationId, void 0 === e2.container))
                            throw new Error("A container must be specified when type is iframe");
                        const t2 =
                            "string" == typeof e2.container
                                ? document.querySelector(e2.container)
                                : e2.container;
                        if (!t2) throw new Error("Invalid container specified");
                        this._populateContainerWithIFrame(e2, t2, this._currentIntegrationId),
                            (this._integrations[this._currentIntegrationId] = e2);
                    }
                    if ("overlay" === e2.type) {
                        if (!this._overlayContainer) {
                            const e3 = document.createElement("div");
                            (e3.id = "risibank-overlay"),
                                (e3.style.position = "fixed"),
                                (e3.style.top = "0"),
                                (e3.style.left = "0"),
                                (e3.style.width = "100%"),
                                (e3.style.height = "100%"),
                                (e3.style.zIndex = "2000000001"),
                                (e3.style.opacity = 0.9),
                                (e3.style.backgroundColor = "rgba(0,0,0,0.5)"),
                                document.body.appendChild(e3),
                                (this._overlayContainer = e3);
                        }
                        (this._overlayContainer.style.display = "block"),
                            this._populateContainerWithIFrame(e2, this._overlayContainer, 0),
                            (this._integrations[0] = e2);
                    }
                    if ("modal" === e2.type) {
                        if (void 0 === e2.openPosition)
                            throw new Error("A position must be specified when type is modal");
                        if (!this._modalContainer) {
                            const e3 = document.createElement("div");
                            (e3.id = "risibank-modal"),
                                (e3.style.position = "fixed"),
                                (e3.style.width = "600px"),
                                (e3.style.height = "300px"),
                                (e3.style.zIndex = "2000000000"),
                                (e3.style.opacity = 1),
                                document.body.appendChild(e3),
                                (this._modalContainer = e3);
                        }
                        (this._modalContainer.style.display = "block"),
                            (this._modalContainer.style.pointerEvents = "all"),
                            (this._modalContainer.style.left = e2.openPosition.x + "px"),
                            (this._modalContainer.style.top = e2.openPosition.y + "px"),
                            this._populateContainerWithIFrame(e2, this._modalContainer, 1),
                            (this._integrations[1] = e2);
                    }
                }
                _getEmbedUrl(e2, t2) {
                    let i2 = `${this._location}/embed?id=${t2}`;
                    return (
                        (i2 += `&theme=${e2.theme}`),
                        (i2 += `&allowUsernameSelection=${e2.allowUsernameSelection}`),
                        (i2 += `&showCopyButton=${e2.showCopyButton}`),
                        (i2 += `&mediaSize=${e2.mediaSize}`),
                        (i2 += `&navbarSize=${e2.navbarSize}`),
                        (i2 += `&defaultTab=${e2.defaultTab}`),
                        (i2 += `&showNSFW=${e2.showNSFW}`),
                        ["overlay", "modal"].includes(e2.type) && (i2 += "&showCloseButton=true"),
                        e2.allowUsernameSelection &&
                            "string" == typeof this.selectedUsername &&
                            (i2 += `&username=${this.selectedUsername}`),
                        i2
                    );
                }
                _hashOptions(e2) {
                    return JSON.stringify([
                        e2.theme,
                        e2.allowUsernameSelection,
                        e2.showCopyButton,
                        e2.mediaSize,
                        e2.navbarSize,
                        e2.defaultTab,
                        e2.type,
                    ]);
                }
                _populateContainerWithIFrame(e2, t2, i2) {
                    const a2 = this._hashOptions(e2),
                        n2 = t2.querySelector("iframe");
                    if (n2 && n2.getAttribute("data-hash") === a2)
                        return void (t2.style.display = "block");
                    const o2 = document.createElement("iframe");
                    (o2.src = this._getEmbedUrl(e2, i2)),
                        (o2.border = "no"),
                        (o2.style.width = "100%"),
                        (o2.style.height = "100%"),
                        (o2.style.border = "none"),
                        (o2.style.overflow = "hidden"),
                        o2.setAttribute("data-hash", a2),
                        (t2.innerHTML = ""),
                        t2.appendChild(o2);
                }
                _onIFrameMessage(e2) {
                    if (!e2.data || !e2.data.type || !e2.data.type.match(/^risibank/)) return;
                    if (e2.origin !== this._location)
                        return void console.log("ignoring event due to origin mismatch", e2);
                    const t2 = e2.data.id,
                        i2 = e2.data.type;
                    if ("risibank-closed" !== i2)
                        if ("risibank-username-selected" !== i2)
                            if ("risibank-username-cleared" !== i2) {
                                if ("risibank-media-copy" !== i2)
                                    return "risibank-media-selected" === i2
                                        ? (this._integrations[t2] &&
                                              this._integrations[t2].onSelectMedia &&
                                              this._integrations[t2].onSelectMedia({
                                                  id: t2,
                                                  type: i2,
                                                  media: e2.data.media,
                                              }),
                                          void (
                                              this._integrations[t2] &&
                                              ["overlay", "modal"].includes(
                                                  this._integrations[t2].type
                                              ) &&
                                              this.desactivate(t2)
                                          ))
                                        : void 0;
                                this._integrations[t2] &&
                                    this._integrations[t2].onCopyMedia &&
                                    this._integrations[t2].onCopyMedia({
                                        id: t2,
                                        type: i2,
                                        media: e2.data.media,
                                    });
                            } else this.selectedUsername = null;
                        else {
                            const t3 = e2.data.username;
                            this.selectedUsername = t3;
                        }
                    else this.desactivate(t2);
                }
                desactivate(e2) {
                    if (void 0 === e2) for (const e3 in this._integrations) this.desactivate(e3);
                    const t2 = this._integrations[e2];
                    t2 &&
                        ("iframe" === t2.type && this._desactivateIFrame(t2, e2),
                        "overlay" === t2.type && this._desactivateOverlay(t2),
                        "modal" === t2.type && this._desactivateModal(t2));
                }
                _desactivateIFrame(e2, t2) {
                    const i2 = document.querySelector(e2.container);
                    i2 && ((i2.innerHTML = ""), delete this._integrations[t2]);
                }
                _desactivateOverlay(e2) {
                    const t2 = document.querySelector("#risibank-overlay");
                    t2 && (t2.style.display = "none");
                }
                _desactivateModal(e2) {
                    const t2 = document.querySelector("#risibank-modal");
                    t2 && ((t2.style.display = "none"), (t2.style.pointerEvents = "none"));
                }
                get selectedUsername() {
                    return this._selectedUsername;
                }
                set selectedUsername(e2) {
                    if (null === e2 || "string" != typeof e2)
                        return (
                            (this._selectedUsername = null),
                            void (
                                "undefined" != typeof localStorage &&
                                localStorage.removeItem("risibank-userscript-selected-username")
                            )
                        );
                    (this._selectedUsername = e2),
                        "undefined" != typeof localStorage &&
                            localStorage.setItem("risibank-userscript-selected-username", e2);
                }
            })());
    }
    /**
     * Unloads the RisiBank integration by removing it from the global window object.
     * @returns {void}
     */
    unload() {
        if ("undefined" !== typeof window && window.RisiBank) {
            window.RisiBank.desactivate();
            delete window.RisiBank;
        }
    }
};
