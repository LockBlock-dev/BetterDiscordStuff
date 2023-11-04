const { Patcher, UI } = BdApi;

import { log, warn, err } from "./utils";
import patches from "./patches";

/**
 * Represents the FluentEmoji plugin.
 * @class
 */
export default class FluentEmoji {
    /**
     * Constructs a new instance of the FluentEmoji plugin class.
     * @param {object} meta - The meta information to initialize the instance.
     * @constructor
     */
    constructor(meta) {
        /**
         * The meta information associated with the instance.
         * @type {object}
         */
        this.meta = meta;
    }

    /**
     * Initializes the plugin.
     * @async
     * @returns {Promise<void>}
     */
    async init() {
        patches.forEach((patchModule) => {
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

        log(`version ${this.meta.version} has stopped.`);
    }
}
