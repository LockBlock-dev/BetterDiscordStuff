const {
    Webpack: { getByKeys, getModule, getStore },
} = BdApi;

// Constants
export const PermissionsConstants = getByKeys("ADD_REACTIONS", "EMBED_LINKS", {
    searchExports: true,
});
export const ChannelTypes = getByKeys("DM", "GROUP_DM", "GUILD_CATEGORY", {
    searchExports: true,
});

// Misc modules
export const Dispatcher = getByKeys("dispatch", "subscribe");
export const MessageActions = getByKeys("_sendMessage", "sendMessage");
export const Permissions = getByKeys("computePermissions");
export const { ReferencePositionLayer } = getByKeys(
    "ReferencePositionLayer",
    "referencePortalAwareContains"
);
export const ChannelTextAreaButtons = getModule((m) =>
    m.type?.toString?.().includes(".isSubmitButtonEnabled", ".getActiveCommand")
);
export const ComponentDispatch = getModule(
    (m) =>
        m.dispatchToLastSubscribed &&
        m.emitter?.listeners("TEXTAREA_FOCUS").length,
    { searchExports: true }
);

// Stores
export const ChannelStore = getStore("ChannelStore");
export const PendingReplyStore = getStore("PendingReplyStore");
export const SelectedChannelStore = getStore("SelectedChannelStore");
