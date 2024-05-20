const { Patcher, UI } = BdApi;

import { PLUGIN_NAME } from "./constants";
import { log, warn, err } from "./utils";
import patches from "./patches";
import type { Meta, Plugin } from "betterdiscord";

/**
 * Represents the NoMediaBadge plugin.
 * @class
 */
export default class NoMediaBadge implements Plugin {
    meta: Meta;

    /**
     * Constructs a new instance of the NoMediaBadge plugin class.
     * @param {Meta} meta - The meta information to initialize the instance.
     * @constructor
     */
    constructor(meta: Meta) {
        /**
         * The meta information associated with the instance.
         * @type {object}
         */
        this.meta = meta;
    }

    /**
     * Initializes the plugin.
     * @returns {void}
     */
    init() {
        patches.forEach((patchModule) => {
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
                type: "error",
            });
        }
    }

    /**
     * Stops the plugin by undoing any changes made during initialization.
     * @returns {void}
     */
    stop() {
        Patcher.unpatchAll(this.meta.name);

        log(PLUGIN_NAME, `version ${this.meta.version} has stopped.`);
    }
}
