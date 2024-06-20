/**
 * @name NoMediaBadge
 * @author LockBlock
 * @description Removes the guild media badge
 * @version 1.1.0
 * @donate https://ko-fi.com/lockblock
 * @source https://github.com/LockBlock-dev/BetterDiscordStuff/tree/master/src/NoMediaBadge
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

// src/NoMediaBadge/index.ts
var NoMediaBadge_exports = {};
__export(NoMediaBadge_exports, {
  default: () => NoMediaBadge
});
module.exports = __toCommonJS(NoMediaBadge_exports);

// src/NoMediaBadge/constants.ts
var PLUGIN_NAME = "NoMediaBadge";
var UPDATE_URL = "https://raw.githubusercontent.com/LockBlock-dev/BetterDiscordStuff/master/dist/NoMediaBadge/NoMediaBadge.plugin.js";

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
    Patcher3.unpatchAll(this.meta.name);
    log(PLUGIN_NAME, `version ${this.meta.version} has stopped.`);
  }
};
