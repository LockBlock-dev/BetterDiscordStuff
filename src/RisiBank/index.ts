const { Patcher, UI } = BdApi;

import { PLUGIN_NAME, UPDATE_URL } from "./constants";
import { log, warn, err } from "./utils";
import patches from "./patches";
import type { Meta, Plugin } from "betterdiscord";
import PluginUpdater from "../common/updater";

/**
 * Represents the RisiBank plugin.
 * @class
 */
export default class RisiBank implements Plugin {
    private meta: Meta;

    /**
     * Constructs a new instance of the RisiBank plugin class.
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
    init(): void {
        PluginUpdater.update(PLUGIN_NAME, UPDATE_URL);

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
    start(): void {
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
    stop(): void {
        Patcher.unpatchAll(this.meta.name);

        log(PLUGIN_NAME, `version ${this.meta.version} has stopped.`);
    }
}
