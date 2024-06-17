const {
    Webpack: { getByKeys, getModule, getStore },
} = BdApi;

// Constants
export const PermissionsConstants = getByKeys("ADD_REACTIONS", "EMBED_LINKS", {
    searchExports: true,
});
export const ChannelTypes = getByKeys("ChannelTypes").ChannelTypes;

// Misc modules
export const Dispatcher = getByKeys("dispatch", "subscribe");
export const MessageActions = getByKeys("_sendMessage", "sendMessage");
export const Permissions = getByKeys(
    "can",
    "canEveryone",
    "computePermissions"
);
export const ExpressionPicker = getByKeys("toggleExpressionPicker");
export const { ReferencePositionLayer } = getByKeys(
    "ReferencePositionLayer",
    "referencePortalAwareContains"
);
export const ChannelTextAreaButtons = getModule((m) =>
    m.type
        ?.toString?.()
        .includes(".default.isSubmitButtonEnabled", ".default.getActiveCommand")
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
export const UserStore = getStore("UserStore");
