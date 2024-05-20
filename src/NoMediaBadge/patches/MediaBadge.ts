const { Patcher } = BdApi;

import { PLUGIN_NAME } from "../constants.js";
import { MediaBadges } from "../discordModules.js";
import { toSelector, reRender } from "../utils.js";
import Classes from "../classes.js";

const patch = () => {
    Patcher.instead(PLUGIN_NAME, MediaBadges, "renderMediaBadge", () => null);

    reRender(PLUGIN_NAME, toSelector(Classes.guildListItem.wrapper));
};

export default {
    name: "MediaBadge",
    patch,
};
