/**
 * @name RisiBank
 * @author LockBlock
 * @description Brings RisiBank to the Discord client.
 * @version 4.1.0
 * @donate https://ko-fi.com/lockblock
 * @source https://github.com/LockBlock-dev/BetterDiscordStuff/tree/master/risibank
 */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/RisiBank/index.js
var RisiBank_exports = {};
__export(RisiBank_exports, {
  default: () => RisiBank
});
module.exports = __toCommonJS(RisiBank_exports);

// src/RisiBank/constants.js
var PLUGIN_NAME = "RisiBank";
var BASE_API_URI = "https://risibank.fr";
var TEXTAREA_BUTTON_ARIA_LABEL = `Open ${PLUGIN_NAME} sticker picker`;
var EXPRESSION_PICKER_VIEW = "risibank";

// src/RisiBank/discordModules/index.js
var {
  Webpack: { getByKeys, getStore }
} = BdApi;
var InputConstants = getByKeys("FORUM_CHANNEL_GUIDELINES", "CREATE_FORUM_POST", {
  searchExports: true
});
var PermissionsConstants = getByKeys("ADD_REACTIONS", "EMBED_LINKS", {
  searchExports: true
});
var Dispatcher = getByKeys("dispatch", "subscribe");
var MessageActions = getByKeys("_sendMessage", "sendMessage");
var Permissions = getByKeys("can", "canEveryone", "computePermissions");
var ExpressionPicker = getByKeys("toggleExpressionPicker");
var ChannelStore = getStore("ChannelStore");
var PendingReplyStore = getStore("PendingReplyStore");
var SelectedChannelStore = getStore("SelectedChannelStore");
var UserStore = getStore("UserStore");

// src/RisiBank/utils.js
var { Patcher, ReactUtils } = BdApi;
var log = (message) => {
  console.log(`%c[${PLUGIN_NAME}]%c ${message}`, "color: #3a71c1; font-weight: 700;", "");
};
var err = (message, error) => {
  console.log(`%c[${PLUGIN_NAME}]%c ${message}`, "color: red; font-weight: 700;", "");
  if (error) {
    console.groupCollapsed("%cError: " + error.message, "color: red;");
    console.error(error.stack);
    console.groupEnd();
  }
};
var getCurrentChannel = () => {
  return ChannelStore.getChannel(SelectedChannelStore.getChannelId());
};
var checkPermission = (permission, user = UserStore.getCurrentUser(), channel = getCurrentChannel()) => {
  return Permissions.can({
    permission,
    user,
    context: channel
  });
};
var toSelector = (className) => {
  return Array.isArray(className) ? `.${className.join(".")}` : `.${className}`;
};
var waitForSelector = async (selector) => {
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
      subtree: true
    });
  });
};
var reRender = (moduleName, selector) => {
  const target = document.querySelector(selector);
  if (!target)
    return;
  const instance = ReactUtils.getOwnerInstance(target);
  const unpatch = Patcher.instead(moduleName, instance, "render", () => unpatch());
  instance.forceUpdate(() => instance.forceUpdate());
};

// src/RisiBank/classes.js
var {
  Webpack: { getByKeys: getByKeys2 }
} = BdApi;
var classes_default = {
  global: getByKeys2("profileBioInput", "buttons"),
  branding: getByKeys2("lookBlank", "grow", "colorBrand"),
  expressionPicker: getByKeys2("contentWrapper", "navItem", "positionLayer"),
  manual: {
    expressionPickerChatInputButton: "expression-picker-chat-input-button"
  }
};

// src/RisiBank/components/NavbarLabel.js
var { React } = BdApi;
var NavbarLabel_default = NavbarLabel = (elementType) => {
  const type = EXPRESSION_PICKER_VIEW;
  const selected = type === ExpressionPicker.useExpressionPickerStore.getState().activeView;
  return React.createElement(
    elementType,
    {
      id: `${type}-picker-tab`,
      "aria-controls": `${type}-picker-tab-panel`,
      "aria-selected": selected,
      viewType: type,
      isActive: selected
    },
    PLUGIN_NAME
  );
};

// src/RisiBank/components/Picker.js
var { React: React2, Webpack } = BdApi;
var ComponentDispatch = Webpack.getModule(
  (m) => m.dispatchToLastSubscribed && m.emitter?.listeners("TEXTAREA_FOCUS").length,
  { searchExports: true }
);
var Picker = class extends React2.Component {
  /**
   * Constructs a new instance of the Picker class.
   * @param {object} props - React props
   * @constructor
   */
  constructor(props) {
    super(props);
    this.iframeUrl = this.getIFrameUrl();
    this.onSelectSticker = this.onSelectSticker.bind(this);
  }
  /**
   * Renders the component.
   * @returns {React.Element} The React element representing the view.
   */
  render() {
    return React2.createElement(
      "div",
      {
        id: `${EXPRESSION_PICKER_VIEW}-picker-tab-panel`,
        role: "tabpanel",
        "aria-labelledby": `${EXPRESSION_PICKER_VIEW}-picker-tab`
      },
      React2.createElement("iframe", {
        src: this.iframeUrl,
        border: "no",
        style: {
          width: "100%",
          height: "100%",
          border: "none",
          overflow: "hidden"
        }
      })
    );
  }
  /**
   * Lifecycle method that is called after the component is mounted in the DOM.
   * @returns {void}
   */
  componentDidMount() {
    addEventListener("message", this.onSelectSticker);
  }
  /**
   * Lifecycle method that is called before the component is unmounted from the DOM.
   * @returns {void}
   */
  componentWillUnmount() {
    removeEventListener("message", this.onSelectSticker);
  }
  /**
   * Gets the iframe URL.
   * @returns {string} The iframe URL as a string.
   */
  getIFrameUrl() {
    return `${BASE_API_URI}/embed?${new URLSearchParams({
      theme: "dark",
      allowUsernameSelection: false,
      showCopyButton: false,
      mediaSize: "sm",
      navbarSize: "md",
      defaultTab: "hot",
      showNSFW: "false"
    }).toString()}`;
  }
  /**
   * Handles the "message" event and processes the selected sticker.
   * @param {MessageEvent} e - The "message" event object.
   * @returns {void}
   */
  onSelectSticker(e) {
    if (e.origin !== BASE_API_URI)
      return;
    const {
      data: { type, media }
    } = e;
    if (type !== "risibank-media-selected" || !media)
      return;
    ExpressionPicker.closeExpressionPicker();
    let mediaUrl = media.cache_url;
    if (mediaUrl.includes("full"))
      mediaUrl = mediaUrl.replace("full", "thumb");
    const currentChannelId = SelectedChannelStore.getChannelId();
    const pendingReply = PendingReplyStore.getPendingReply(currentChannelId);
    const { allowedMentions, messageReference } = MessageActions.getSendMessageOptionsForReply(pendingReply);
    if (pendingReply)
      Dispatcher.dispatch({
        type: "DELETE_PENDING_REPLY",
        channelId: currentChannelId
      });
    MessageActions.sendMessage(
      currentChannelId,
      {
        content: mediaUrl,
        invalidEmojis: [],
        tts: false,
        validNonShortcutEmojis: []
      },
      true,
      // whether to wait for the channel to be ready
      {
        messageReference,
        allowedMentions
      }
    );
    ComponentDispatch.dispatch("TEXTAREA_FOCUS", null);
  }
};

// src/RisiBank/patches/ExpressionPicker.js
var { Patcher: Patcher2, React: React3, ReactUtils: ReactUtils2, Utils } = BdApi;
var patch = async () => {
  const ExpressionPickerSelector = toSelector(classes_default.expressionPicker.contentWrapper);
  await waitForSelector(ExpressionPickerSelector);
  const ExpressionPickerInstance = ReactUtils2.getOwnerInstance(
    document.querySelector(ExpressionPickerSelector)
  );
  Patcher2.after(
    PLUGIN_NAME,
    ExpressionPickerInstance.constructor.prototype,
    "render",
    (_, __, ret) => {
      const originalChildren = ret.props?.children;
      if (originalChildren == null)
        return;
      ret.props.children = (...args) => {
        const newChildren = originalChildren(...args);
        const body = Utils.findInTree(
          newChildren,
          (e) => e?.some?.((c) => c?.type === "nav"),
          {
            walkable: ["props", "children"]
          }
        );
        if (!body)
          return newChildren;
        const navItems = Utils.findInTree(body[0], (e) => e?.role === "tablist", {
          walkable: ["props", "children"]
        })?.children;
        if (!navItems)
          return newChildren;
        if (navItems.some((item) => item?.props?.viewType === EXPRESSION_PICKER_VIEW))
          return newChildren;
        try {
          const elementType = navItems[0].type.type;
          const RBNavLabel = NavbarLabel_default(elementType);
          const idx = navItems.findIndex((item) => item?.props?.viewType === "emoji");
          navItems.splice(idx, 0, RBNavLabel);
          const activePicker = ExpressionPicker.useExpressionPickerStore.getState().activeView;
          if (activePicker === EXPRESSION_PICKER_VIEW) {
            body.push(React3.createElement(Picker, {}));
          }
        } catch (e) {
          err("Failed to patch ExpressionPicker!", e);
        }
        return newChildren;
      };
    }
  );
  ExpressionPickerInstance.forceUpdate();
};
var ExpressionPicker_default = {
  name: "ExpressionPicker",
  patch
};

// src/RisiBank/components/Button.js
var { React: React4 } = BdApi;
var Button_default = Button = () => {
  return React4.createElement(
    "div",
    {
      className: [
        classes_default.manual.expressionPickerChatInputButton,
        classes_default.global.buttonContainer
      ].join(" ")
    },
    React4.createElement(
      "button",
      {
        type: "button",
        "aria-label": TEXTAREA_BUTTON_ARIA_LABEL,
        onClick: () => {
          ExpressionPicker.toggleExpressionPicker(
            EXPRESSION_PICKER_VIEW,
            InputConstants.NORMAL
          );
        },
        className: [
          classes_default.global.button,
          classes_default.branding.button,
          classes_default.branding.lookBlank,
          classes_default.branding.colorBrand,
          classes_default.branding.grow
        ].join(" ")
      },
      React4.createElement(
        "svg",
        {
          width: "24",
          height: "24",
          className: classes_default.global.stickerIcon,
          viewBox: "0 0 20 20"
        },
        React4.createElement("path", {
          style: { fill: "#010101", stroke: "none" },
          d: "M0 0L1 1L0 0z"
        }),
        React4.createElement("path", {
          style: { fill: "#fe83b3", stroke: "none" },
          d: "M1.6034 1.02778C-0.564398 2.7447 0.00482528 6.58035 0 9C-0.00536454 11.6901 -0.769009 16.128 1.02778 18.3966C3.2502 21.2026 15.7091 21.1008 18.3966 18.9722C20.5644 17.2553 19.9952 13.4196 20 11C20.0054 8.30995 20.769 3.87202 18.9722 1.60339C16.7498 -1.20264 4.29094 -1.1008 1.6034 1.02778z"
        }),
        React4.createElement("path", {
          style: { fill: "#010101", stroke: "none" },
          d: "M19 0L20 1L19 0z"
        }),
        React4.createElement("path", {
          style: { fill: "#b15b8c", stroke: "none" },
          d: "M2 13L2 16L3 16L2 13z"
        }),
        React4.createElement("path", {
          style: { fill: "#251547", stroke: "none" },
          d: "M3 16L13 16C12.0438 11.5379 3.95617 11.5379 3 16z"
        }),
        React4.createElement("path", {
          style: { fill: "#b15b8c", stroke: "none" },
          d: "M13 13L13 16L14 16L13 13z"
        }),
        React4.createElement("path", {
          style: { fill: "#582f61", stroke: "none" },
          d: "M4 15L5 16L4 15M11 15L12 16L11 15z"
        }),
        React4.createElement("path", {
          style: { fill: "#010101", stroke: "none" },
          d: "M0 19L1 20L0 19M19 19L20 20L19 19z"
        })
      )
    )
  );
};

// src/RisiBank/patches/TextAreaButtonsMemo.js
var { Patcher: Patcher3, ReactUtils: ReactUtils3 } = BdApi;
var patch2 = async () => {
  const TextAreaButtonsSelector = toSelector(classes_default.global.buttons);
  await waitForSelector(TextAreaButtonsSelector);
  const TextAreaButtonsMemo = ReactUtils3.getInternalInstance(
    document.querySelector(TextAreaButtonsSelector)
  )?.return?.elementType;
  Patcher3.after(PLUGIN_NAME, TextAreaButtonsMemo, "type", (_, [props], ret) => {
    if (props?.disabled)
      return;
    if (!props?.type?.attachments)
      return;
    if (props?.channel?.type === 1 || props?.channel?.type === 3 || checkPermission(PermissionsConstants.EMBED_LINKS))
      ret.props.children.splice(-1, 0, Button_default());
  });
  reRender(PLUGIN_NAME, TextAreaButtonsSelector);
};
var TextAreaButtonsMemo_default = {
  name: "TextAreaButtonsMemo",
  patch: patch2
};

// src/RisiBank/patches/index.js
var patches_default = [ExpressionPicker_default, TextAreaButtonsMemo_default];

// src/RisiBank/index.js
var { Patcher: Patcher4, UI } = BdApi;
var RisiBank = class {
  /**
   * Constructs a new instance of the RisiBank plugin class.
   * @param {object} meta - The meta information to initialize the instance.
   * @constructor
   */
  constructor(meta) {
    this.meta = meta;
  }
  /**
   * Initializes the plugin.
   * @async
   * @returns {Promise<void>}
   */
  async init() {
    patches_default.forEach((patchModule) => {
      try {
        patchModule.patch();
      } catch (e) {
        err(`Failed to run patch ${patchModule.name}!`, e);
      }
    });
  }
  /**
   * Starts the plugin.
   * @returns {void}
   */
  start() {
    log(`version ${this.meta.version} has started.`);
    try {
      this.init();
    } catch (e) {
      err("Failed to initialize!", e);
      UI.showToast(`Failed to initialize ${this.meta.name}!`, {
        type: "error"
      });
    }
  }
  /**
   * Stops the plugin by undoing any changes made during initialization.
   * @returns {void}
   */
  stop() {
    Patcher4.unpatchAll(this.meta.name);
    log(`version ${this.meta.version} has stopped.`);
  }
};
