const { useEffect, useMemo, useCallback } =
    BdApi.React as typeof import("react");

import React from "react";
import { BASE_API_URI, EXPRESSION_PICKER_VIEW } from "../constants";
import {
    ComponentDispatch,
    Dispatcher,
    ExpressionPicker,
    MessageActions,
    PendingReplyStore,
    SelectedChannelStore,
} from "../discordModules";

/**
 * Represents the RisiBank ExpressionPicker view.
 */
function Picker() {
    /**
     * The iframe URL as a string.
     */
    const iframeURL = useMemo(
        () =>
            `${BASE_API_URI}/embed?${new URLSearchParams({
                theme: "dark",
                allowUsernameSelection: "false",
                showCopyButton: "false",
                mediaSize: "sm",
                navbarSize: "md",
                defaultTab: "hot",
                showNSFW: "false",
            }).toString()}`,
        [BASE_API_URI]
    );

    /**
     * Handles the "message" event and processes the selected sticker.
     * @param {MessageEvent} e - The "message" event object.
     * @returns {void}
     */
    const onSelectSticker = useCallback(
        (e: MessageEvent): void => {
            if (e.origin !== BASE_API_URI) return;

            const {
                data: { type, media },
            } = e;

            if (type !== "risibank-media-selected" || !media) return;

            ExpressionPicker.closeExpressionPicker();

            let mediaUrl = media.cache_url;

            if (mediaUrl.includes("full"))
                mediaUrl = mediaUrl.replace("full", "thumb");

            const currentChannelId = SelectedChannelStore.getChannelId();

            const pendingReply =
                PendingReplyStore.getPendingReply(currentChannelId);

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
        },
        [
            BASE_API_URI,
            ExpressionPicker,
            SelectedChannelStore,
            PendingReplyStore,
            MessageActions,
            Dispatcher,
            ComponentDispatch,
        ]
    );

    useEffect(() => {
        addEventListener("message", onSelectSticker);

        return () => {
            removeEventListener("message", onSelectSticker);
        };
    }, []);

    return (
        <div
            id={`${EXPRESSION_PICKER_VIEW}-picker-tab-panel`}
            role="tabpanel"
            aria-labelledby={`${EXPRESSION_PICKER_VIEW}-picker-tab`}
        >
            <iframe
                src={iframeURL}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    overflow: "hidden",
                }}
            />
        </div>
    );
}

export default Picker;
