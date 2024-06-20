/**
 * @name RisiBank
 * @author LockBlock
 * @description Brings RisiBank to the Discord client.
 * @version 4.2.0
 * @donate https://ko-fi.com/lockblock
 * @source https://github.com/LockBlock-dev/BetterDiscordStuff/tree/master/src/RisiBank
 */
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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
var UPDATE_URL = "https://raw.githubusercontent.com/LockBlock-dev/BetterDiscordStuff/master/dist/RisiBank/RisiBank.plugin.js";

// src/RisiBank/discordModules/index.ts
var {
  Webpack: { getByKeys, getModule, getStore }
} = BdApi;
var PermissionsConstants = getByKeys("ADD_REACTIONS", "EMBED_LINKS", {
  searchExports: true
});
var ChannelTypes = getByKeys("DM", "GROUP_DM", "GUILD_CATEGORY", {
  searchExports: true
});
var Dispatcher = getByKeys("dispatch", "subscribe");
var MessageActions = getByKeys("_sendMessage", "sendMessage");
var Permissions = getByKeys("computePermissions");
var { ReferencePositionLayer } = getByKeys(
  "ReferencePositionLayer",
  "referencePortalAwareContains"
);
var ChannelTextAreaButtons = getModule(
  (m) => m.type?.toString?.().includes(".isSubmitButtonEnabled", ".getActiveCommand")
);
var ComponentDispatch = getModule(
  (m) => m.dispatchToLastSubscribed && m.emitter?.listeners("TEXTAREA_FOCUS").length,
  { searchExports: true }
);
var ChannelStore = getStore("ChannelStore");
var PendingReplyStore = getStore("PendingReplyStore");
var SelectedChannelStore = getStore("SelectedChannelStore");

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
var checkPermission = (permission, channel = getCurrentChannel(), user = void 0) => {
  return Permissions.can(permission, channel, user);
};

// src/RisiBank/discordModules/ExpressionPickerStore.ts
var {
  Webpack: { getModule: getModule2 }
} = BdApi;
var ExpressionPickerStore = class {
  /**
   * Returns the internal Discord ExpressionPickerStore.
   * @returns {void}
   */
  useExpressionPickerStore = {
    getState: () => {
      throw Error("Not implemented");
    }
  };
  /**
   * Toggles the Expression Picker with the specified view and view type.
   * @param {string} activeView - The active view to be displayed in the Expression Picker.
   * @param {object} activeViewType - The type of the active view.
   * @returns {void}
   */
  toggleExpressionPicker = (activeView, activeViewType) => {
    throw Error("Not implemented");
  };
  /**
   * Closes the Expression Picker.
   * @param {object} [activeViewType] - The type of the active view.
   * @returns {void}
   */
  closeExpressionPicker = (activeViewType) => {
    throw Error("Not implemented");
  };
  /**
   * Constructs a new instance of the ExpressionPickerStore class.
   * @constructor
   */
  constructor() {
    const ExpressionPickerModule = getModule2(
      (m) => Object.keys(m).some(
        (key) => typeof m[key] === "function" && m[key].toString().includes("isSearchSuggestion")
      )
    );
    Object.values(ExpressionPickerModule).forEach((fn) => {
      if (fn.getState)
        this.useExpressionPickerStore = fn;
      else if (/getState\(\)\.activeView.*===.*\?.*:/.test(fn.toString()))
        this.toggleExpressionPicker = fn;
      else if (fn.toString().includes("activeView:null,activeViewType:null"))
        this.closeExpressionPicker = fn;
    });
  }
};
var EPS = new ExpressionPickerStore();
var ExpressionPickerStore_default = EPS;

// src/RisiBank/components/NavbarLabel.tsx
var { useMemo } = BdApi.React;
function NavbarLabel({ elementType: OriginalComponent }) {
  const expressionPickerState = ExpressionPickerStore_default.useExpressionPickerStore.getState();
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
var NavbarLabel_default = NavbarLabel;

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
      ExpressionPickerStore_default.closeExpressionPicker();
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
      ExpressionPickerStore_default,
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
var Picker_default = Picker;

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
          const idx = navItems.findIndex(
            (item) => item?.props?.viewType === "emoji"
          );
          navItems.splice(
            idx,
            0,
            /* @__PURE__ */ BdApi.React.createElement(NavbarLabel_default, { elementType })
          );
          const activePicker = ExpressionPickerStore_default.useExpressionPickerStore.getState().activeView;
          if (activePicker === EXPRESSION_PICKER_VIEW) {
            body.push(/* @__PURE__ */ BdApi.React.createElement(Picker_default, null));
          }
        } catch (e) {
          err(PLUGIN_NAME, "Failed to patch ExpressionPicker!", e);
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
    chatInputButton: "expression-picker-chat-input-button"
  }
};

// src/RisiBank/components/Button.tsx
function Button({ channelType }) {
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
          ExpressionPickerStore_default.toggleExpressionPicker(
            EXPRESSION_PICKER_VIEW,
            channelType
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
var Button_default = Button;

// src/RisiBank/patches/TextAreaButtonsMemo.tsx
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
      if (channel?.type === ChannelTypes.DM || channel?.type === ChannelTypes.GROUP_DM || checkPermission(PermissionsConstants.EMBED_LINKS)) {
        ret.props.children.splice(
          -1,
          0,
          /* @__PURE__ */ BdApi.React.createElement(Button_default, { channelType: type })
        );
      }
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

// src/common/updater.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));

// src/common/semver.js
var regex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
var numeric = /^[0-9]+$/;
function compare(a, b) {
  const anum = numeric.test(a);
  const bnum = numeric.test(b);
  if (anum && bnum) {
    a = +a;
    b = +b;
  }
  if (a === b)
    return 0;
  else if (anum && !bnum)
    return -1;
  else if (bnum && !anum)
    return 1;
  else if (a < b)
    return -1;
  return 1;
}
function tokenize(pre) {
  return pre.split(".").map((id) => {
    if (!numeric.test(id))
      return id;
    const num = +id;
    if (num >= 0 && num < Number.MAX_SAFE_INTEGER)
      return num;
    return id;
  });
}
function compareTokens(a, b) {
  const atokens = tokenize(a);
  const btokens = tokenize(b);
  for (let index = 0; ; index++) {
    const x = atokens[index];
    const y = btokens[index];
    if (x === void 0 && y === void 0)
      return 0;
    else if (y === void 0)
      return 1;
    else if (x === void 0)
      return -1;
    else if (x === y)
      continue;
    return compare(x, y);
  }
}
function preCompare(a, b) {
  if (a.length && !b.length)
    return -1;
  else if (!a.length && b.length)
    return 1;
  else if (!a.length && !b.length)
    return 0;
  return compareTokens(a, b);
}
function comparator(currentVersion, remoteVersion) {
  const current = regex.exec(currentVersion);
  const remote = regex.exec(remoteVersion);
  const versionCompare = compare(remote[1], current[1]) || compare(remote[2], current[2]) || compare(remote[3], current[3]);
  const prereleaseCompare = preCompare(remote[4] ?? "", current[4] ?? "");
  const buildCompare = compareTokens(remote[5] ?? "", current[5] ?? "");
  return versionCompare || prereleaseCompare || buildCompare;
}

// src/common/updater.ts
var {
  DOM: { parseHTML },
  Net: { fetch: request },
  Plugins,
  UI: { showToast, showNotice }
} = BdApi;
var splitRegex = /[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/;
var escapedAtRegex = /^\\@/;
var PluginUpdater = class _PluginUpdater {
  filename;
  pluginName;
  updateURL;
  currentVersion;
  remoteVersion;
  constructor(pluginName, updateURL) {
    this.pluginName = pluginName;
    this.filename = `${pluginName}.plugin.js`;
    this.updateURL = updateURL;
    this.currentVersion = Plugins.get(this.filename)?.version ?? "";
    this.remoteVersion = "";
  }
  static update(pluginName, updateURL) {
    const updater = new _PluginUpdater(pluginName, updateURL);
    updater.checkForUpdate();
  }
  static parseMeta(fileContent) {
    const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
    const out = {
      name: "",
      author: "",
      description: "",
      version: ""
    };
    let field = "";
    let accum = "";
    for (const line of block.split(splitRegex)) {
      if (line.length === 0)
        continue;
      if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
        out[field] = accum;
        const l = line.indexOf(" ");
        field = line.substring(1, l);
        accum = line.substring(l + 1);
      } else {
        accum += " " + line.replace("\\n", "\n").replace(escapedAtRegex, "@");
      }
    }
    out[field] = accum.trim();
    delete out[""];
    return out;
  }
  async checkForUpdate() {
    if (!this.filename || !this.updateURL)
      return;
    const resp = await request(this.updateURL);
    if (!resp.ok)
      return;
    const meta = _PluginUpdater.parseMeta(await resp.text());
    if (!meta?.version)
      return;
    this.remoteVersion = meta.version;
    const hasUpdate = regex.test(this.remoteVersion) && regex.test(this.currentVersion) && comparator(this.currentVersion, this.remoteVersion) > 0;
    if (hasUpdate)
      this.showUpdateNotice();
  }
  showUpdateNotice() {
    const close = showNotice(
      parseHTML(
        `<span>The following plugin has an update:&nbsp;&nbsp;<strong>${this.pluginName}</strong></span>`
      ),
      {
        buttons: [
          {
            label: "Update",
            onClick: () => {
              close();
              this.updatePlugin();
            }
          }
        ]
      }
    );
  }
  async updatePlugin() {
    const resp = await request(this.updateURL);
    const file = import_path.default.join(Plugins.folder, this.filename);
    const rawPlugin = await resp.text();
    await new Promise((r) => import_fs.default.writeFile(file, rawPlugin, r));
    showToast(
      `${this.pluginName} has been updated to version ${this.remoteVersion}!`,
      {
        type: "success"
      }
    );
  }
};

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
    PluginUpdater.update(PLUGIN_NAME, UPDATE_URL);
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
