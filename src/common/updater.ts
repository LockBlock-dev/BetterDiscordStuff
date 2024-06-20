import fileSystem from "fs";
import path from "path";

import { comparator as semverComparator, regex as semverRegex } from "./semver";
import type { Meta } from "betterdiscord";

const {
    DOM: { parseHTML },
    Net: { fetch: request },
    Plugins,
    UI: { showToast, showNotice },
} = BdApi;

const splitRegex = /[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/;
const escapedAtRegex = /^\\@/;

type PluginFilename = `${string}.plugin.js`;

export default class PluginUpdater {
    filename: PluginFilename;
    pluginName: string;
    updateURL: string;
    currentVersion: string;
    remoteVersion: string;

    constructor(pluginName: string, updateURL: string) {
        this.pluginName = pluginName;
        this.filename = `${pluginName}.plugin.js`;
        this.updateURL = updateURL;
        this.currentVersion = Plugins.get(this.filename)?.version ?? "";
        this.remoteVersion = "";
    }

    static update(pluginName: string, updateURL: string) {
        const updater = new PluginUpdater(pluginName, updateURL);

        updater.checkForUpdate();
    }

    static parseMeta(fileContent: string): Meta {
        const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
        const out: Meta = {
            name: "",
            author: "",
            description: "",
            version: "",
        };
        let field = "";
        let accum = "";

        for (const line of block.split(splitRegex)) {
            if (line.length === 0) continue;
            if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
                out[field] = accum;
                const l = line.indexOf(" ");
                field = line.substring(1, l);
                accum = line.substring(l + 1);
            } else {
                accum +=
                    " " +
                    line.replace("\\n", "\n").replace(escapedAtRegex, "@");
            }
        }

        out[field] = accum.trim();

        delete out[""];

        return out;
    }

    async checkForUpdate() {
        if (!this.filename || !this.updateURL) return;

        const resp = await request(this.updateURL);

        if (!resp.ok) return;

        const meta = PluginUpdater.parseMeta(await resp.text());

        if (!meta?.version) return;

        this.remoteVersion = meta.version;

        const hasUpdate =
            semverRegex.test(this.remoteVersion) &&
            semverRegex.test(this.currentVersion) &&
            semverComparator(this.currentVersion, this.remoteVersion) > 0;

        if (hasUpdate) this.showUpdateNotice();
    }

    showUpdateNotice() {
        const close = showNotice(
            parseHTML(
                `<span>The following plugin has an update:&nbsp;&nbsp;<strong>${this.pluginName}</strong></span>`
            ) as Node,
            {
                buttons: [
                    {
                        label: "Update",
                        onClick: () => {
                            close();
                            this.updatePlugin();
                        },
                    },
                ],
            }
        );
    }

    async updatePlugin() {
        const resp = await request(this.updateURL);

        const file = path.join(Plugins.folder, this.filename);
        const rawPlugin = await resp.text();

        await new Promise((r) => fileSystem.writeFile(file, rawPlugin, r));

        showToast(
            `${this.pluginName} has been updated to version ${this.remoteVersion}!`,
            {
                type: "success",
            }
        );
    }
}
