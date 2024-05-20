/**
 * @name RisiBank
 * @author LockBlock
 * @description Brings RisiBank to the Discord client.
 * @version 4.1.5
 * @donate https://ko-fi.com/lockblock
 * @source https://github.com/LockBlock-dev/BetterDiscordStuff/tree/master/src/RisiBank
 */
"use strict";
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

// src/RisiBank/index.ts
var RisiBank_exports = {};
__export(RisiBank_exports, {
  default: () => RisiBank
});
module.exports = __toCommonJS(RisiBank_exports);

// src/RisiBank/constants.ts
var PLUGIN_NAME = "RisiBank";
var BASE_API_URI = "https://risibank.fr";
var TEXTAREA_BUTTON_ARIA_LABEL = `Open ${PLUGIN_NAME} sticker picker`;
var EXPRESSION_PICKER_VIEW = "risibank";

// src/RisiBank/discordModules.ts
var {
  Webpack: { getByKeys, getModule, getStore }
} = BdApi;
var InputConstants = getByKeys(
  "FORUM_CHANNEL_GUIDELINES",
  "CREATE_FORUM_POST",
  {
    searchExports: true
  }
);
var PermissionsConstants = getByKeys("ADD_REACTIONS", "EMBED_LINKS", {
  searchExports: true
});
var Dispatcher = getByKeys("dispatch", "subscribe");
var MessageActions = getByKeys("_sendMessage", "sendMessage");
var Permissions = getByKeys(
  "can",
  "canEveryone",
  "computePermissions"
);
var ExpressionPicker = getByKeys("toggleExpressionPicker");
var { ReferencePositionLayer } = getByKeys(
  "ReferencePositionLayer",
  "referencePortalAwareContains"
);
var ChannelTextAreaButtons = getModule(
  (m) => m.type?.toString?.().includes(".default.isSubmitButtonEnabled", ".default.getActiveCommand")
);
var ComponentDispatch = getModule(
  (m) => m.dispatchToLastSubscribed && m.emitter?.listeners("TEXTAREA_FOCUS").length,
  { searchExports: true }
);
var ChannelStore = getStore("ChannelStore");
var PendingReplyStore = getStore("PendingReplyStore");
var SelectedChannelStore = getStore("SelectedChannelStore");
var UserStore = getStore("UserStore");

// src/common/utils.ts
var { Patcher, ReactUtils } = BdApi;
var log = (pluginName, message) => console.log(
  `%c[${pluginName}]%c ${message}`,
  "color: #3a71c1; font-weight: 700;",
  ""
);
var err = (pluginName, message, error) => {
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
var toSelector = (className) => {
  return Array.isArray(className) ? `.${className.join(".")}` : `.${className}`;
};
var reRender = (pluginName, selector) => {
  const target = document.querySelector(selector);
  if (!target)
    return;
  const instance = ReactUtils.getOwnerInstance(target);
  if (!instance)
    return;
  const unpatch = Patcher.instead(
    pluginName,
    instance,
    "render",
    () => unpatch()
  );
  instance.forceUpdate(() => instance.forceUpdate());
};

// src/RisiBank/utils.ts
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

// src/RisiBank/components/NavbarLabel.tsx
var { useMemo } = BdApi.React;
function NavbarLabel(OriginalComponent) {
  const expressionPickerState = ExpressionPicker.useExpressionPickerStore.getState();
  const selected = useMemo(
    () => EXPRESSION_PICKER_VIEW === expressionPickerState.activeView,
    [EXPRESSION_PICKER_VIEW, expressionPickerState]
  );
  return /* @__PURE__ */ BdApi.React.createElement(
    OriginalComponent,
    {
      id: `${EXPRESSION_PICKER_VIEW}-picker-tab`,
      "aria-controls": `${EXPRESSION_PICKER_VIEW}-picker-tab-panel`,
      "aria-selected": selected,
      viewType: EXPRESSION_PICKER_VIEW,
      isActive: selected
    },
    PLUGIN_NAME
  );
}

// src/RisiBank/components/Picker.tsx
var { useEffect, useMemo: useMemo2, useCallback } = BdApi.React;
function Picker() {
  const iframeURL = useMemo2(
    () => `${BASE_API_URI}/embed?${new URLSearchParams({
      theme: "dark",
      allowUsernameSelection: "false",
      showCopyButton: "false",
      mediaSize: "sm",
      navbarSize: "md",
      defaultTab: "hot",
      showNSFW: "false"
    }).toString()}`,
    [BASE_API_URI]
  );
  const onSelectSticker = useCallback(
    (e) => {
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
    },
    [
      BASE_API_URI,
      ExpressionPicker,
      SelectedChannelStore,
      PendingReplyStore,
      MessageActions,
      Dispatcher,
      ComponentDispatch
    ]
  );
  useEffect(() => {
    addEventListener("message", onSelectSticker);
    return () => {
      removeEventListener("message", onSelectSticker);
    };
  }, []);
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      id: `${EXPRESSION_PICKER_VIEW}-picker-tab-panel`,
      role: "tabpanel",
      "aria-labelledby": `${EXPRESSION_PICKER_VIEW}-picker-tab`
    },
    /* @__PURE__ */ BdApi.React.createElement(
      "iframe",
      {
        src: iframeURL,
        style: {
          width: "100%",
          height: "100%",
          border: "none",
          overflow: "hidden"
        }
      }
    )
  );
}

// src/RisiBank/patches/ExpressionPicker.tsx
var { Patcher: Patcher2, Utils } = BdApi;
var patch = () => {
  Patcher2.after(
    PLUGIN_NAME,
    ReferencePositionLayer.prototype,
    "render",
    (_1, _2, ret) => {
      const originalChildren = ret?.props?.children;
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
        const navItems = Utils.findInTree(
          body[0],
          (e) => e?.role === "tablist",
          {
            walkable: ["props", "children"]
          }
        )?.children;
        if (!navItems)
          return newChildren;
        if (navItems.some(
          (item) => item?.props?.viewType === EXPRESSION_PICKER_VIEW
        ))
          return newChildren;
        try {
          const elementType = navItems[0].type.type;
          const RBNavLabel = NavbarLabel(elementType);
          const idx = navItems.findIndex(
            (item) => item?.props?.viewType === "emoji"
          );
          navItems.splice(idx, 0, RBNavLabel);
          const activePicker = ExpressionPicker.useExpressionPickerStore.getState().activeView;
          if (activePicker === EXPRESSION_PICKER_VIEW) {
            body.push(/* @__PURE__ */ BdApi.React.createElement(Picker, null));
          }
        } catch (e) {
          err("Failed to patch ExpressionPicker!", e);
        }
        return newChildren;
      };
    }
  );
};
var ExpressionPicker_default = {
  name: "ExpressionPicker",
  patch
};

// src/RisiBank/classes.ts
var {
  Webpack: { getByKeys: getByKeys2 }
} = BdApi;
var classes_default = {
  global: getByKeys2("profileBioInput", "buttons"),
  branding: getByKeys2("lookBlank", "grow", "colorBrand"),
  expressionPicker: {
    chatInputButton: getByKeys2("CHAT_INPUT_BUTTON_CLASSNAME").CHAT_INPUT_BUTTON_CLASSNAME
  }
};

// src/RisiBank/components/Button.tsx
function Button() {
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      className: [
        classes_default.expressionPicker.chatInputButton,
        classes_default.global.buttonContainer
      ].join(" ")
    },
    /* @__PURE__ */ BdApi.React.createElement(
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
      /* @__PURE__ */ BdApi.React.createElement(
        "svg",
        {
          width: "24",
          height: "24",
          className: classes_default.global.stickerIcon,
          viewBox: "0 0 20 20"
        },
        /* @__PURE__ */ BdApi.React.createElement(
          "path",
          {
            d: "M0 0L1 1L0 0z",
            style: { fill: "rgb(1, 1, 1)", stroke: "none" }
          }
        ),
        /* @__PURE__ */ BdApi.React.createElement(
          "path",
          {
            d: "M1.6034 1.02778C-0.564398 2.7447 0.00482528 6.58035 0 9C-0.00536454 11.6901 -0.769009 16.128 1.02778 18.3966C3.2502 21.2026 15.7091 21.1008 18.3966 18.9722C20.5644 17.2553 19.9952 13.4196 20 11C20.0054 8.30995 20.769 3.87202 18.9722 1.60339C16.7498 -1.20264 4.29094 -1.1008 1.6034 1.02778z",
            style: { fill: "rgb(254, 131, 179)", stroke: "none" }
          }
        ),
        /* @__PURE__ */ BdApi.React.createElement(
          "path",
          {
            d: "M19 0L20 1L19 0z",
            style: { fill: "rgb(1, 1, 1)", stroke: "none" }
          }
        ),
        /* @__PURE__ */ BdApi.React.createElement(
          "path",
          {
            d: "M2 13L2 16L3 16L2 13z",
            style: { fill: "rgb(177, 91, 140)", stroke: "none" }
          }
        ),
        /* @__PURE__ */ BdApi.React.createElement(
          "path",
          {
            d: "M3 16L13 16C12.0438 11.5379 3.95617 11.5379 3 16z",
            style: { fill: "rgb(37, 21, 71)", stroke: "none" }
          }
        ),
        /* @__PURE__ */ BdApi.React.createElement(
          "path",
          {
            d: "M13 13L13 16L14 16L13 13z",
            style: { fill: "rgb(177, 91, 140)", stroke: "none" }
          }
        ),
        /* @__PURE__ */ BdApi.React.createElement(
          "path",
          {
            d: "M4 15L5 16L4 15M11 15L12 16L11 15z",
            style: { fill: "rgb(88, 47, 97)", stroke: "none" }
          }
        ),
        /* @__PURE__ */ BdApi.React.createElement(
          "path",
          {
            d: "M0 19L1 20L0 19M19 19L20 20L19 19z",
            style: { fill: "rgb(1, 1, 1)", stroke: "none" }
          }
        )
      )
    )
  );
}

// src/RisiBank/patches/TextAreaButtonsMemo.ts
var { Patcher: Patcher3 } = BdApi;
var patch2 = () => {
  const TextAreaButtonsSelector = toSelector(classes_default.global.buttons);
  Patcher3.after(
    PLUGIN_NAME,
    ChannelTextAreaButtons,
    "type",
    (_, [props], ret) => {
      const { disabled, type, channel } = props;
      if (disabled)
        return;
      if (!type?.attachments)
        return;
      if (channel?.type === 1 || channel?.type === 3 || checkPermission(PermissionsConstants.EMBED_LINKS))
        ret.props.children.splice(-1, 0, Button());
    }
  );
  reRender(PLUGIN_NAME, TextAreaButtonsSelector);
};
var TextAreaButtonsMemo_default = {
  name: "TextAreaButtonsMemo",
  patch: patch2
};

// src/RisiBank/patches/index.ts
var patches_default = [ExpressionPicker_default, TextAreaButtonsMemo_default];

// src/RisiBank/index.ts
var { Patcher: Patcher4, UI } = BdApi;
var RisiBank = class {
  meta;
  /**
   * Constructs a new instance of the RisiBank plugin class.
   * @param {Meta} meta - The meta information to initialize the instance.
   * @constructor
   */
  constructor(meta) {
    this.meta = meta;
  }
  /**
   * Initializes the plugin.
   * @returns {void}
   */
  init() {
    patches_default.forEach((patchModule) => {
      try {
        patchModule.patch();
      } catch (e) {
        err(PLUGIN_NAME, `Failed to run patch ${patchModule.name}!`, e);
      }
    });
  }
  /**
   * Starts the plugin.
   * @returns {void}
   */
  start() {
    log(PLUGIN_NAME, `version ${this.meta.version} has started.`);
    try {
      this.init();
    } catch (e) {
      err(PLUGIN_NAME, "Failed to initialize!", e);
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
    log(PLUGIN_NAME, `version ${this.meta.version} has stopped.`);
  }
};
