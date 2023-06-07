/**
 * @name RisiBank
 * @author LockBlock
 * @version 1.0.0
 * @description Brings RisiBank to the Discord client.
 */

const { Webpack, Patcher } = BdApi;
const { getModule, Filters } = Webpack;

const BUTTON_ID = "risibank-btn";
const CONTAINER_ID = "risibank-container";

const Classes = {
    global: getModule(Filters.byProps("profileBioInput", "buttons")),
    branding: getModule(Filters.byProps("lookBlank", "grow", "colorBrand")),
    manual: {
        expressionPickerChatInputButton: "expression-picker-chat-input-button",
    },
};

const SelectedChannelStore = getModule(Filters.byProps("getChannelId", "getLastSelectedChannelId"));
const MessagesManager = getModule(Filters.byProps("sendMessage"));
const ComponentDispatch = getModule(
    (m) =>
        m.dispatchToLastSubscribed &&
        m.emitter?.listeners("CLEAR_TEXT").length &&
        m.emitter?.listeners("INSERT_TEXT").length,
    { searchExports: true }
);

class RisiBankButton {
    constructor() {
        const container = document.createElement("div");
        const button = document.createElement("button");

        container.setAttribute("id", BUTTON_ID);
        container.appendChild(button);
        container.classList.add(
            Classes.manual.expressionPickerChatInputButton,
            Classes.global.buttonContainer
        );

        button.setAttribute("type", "button");
        button.setAttribute("aria-label", "Open RisiBank sticker picker");
        button.classList.add(
            Classes.global.button,
            Classes.branding.button,
            Classes.branding.lookBlank,
            Classes.branding.colorBrand,
            Classes.branding.grow
        );

        // RisiBank logo
        button.innerHTML = `
        <svg width="24" height="24" class="${Classes.global.stickerIcon}" viewBox="0 0 20 20">
            <path style="fill:#010101; stroke:none;" d="M0 0L1 1L0 0z"/>
            <path style="fill:#fe83b3; stroke:none;" d="M1.6034 1.02778C-0.564398 2.7447 0.00482528 6.58035 0 9C-0.00536454 11.6901 -0.769009 16.128 1.02778 18.3966C3.2502 21.2026 15.7091 21.1008 18.3966 18.9722C20.5644 17.2553 19.9952 13.4196 20 11C20.0054 8.30995 20.769 3.87202 18.9722 1.60339C16.7498 -1.20264 4.29094 -1.1008 1.6034 1.02778z"/>
            <path style="fill:#010101; stroke:none;" d="M19 0L20 1L19 0z"/>
            <path style="fill:#b15b8c; stroke:none;" d="M2 13L2 16L3 16L2 13z"/>
            <path style="fill:#251547; stroke:none;" d="M3 16L13 16C12.0438 11.5379 3.95617 11.5379 3 16z"/>
            <path style="fill:#b15b8c; stroke:none;" d="M13 13L13 16L14 16L13 13z"/>
            <path style="fill:#582f61; stroke:none;" d="M4 15L5 16L4 15M11 15L12 16L11 15z"/>
            <path style="fill:#010101; stroke:none;" d="M0 19L1 20L0 19M19 19L20 20L19 19z"/>
        </svg>
        `;

        this.self = container;
    }

    insert(buttons) {
        const remnants = document.querySelectorAll(`#${BUTTON_ID}`);
        if (remnants.length === 0) buttons.insertBefore(this.self, buttons.lastChild);

        return this.self;
    }
}

class RisiBankContainer {
    constructor() {
        this.hidden = true;

        const container = document.createElement("div");

        container.setAttribute("id", CONTAINER_ID);

        container.style.cssText = `
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

        this.self = container;
    }

    insert() {
        const remnants = document.querySelectorAll(`#${CONTAINER_ID}`);
        if (remnants.length > 0) remnants.forEach((node) => node.remove());

        document.body.appendChild(this.self);

        return this.self;
    }

    hide(hide = !this.hidden) {
        if (hide) this.self.style.display = "none";
        else this.self.style.display = "flex";

        this.hidden = hide;

        return this.self;
    }
}

module.exports = class RisiBank {
    constructor(meta) {
        this.meta = meta;
        this.initialized = false;
        this.essentials = {};

        this.RBWrapper = new RisiBankWrapper();
    }

    static log(moduleName, message) {
        console.log(`%c[${moduleName}]%c ${message}`, "color: #3a71c1; font-weight: 700;", "");
    }

    static warn(moduleName, message) {
        console.warn(`%c[${moduleName}]%c ${message}`, "color: #E8A400; font-weight: 700;", "");
    }

    static err(moduleName, message, error) {
        console.log(`%c[${moduleName}]%c ${message}`, "color: red; font-weight: 700;", "");
        if (error) {
            console.groupCollapsed("%cError: " + error.message, "color: red;");
            console.error(error.stack);
            console.groupEnd();
        }
    }

    static waitForSelector(selector, callback) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList" && document.querySelector(selector)) {
                    observer.disconnect();
                    callback();
                    return;
                }
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    addButton() {
        const buttons = document.querySelector(`.${Classes.global.buttons}`);

        // Prevent the button from being removed
        BdApi.DOM.onRemoved(this.RBButton.insert(buttons), () => {
            this.addButton();
        });

        return this.RBButton.self;
    }

    init() {
        this.RBButton = new RisiBankButton();
        this.RBContainer = new RisiBankContainer();

        this.RBContainer.insert();

        RisiBank.waitForSelector(`.${Classes.global.buttons}`, () => {
            this.addButton().addEventListener("click", () => {
                this.RBContainer.hide();
            });
        });
    }

    start() {
        this.initialized = false;

        RisiBank.log(this.meta.name, `version ${this.meta.version} has started.`);

        try {
            this.RBWrapper.init();
            this.init();

            this.initialized = true;
        } catch (e) {
            RisiBank.err(this.meta.name, "Failed to initialize!", e);
            BdApi.showToast(`Failed to initialize ${this.meta.name}!`, {
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
                allowUsernameSelection: false,

                onSelectMedia: ({ id, type, media }) => {
                    this.RBContainer.hide(true);

                    let mediaUrl = media.cache_url;

                    if (mediaUrl.includes("full")) mediaUrl = mediaUrl.replace("full", "thumb");

                    const currentChannelId = SelectedChannelStore.getChannelId();
                    MessagesManager.sendMessage(currentChannelId, {
                        content: mediaUrl,
                        validNonShortcutEmojis: [],
                    });

                    ComponentDispatch.dispatch("TEXTAREA_FOCUS", null);
                },
            });
        }
    }

    stop() {
        this.RBWrapper.unload();
        this.RBButton.self.removeEventListener("click");
        this.RBContainer.self.remove();
        this.RBButton.self.remove();
        delete this.RBButton;
        delete this.RBContainer;
        Patcher.unpatchAll(this.meta.name);
    }
};

/**
 * RisiBank integration setup
 * @see https://risibank.fr/doc-api
 */
class RisiBankWrapper {
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

    unload() {
        if ("undefined" !== typeof window && window.RisiBank) delete window.RisiBank;
    }
}
