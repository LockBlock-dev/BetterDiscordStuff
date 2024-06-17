const { Patcher } = BdApi;

import React from "react";
import Classes from "../classes";
import { PLUGIN_NAME } from "../constants";
import { checkPermission, reRender, toSelector } from "../utils";
import {
    ChannelTextAreaButtons,
    ChannelTypes,
    PermissionsConstants,
} from "../discordModules";

import RisiBankButton from "../components/Button";

const patch = () => {
    const TextAreaButtonsSelector = toSelector(Classes.global.buttons);

    Patcher.after(
        PLUGIN_NAME,
        ChannelTextAreaButtons,
        "type",
        (_, [props], ret) => {
            const { disabled, type, channel } = props as {
                disabled: boolean | undefined;
                type: any | undefined;
                channel: any | undefined;
            };

            if (disabled) return;

            // prevents the button to be added in profile settings
            if (!type?.attachments) return;

            if (
                channel?.type === ChannelTypes.DM ||
                channel?.type === ChannelTypes.GROUP_DM ||
                checkPermission(PermissionsConstants.EMBED_LINKS)
            ) {
                // inserts the RisiBank button just between sticker and emoji button
                ret.props.children.splice(
                    -1,
                    0,
                    <RisiBankButton channelType={type} />
                );
            }
        }
    );

    reRender(PLUGIN_NAME, TextAreaButtonsSelector);
};

export default {
    name: "TextAreaButtonsMemo",
    patch,
};
