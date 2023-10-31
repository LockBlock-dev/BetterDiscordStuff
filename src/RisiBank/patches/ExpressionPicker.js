const { Patcher, React, ReactUtils, Utils } = BdApi;

import Classes from "../classes.js";
import { EXPRESSION_PICKER_VIEW, PLUGIN_NAME } from "../constants";
import { log, warn, err, toSelector, waitForSelector } from "../utils";
import { ExpressionPicker } from "../discordModules";

import RisiBankNavLabel from "../components/NavbarLabel";
import RisiBankPicker from "../components/Picker";

const patch = async () => {
    const ExpressionPickerSelector = toSelector(Classes.expressionPicker.contentWrapper);

    await waitForSelector(ExpressionPickerSelector);

    const ExpressionPickerInstance = ReactUtils.getOwnerInstance(
        document.querySelector(ExpressionPickerSelector)
    );

    Patcher.after(
        PLUGIN_NAME,
        ExpressionPickerInstance.constructor.prototype,
        "render",
        (_, __, ret) => {
            const originalChildren = ret.props?.children;
            if (originalChildren == null) return;

            ret.props.children = (...args) => {
                const newChildren = originalChildren(...args);

                const body = Utils.findInTree(
                    newChildren,
                    (e) => e?.some?.((c) => c?.type === "nav"),
                    {
                        walkable: ["props", "children"],
                    }
                );

                if (!body) return newChildren;

                const navItems = Utils.findInTree(body[0], (e) => e?.role === "tablist", {
                    walkable: ["props", "children"],
                })?.children;

                if (!navItems) return newChildren;

                // prevents odd duplication
                if (navItems.some((item) => item?.props?.viewType === EXPRESSION_PICKER_VIEW))
                    return newChildren;

                try {
                    const elementType = navItems[0].type.type;

                    const RBNavLabel = RisiBankNavLabel(elementType);

                    const idx = navItems.findIndex((item) => item?.props?.viewType === "emoji");

                    navItems.splice(idx, 0, RBNavLabel);

                    const activePicker =
                        ExpressionPicker.useExpressionPickerStore.getState().activeView;

                    if (activePicker === EXPRESSION_PICKER_VIEW) {
                        body.push(React.createElement(RisiBankPicker, {}));
                    }
                } catch (e) {
                    err("Failed to patch ExpressionPicker!", e);
                }

                return newChildren;
            };
        }
    );

    ExpressionPickerInstance.forceUpdate();
};

export default {
    name: "ExpressionPicker",
    patch,
};
