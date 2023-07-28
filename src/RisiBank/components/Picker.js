const { React, Webpack } = BdApi;

import { BASE_API_URI, EXPRESSION_PICKER_VIEW } from "../constants";
import {
    Dispatcher,
    ExpressionPickerStore,
    MessageActions,
    PendingReplyStore,
    SelectedChannelStore,
} from "../discordModules";

const ComponentDispatch = Webpack.getModule(
    (m) => m.dispatchToLastSubscribed && m.emitter?.listeners("TEXTAREA_FOCUS").length,
    { searchExports: true }
);

/**
 * Represents a RisiBank ExpressionPicker view.
 * @class
 */
export default class Picker extends React.Component {
    /**
     * Constructs a new instance of the Picker class.
     * @param {object} props - React props
     * @constructor
     */
    constructor(props) {
        super(props);

        this.iframeUrl = this.getIFrameUrl();

        this.onSelectSticker = this.onSelectSticker.bind(this);
    }

    /**
     * Renders the component.
     * @returns {React.Element} The React element representing the view.
     */
    render() {
        return React.createElement(
            "div",
            {
                id: `${EXPRESSION_PICKER_VIEW}-picker-tab-panel`,
                role: "tabpanel",
                "aria-labelledby": `${EXPRESSION_PICKER_VIEW}-picker-tab`,
            },
            React.createElement("iframe", {
                src: this.iframeUrl,
                border: "no",
                style: {
                    width: "100%",
                    height: "100%",
                    border: "none",
                    overflow: "hidden",
                },
            })
        );
    }

    /**
     * Lifecycle method that is called after the component is mounted in the DOM.
     * @returns {void}
     */
    componentDidMount() {
        addEventListener("message", this.onSelectSticker);
    }

    /**
     * Lifecycle method that is called before the component is unmounted from the DOM.
     * @returns {void}
     */
    componentWillUnmount() {
        removeEventListener("message", this.onSelectSticker);
    }

    /**
     * Gets the iframe URL.
     * @returns {string} The iframe URL as a string.
     */
    getIFrameUrl() {
        return `${BASE_API_URI}/embed?${new URLSearchParams({
            theme: "dark",
            allowUsernameSelection: false,
            showCopyButton: false,
            mediaSize: "sm",
            navbarSize: "md",
            defaultTab: "hot",
            showNSFW: "false",
        }).toString()}`;
    }

    /**
     * Handles the "message" event and processes the selected sticker.
     * @param {MessageEvent} e - The "message" event object.
     * @returns {void}
     */
    onSelectSticker(e) {
        if (e.origin !== BASE_API_URI) return;

        const {
            data: { type, media },
        } = e;

        if (type !== "risibank-media-selected" || !media) return;

        ExpressionPickerStore.closeExpressionPicker();

        let mediaUrl = media.cache_url;

        if (mediaUrl.includes("full")) mediaUrl = mediaUrl.replace("full", "thumb");

        const currentChannelId = SelectedChannelStore.getChannelId();

        const pendingReply = PendingReplyStore.getPendingReply(currentChannelId);

        const { allowedMentions, messageReference } =
            MessageActions.getSendMessageOptionsForReply(pendingReply);

        if (pendingReply)
            Dispatcher.dispatch({
                type: "DELETE_PENDING_REPLY",
                channelId: currentChannelId,
            });

        MessageActions.sendMessage(
            currentChannelId,
            {
                content: mediaUrl,
                invalidEmojis: [],
                tts: false,
                validNonShortcutEmojis: [],
            },
            true, // whether to wait for the channel to be ready
            {
                messageReference: messageReference,
                allowedMentions: allowedMentions,
            }
        );

        ComponentDispatch.dispatch("TEXTAREA_FOCUS", null);
    }
}
