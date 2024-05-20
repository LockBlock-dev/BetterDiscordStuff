/**
 * @name NoMediaBadge
 * @author LockBlock
 * @description Removes the guild media badge
 * @version 1.0.0
 * @donate https://ko-fi.com/lockblock
 * @source https://github.com/LockBlock-dev/BetterDiscordStuff/tree/master/src/NoMediaBadge
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

// src/NoMediaBadge/index.ts
var NoMediaBadge_exports = {};
__export(NoMediaBadge_exports, {
  default: () => NoMediaBadge
});
module.exports = __toCommonJS(NoMediaBadge_exports);

// src/NoMediaBadge/constants.ts
var PLUGIN_NAME = "NoMediaBadge";

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

// src/NoMediaBadge/discordModules.ts
var {
  Webpack: { getByKeys }
} = BdApi;
var MediaBadges = getByKeys("renderMediaBadge", "renderMentionBadge");

// src/NoMediaBadge/classes.ts
var {
  Webpack: { getByKeys: getByKeys2 }
} = BdApi;
var classes_default = {
  guildListItem: getByKeys2("lowerBadge", "upperBadge", "wrapper")
};

// src/NoMediaBadge/patches/MediaBadge.ts
var { Patcher: Patcher2 } = BdApi;
var patch = () => {
  Patcher2.instead(PLUGIN_NAME, MediaBadges, "renderMediaBadge", () => null);
  reRender(PLUGIN_NAME, toSelector(classes_default.guildListItem.wrapper));
};
var MediaBadge_default = {
  name: "MediaBadge",
  patch
};

// src/NoMediaBadge/patches/index.ts
var patches_default = [MediaBadge_default];

// src/NoMediaBadge/index.ts
var { Patcher: Patcher3, UI } = BdApi;
var NoMediaBadge = class {
  meta;
  /**
   * Constructs a new instance of the NoMediaBadge plugin class.
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
    Patcher3.unpatchAll(this.meta.name);
    log(PLUGIN_NAME, `version ${this.meta.version} has stopped.`);
  }
};
