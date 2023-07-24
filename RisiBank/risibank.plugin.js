/**
 * @name RisiBank
 * @author LockBlock
 * @description Brings RisiBank to the Discord client.
 * @version 3.0.0
 * @donate https://ko-fi.com/lockblock
 * @source https://github.com/LockBlock-dev/BetterDiscordStuff/tree/master/risibank
 */

const { Webpack, Patcher, React, ReactUtils, UI, Utils } = BdApi;
const { getModule, getByKeys, getStore } = Webpack;

const CONTAINER_ID = "risibank-container";

const Classes = {
    global: getByKeys("profileBioInput", "buttons"),
    branding: getByKeys("lookBlank", "grow", "colorBrand"),
    manual: {
        expressionPickerChatInputButton: "expression-picker-chat-input-button",
    },
};

const Dispatcher = getByKeys("dispatch", "subscribe");
const MessageActions = getByKeys("_sendMessage", "sendMessage");

const PendingReplyStore = getStore("PendingReplyStore");
const SelectedChannelStore = getStore("SelectedChannelStore");

let ComponentDispatch, TextAreaButtonsMemo;

/**
 * Represents a RisiBank plugin button.
 * @class
 */
class RisiBankButton {
    /**
     * Constructs a new instance of the RisiBankButton class.
     * @constructor
     */
    constructor() {
        /**
         * The React element representing the RisiBank button.
         * @type {React.Element}
         */
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
}

/**
 * Represents a RisiBank plugin container.
 * @class
 */
class RisiBankContainer {
    /**
     * Constructs a new instance of the RisiBankContainer class.
     * @constructor
     */
    constructor() {
        /**
         * The DOM element representing the RisiBank container.
         * @type {HTMLElement}
         */
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
}

/**
 * Represents the RisiBank plugin.
 * @class
 */
module.exports = class RisiBank {
    /**
     * Constructs a new instance of the RisiBank plugin class.
     * @param {object} meta - The meta information to initialize the instance.
     * @constructor
     */
    constructor(meta) {
        /**
         * The meta information associated with the instance.
         * @type {object}
         */
        this.meta = meta;

        /**
         * Indicates whether the instance has been initialized.
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * The RisiBankWrapper instance associated with the instance.
         * @type {RisiBankWrapper}
         */
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
     * Initializes the plugin.
     * @async
     * @returns {Promise<void>}
     */
    async init() {
        this.RBButton = new RisiBankButton();
        this.RBContainer = new RisiBankContainer();

        this.RBContainer.insert();

        // prevents an error on start if the user is not in a channel
        await RisiBank.waitForSelector(RisiBank.toSelector(Classes.global.buttons));

        ComponentDispatch = getModule(
            (m) => m.dispatchToLastSubscribed && m.emitter?.listeners("TEXTAREA_FOCUS").length,
            { searchExports: true }
        );

        TextAreaButtonsMemo = ReactUtils.getInternalInstance(
            document.querySelector(RisiBank.toSelector(Classes.global.buttons))
        )?.return?.elementType;

        Patcher.after(this.meta.name, TextAreaButtonsMemo, "type", (_, [props], ret) => {
            // const emojiButton = ret.props.children[ret.props.children.length - 1];

            // prevents the button to be added in profile settings
            if (props?.type?.attachments) {
                // inserts the RisiBank button just between sticker and emoji button
                ret.props.children.splice(-1, 0, this.RBButton.self);
            }
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
                        true, // whether to wait for the channel to be ready
                        {
                            messageReference: messageReference,
                            allowedMentions: allowedMentions,
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

/**
 * Wrapper class for the RisiBank integration.
 * Provides methods to initialize and unload the integration.
 * @class
 * @see {@link https://risibank.fr/doc-api} for more information.
 */
class RisiBankWrapper {
    /**
     * Initializes the RisiBank integration.
     * @returns {void}
     */
    init() {
        "use strict";
        class e {
            static getPreferredModalOpenPosition() {
                const t = { width: 600, height: 300 },
                    i = 25;
                if (!document.activeElement)
                    return e.adjustPositionForWindowBounds(
                        {
                            x: window.innerWidth / 2 - t.width / 2,
                            y: window.innerHeight / 2 - t.height / 2,
                        },
                        t,
                        i
                    );
                const a = document.activeElement.getBoundingClientRect();
                return a.bottom + i + t.height > window.innerHeight
                    ? e.adjustPositionForWindowBounds({ x: a.left, y: a.top - t.height - i }, t, i)
                    : e.adjustPositionForWindowBounds({ x: a.left, y: a.bottom + i }, t, i);
            }
            static adjustPositionForWindowBounds({ x: e, y: t }, { width: i, height: a }, n) {
                const o = window.innerWidth,
                    s = window.innerHeight;
                return (
                    e + i + n > o && (e = o - i - n),
                    e < n && (e = n),
                    t + a + n > s && (t = s - a - n),
                    t < n && (t = n),
                    { x: e, y: t }
                );
            }
        }
        const t = {
                defaultTab: "top",
                showNSFW: !1,
                allowUsernameSelection: !0,
                showCopyButton: !1,
                onCopyMedia: void 0,
                onSelectMedia: void 0,
            },
            i = {
                Light: { theme: "light" },
                Dark: { theme: "dark" },
                LightClassic: { theme: "light-old" },
                DarkClassic: { theme: "dark-old" },
            },
            a = (e) =>
                Object.entries(i).reduce((i, [a, n]) => ((i[a] = { ...t, ...n, ...e }), i), {});
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
            static addImageLink(e, t) {
                return ({ id: i, data: a, media: n }) => {
                    let o;
                    o = "string" == typeof e ? document.querySelector(e) : e;
                    const s = "source" === t ? n.source_url : n.cache_url,
                        r = o.selectionStart,
                        d = `${o.value[r - 1] && !o.value[r - 1].match(/\s/) ? " " : ""}${s}${
                            void 0 !== o.value[r] && o.value[r].match(/\s/) ? "" : " "
                        }`;
                    (o.value =
                        o.value.substring(0, o.selectionStart) +
                        d +
                        o.value.substring(o.selectionStart)),
                        o.dispatchEvent(new Event("change")),
                        o.dispatchEvent(new Event("input")),
                        o.focus();
                };
            }
            static addSourceImageLink(e) {
                return o.addImageLink(e, "source");
            }
            static addRisiBankImageLink(e) {
                return o.addImageLink(e, "risibank");
            }
            static pasteImage() {
                return async ({ id: e, data: t, media: i }) => {
                    const a = await fetch(i.cache_url),
                        n = await a.blob();
                    await navigator.clipboard.write([new ClipboardItem({ [n.type]: n })]),
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
                        const e = localStorage.getItem("risibank-userscript-selected-username");
                        "string" == typeof e &&
                            e.match(/^[a-zA-Z0-9\]\[_-]+$/i) &&
                            (this._selectedUsername = e);
                    }
                    (this.Defaults = n),
                        (this.UI = e),
                        (this.Actions = o),
                        (this.addImageToTextArea = o.addImageLink),
                        (this.addSourceImageToTextArea = o.addSourceImageLink),
                        (this.addRisiBankImageToTextArea = o.addRisiBankImageLink),
                        addEventListener("message", this._onIFrameMessage.bind(this), !1);
                }
                activate(e) {
                    if (
                        ((e.type = e.type || "iframe"),
                        !["iframe", "overlay", "modal"].includes(e.type))
                    )
                        throw new Error("Invalid type");
                    if (
                        ((e.theme = e.theme || "light"),
                        !["light", "dark", "light-old", "dark-old"].includes(e.theme))
                    )
                        throw new Error("Unsupported theme");
                    if (
                        ((e.mediaSize = e.mediaSize || "md"),
                        !["sm", "md", "lg"].includes(e.mediaSize))
                    )
                        throw new Error("Unsupported media size. Allowed sizes are sm, md and lg");
                    if (
                        ((e.navbarSize = e.navbarSize || "md"),
                        !["sm", "md", "lg"].includes(e.navbarSize))
                    )
                        throw new Error("Unsupported navbar size. Allowed sizes are sm, md and lg");
                    if (
                        ((e.defaultTab = e.defaultTab || "top"),
                        !["search", "fav", "hot", "top", "new", "rand"].includes(e.defaultTab))
                    )
                        throw new Error(
                            "Unsupported default tab. Allowed values are search, fav, hot, top, new and rand"
                        );
                    if (
                        ((e.showNSFW = "boolean" != typeof e.showNSFW || e.showNSFW),
                        (e.allowUsernameSelection =
                            "boolean" != typeof e.allowUsernameSelection ||
                            e.allowUsernameSelection),
                        (e.showCopyButton =
                            "boolean" == typeof e.showCopyButton && e.showCopyButton),
                        "function" != typeof e.onSelectMedia)
                    )
                        throw new Error(
                            "A callback must be specified for when a media is selected"
                        );
                    if ("iframe" === e.type) {
                        if ((++this._currentIntegrationId, void 0 === e.container))
                            throw new Error("A container must be specified when type is iframe");
                        const t =
                            "string" == typeof e.container
                                ? document.querySelector(e.container)
                                : e.container;
                        if (!t) throw new Error("Invalid container specified");
                        this._populateContainerWithIFrame(e, t, this._currentIntegrationId),
                            (this._integrations[this._currentIntegrationId] = e);
                    }
                    if ("overlay" === e.type) {
                        if (!this._overlayContainer) {
                            const e = document.createElement("div");
                            (e.id = "risibank-overlay"),
                                (e.style.position = "fixed"),
                                (e.style.top = "0"),
                                (e.style.left = "0"),
                                (e.style.width = "100%"),
                                (e.style.height = "100%"),
                                (e.style.zIndex = "2000000001"),
                                (e.style.opacity = 0.9),
                                (e.style.backgroundColor = "rgba(0,0,0,0.5)"),
                                document.body.appendChild(e),
                                (this._overlayContainer = e);
                        }
                        (this._overlayContainer.style.display = "block"),
                            this._populateContainerWithIFrame(e, this._overlayContainer, 0),
                            (this._integrations[0] = e);
                    }
                    if ("modal" === e.type) {
                        if (void 0 === e.openPosition)
                            throw new Error("A position must be specified when type is modal");
                        if (!this._modalContainer) {
                            const e = document.createElement("div");
                            (e.id = "risibank-modal"),
                                (e.style.position = "fixed"),
                                (e.style.width = "600px"),
                                (e.style.height = "300px"),
                                (e.style.zIndex = "2000000000"),
                                (e.style.opacity = 1),
                                document.body.appendChild(e),
                                (this._modalContainer = e);
                        }
                        (this._modalContainer.style.display = "block"),
                            (this._modalContainer.style.pointerEvents = "all"),
                            (this._modalContainer.style.left = e.openPosition.x + "px"),
                            (this._modalContainer.style.top = e.openPosition.y + "px"),
                            this._populateContainerWithIFrame(e, this._modalContainer, 1),
                            (this._integrations[1] = e);
                    }
                }
                _getEmbedUrl(e, t) {
                    let i = `${this._location}/embed?id=${t}`;
                    return (
                        (i += `&theme=${e.theme}`),
                        (i += `&allowUsernameSelection=${e.allowUsernameSelection}`),
                        (i += `&showCopyButton=${e.showCopyButton}`),
                        (i += `&mediaSize=${e.mediaSize}`),
                        (i += `&navbarSize=${e.navbarSize}`),
                        (i += `&defaultTab=${e.defaultTab}`),
                        (i += `&showNSFW=${e.showNSFW}`),
                        ["overlay", "modal"].includes(e.type) && (i += "&showCloseButton=true"),
                        e.allowUsernameSelection &&
                            "string" == typeof this.selectedUsername &&
                            (i += `&username=${this.selectedUsername}`),
                        i
                    );
                }
                _hashOptions(e) {
                    return JSON.stringify([
                        e.theme,
                        e.allowUsernameSelection,
                        e.showCopyButton,
                        e.mediaSize,
                        e.navbarSize,
                        e.defaultTab,
                        e.type,
                    ]);
                }
                _populateContainerWithIFrame(e, t, i) {
                    const a = this._hashOptions(e),
                        n = t.querySelector("iframe");
                    if (n && n.getAttribute("data-hash") === a)
                        return void (t.style.display = "block");
                    const o = document.createElement("iframe");
                    (o.src = this._getEmbedUrl(e, i)),
                        (o.border = "no"),
                        (o.style.width = "100%"),
                        (o.style.height = "100%"),
                        (o.style.border = "none"),
                        (o.style.overflow = "hidden"),
                        o.setAttribute("data-hash", a),
                        (t.innerHTML = ""),
                        t.appendChild(o);
                }
                _onIFrameMessage(e) {
                    if (!e.data || !e.data.type || !e.data.type.match(/^risibank/)) return;
                    if (e.origin !== this._location)
                        return void console.log("ignoring event due to origin mismatch", e);
                    const t = e.data.id,
                        i = e.data.type;
                    if ("risibank-closed" !== i)
                        if ("risibank-username-selected" !== i)
                            if ("risibank-username-cleared" !== i) {
                                if ("risibank-media-copy" !== i)
                                    return "risibank-media-selected" === i
                                        ? (this._integrations[t] &&
                                              this._integrations[t].onSelectMedia &&
                                              this._integrations[t].onSelectMedia({
                                                  id: t,
                                                  type: i,
                                                  media: e.data.media,
                                              }),
                                          void (
                                              this._integrations[t] &&
                                              ["overlay", "modal"].includes(
                                                  this._integrations[t].type
                                              ) &&
                                              this.desactivate(t)
                                          ))
                                        : void 0;
                                this._integrations[t] &&
                                    this._integrations[t].onCopyMedia &&
                                    this._integrations[t].onCopyMedia({
                                        id: t,
                                        type: i,
                                        media: e.data.media,
                                    });
                            } else this.selectedUsername = null;
                        else {
                            const t = e.data.username;
                            this.selectedUsername = t;
                        }
                    else this.desactivate(t);
                }
                desactivate(e) {
                    if (void 0 === e) for (const e in this._integrations) this.desactivate(e);
                    const t = this._integrations[e];
                    t &&
                        ("iframe" === t.type && this._desactivateIFrame(t, e),
                        "overlay" === t.type && this._desactivateOverlay(t),
                        "modal" === t.type && this._desactivateModal(t));
                }
                _desactivateIFrame(e, t) {
                    const i = document.querySelector(e.container);
                    i && ((i.innerHTML = ""), delete this._integrations[t]);
                }
                _desactivateOverlay(e) {
                    const t = document.querySelector("#risibank-overlay");
                    t && (t.style.display = "none");
                }
                _desactivateModal(e) {
                    const t = document.querySelector("#risibank-modal");
                    t && ((t.style.display = "none"), (t.style.pointerEvents = "none"));
                }
                get selectedUsername() {
                    return this._selectedUsername;
                }
                set selectedUsername(e) {
                    if (null === e || "string" != typeof e)
                        return (
                            (this._selectedUsername = null),
                            void (
                                "undefined" != typeof localStorage &&
                                localStorage.removeItem("risibank-userscript-selected-username")
                            )
                        );
                    (this._selectedUsername = e),
                        "undefined" != typeof localStorage &&
                            localStorage.setItem("risibank-userscript-selected-username", e);
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
}
