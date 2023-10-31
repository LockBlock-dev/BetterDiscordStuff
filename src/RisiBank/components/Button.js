const { React } = BdApi;

import { ExpressionPicker, InputConstants } from "../discordModules";
import { EXPRESSION_PICKER_VIEW, TEXTAREA_BUTTON_ARIA_LABEL } from "../constants";
import Classes from "../classes";

/**
 * Represents a RisiBank TextArea button.
 * @returns {React.Element} The React element representing the button.
 */
export default Button = () => {
    return React.createElement(
        "div",
        {
            className: [
                Classes.manual.expressionPickerChatInputButton,
                Classes.global.buttonContainer,
            ].join(" "),
        },
        React.createElement(
            "button",
            {
                type: "button",
                "aria-label": TEXTAREA_BUTTON_ARIA_LABEL,
                onClick: () => {
                    ExpressionPicker.toggleExpressionPicker(
                        EXPRESSION_PICKER_VIEW,
                        InputConstants.NORMAL
                    );
                },
                className: [
                    Classes.global.button,
                    Classes.branding.button,
                    Classes.branding.lookBlank,
                    Classes.branding.colorBrand,
                    Classes.branding.grow,
                ].join(" "),
            },
            React.createElement(
                "svg",
                {
                    width: "24",
                    height: "24",
                    className: Classes.global.stickerIcon,
                    viewBox: "0 0 20 20",
                },
                React.createElement("path", {
                    style: { fill: "#010101", stroke: "none" },
                    d: "M0 0L1 1L0 0z",
                }),
                React.createElement("path", {
                    style: { fill: "#fe83b3", stroke: "none" },
                    d: "M1.6034 1.02778C-0.564398 2.7447 0.00482528 6.58035 0 9C-0.00536454 11.6901 -0.769009 16.128 1.02778 18.3966C3.2502 21.2026 15.7091 21.1008 18.3966 18.9722C20.5644 17.2553 19.9952 13.4196 20 11C20.0054 8.30995 20.769 3.87202 18.9722 1.60339C16.7498 -1.20264 4.29094 -1.1008 1.6034 1.02778z",
                }),
                React.createElement("path", {
                    style: { fill: "#010101", stroke: "none" },
                    d: "M19 0L20 1L19 0z",
                }),
                React.createElement("path", {
                    style: { fill: "#b15b8c", stroke: "none" },
                    d: "M2 13L2 16L3 16L2 13z",
                }),
                React.createElement("path", {
                    style: { fill: "#251547", stroke: "none" },
                    d: "M3 16L13 16C12.0438 11.5379 3.95617 11.5379 3 16z",
                }),
                React.createElement("path", {
                    style: { fill: "#b15b8c", stroke: "none" },
                    d: "M13 13L13 16L14 16L13 13z",
                }),
                React.createElement("path", {
                    style: { fill: "#582f61", stroke: "none" },
                    d: "M4 15L5 16L4 15M11 15L12 16L11 15z",
                }),
                React.createElement("path", {
                    style: { fill: "#010101", stroke: "none" },
                    d: "M0 19L1 20L0 19M19 19L20 20L19 19z",
                })
            )
        )
    );
};
