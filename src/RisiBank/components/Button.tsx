import React, { type ReactNode } from "react";
import { ExpressionPicker, InputConstants } from "../discordModules";
import {
    EXPRESSION_PICKER_VIEW,
    TEXTAREA_BUTTON_ARIA_LABEL,
} from "../constants";
import Classes from "../classes";

/**
 * Represents a RisiBank TextArea button.
 * @returns {ReactNode} The React element representing the button.
 */
export default function Button(): ReactNode {
    return (
        <div
            className={[
                Classes.expressionPicker.chatInputButton,
                Classes.global.buttonContainer,
            ].join(" ")}
        >
            <button
                type="button"
                aria-label={TEXTAREA_BUTTON_ARIA_LABEL}
                onClick={() => {
                    ExpressionPicker.toggleExpressionPicker(
                        EXPRESSION_PICKER_VIEW,
                        InputConstants.NORMAL
                    );
                }}
                className={[
                    Classes.global.button,
                    Classes.branding.button,
                    Classes.branding.lookBlank,
                    Classes.branding.colorBrand,
                    Classes.branding.grow,
                ].join(" ")}
            >
                <svg
                    width="24"
                    height="24"
                    className={Classes.global.stickerIcon}
                    viewBox="0 0 20 20"
                >
                    <path
                        d="M0 0L1 1L0 0z"
                        style={{ fill: "rgb(1, 1, 1)", stroke: "none" }}
                    ></path>
                    <path
                        d="M1.6034 1.02778C-0.564398 2.7447 0.00482528 6.58035 0 9C-0.00536454 11.6901 -0.769009 16.128 1.02778 18.3966C3.2502 21.2026 15.7091 21.1008 18.3966 18.9722C20.5644 17.2553 19.9952 13.4196 20 11C20.0054 8.30995 20.769 3.87202 18.9722 1.60339C16.7498 -1.20264 4.29094 -1.1008 1.6034 1.02778z"
                        style={{ fill: "rgb(254, 131, 179)", stroke: "none" }}
                    ></path>
                    <path
                        d="M19 0L20 1L19 0z"
                        style={{ fill: "rgb(1, 1, 1)", stroke: "none" }}
                    ></path>
                    <path
                        d="M2 13L2 16L3 16L2 13z"
                        style={{ fill: "rgb(177, 91, 140)", stroke: "none" }}
                    ></path>
                    <path
                        d="M3 16L13 16C12.0438 11.5379 3.95617 11.5379 3 16z"
                        style={{ fill: "rgb(37, 21, 71)", stroke: "none" }}
                    ></path>
                    <path
                        d="M13 13L13 16L14 16L13 13z"
                        style={{ fill: "rgb(177, 91, 140)", stroke: "none" }}
                    ></path>
                    <path
                        d="M4 15L5 16L4 15M11 15L12 16L11 15z"
                        style={{ fill: "rgb(88, 47, 97)", stroke: "none" }}
                    ></path>
                    <path
                        d="M0 19L1 20L0 19M19 19L20 20L19 19z"
                        style={{ fill: "rgb(1, 1, 1)", stroke: "none" }}
                    ></path>
                </svg>
            </button>
        </div>
    );
}
