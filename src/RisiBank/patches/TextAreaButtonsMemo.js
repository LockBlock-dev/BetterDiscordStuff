const { Patcher, ReactUtils } = BdApi;

import Classes from "../classes";
import { PLUGIN_NAME } from "../constants";
import { checkPermission, reRender, toSelector, waitForSelector } from "../utils";
import { PermissionsConstants } from "../discordModules";

import RisiBankButton from "../components/Button";

const patch = async () => {
    const TextAreaButtonsSelector = toSelector(Classes.global.buttons);

    // prevents an error on start if the user is not in a channel
    await waitForSelector(TextAreaButtonsSelector);

    const TextAreaButtonsMemo = ReactUtils.getInternalInstance(
        document.querySelector(TextAreaButtonsSelector)
    )?.return?.elementType;

    Patcher.after(PLUGIN_NAME, TextAreaButtonsMemo, "type", (_, [props], ret) => {
        // const emojiButton = ret.props.children[ret.props.children.length - 1];

        if (props?.disabled) return;

        // prevents the button to be added in profile settings
        if (!props?.type?.attachments) return;

        // if the channel is DM or GROUP_DM or user has EMBED_LINKS permission
        if (
            props?.channel?.type === 1 ||
            props?.channel?.type === 3 ||
            checkPermission(PermissionsConstants.EMBED_LINKS)
        )
            // inserts the RisiBank button just between sticker and emoji button
            ret.props.children.splice(-1, 0, RisiBankButton());
    });

    reRender(PLUGIN_NAME, TextAreaButtonsSelector);
};

export default {
    name: "TextAreaButtonsMemo",
    patch,
};
