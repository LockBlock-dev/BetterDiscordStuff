import {
    ChannelStore,
    Permissions,
    SelectedChannelStore,
} from "./discordModules";

/**
 * Returns the currently selected channel
 * @returns {object | undefined} The currently selected channel object from the ChannelStore.
 */
export const getCurrentChannel = () => {
    return ChannelStore.getChannel(SelectedChannelStore.getChannelId());
};

/**
 * Computes a permission for an user in a channel.
 * @param {bigint} permission - The permission flag to check.
 * @param {object} channel - The channel in which the permission is checked. Defaults to the current channel.
 * @param {object} user - The user for whom the permission is checked. Defaults to the current user.
 * @returns {boolean} Returns `true` if the user has the specified permission in the channel context, otherwise `false`.
 */
export const checkPermission = (
    permission: bigint,
    channel = getCurrentChannel(),
    user = undefined
): boolean => {
    return Permissions.can(permission, channel, user);
};

export * from "../common/utils";
