import {
    ChannelStore,
    Permissions,
    SelectedChannelStore,
    UserStore,
} from "./discordModules";

/**
 * Returns the currently selected channel
 * @returns {object | undefined} The currently selected channel object from the ChannelStore.
 */
export const getCurrentChannel = () => {
    return ChannelStore.getChannel(SelectedChannelStore.getChannelId());
};

/**
 * Computer a permission for an user in a channel.
 * @param {bigint} permission - The permission flag to check.
 * @param {object} user - The user for whom the permission is checked. Defaults to the current user.
 * @param {object} channel - The channel in which the permission is checked. Defaults to the current channel.
 * @returns {boolean} Returns `true` if the user has the specified permission in the channel context, otherwise `false`.
 */
export const checkPermission = (
    permission: bigint,
    user = UserStore.getCurrentUser(),
    channel = getCurrentChannel()
): boolean => {
    return Permissions.can({
        permission,
        user,
        context: channel,
    });
};

export * from "../common/utils";
