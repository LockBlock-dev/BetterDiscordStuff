const { Patcher, Utils } = BdApi;

import React from "react";
import { EXPRESSION_PICKER_VIEW, PLUGIN_NAME } from "../constants";
import { err } from "../utils";
import { ReferencePositionLayer } from "../discordModules";
import ExpressionPicker from "../discordModules/ExpressionPickerStore";

import RisiBankNavLabel from "../components/NavbarLabel";
import RisiBankPicker from "../components/Picker";

const patch = () => {
    Patcher.after(
        PLUGIN_NAME,
        ReferencePositionLayer.prototype,
        "render",
        (_1, _2, ret) => {
            const originalChildren = ret?.props?.children;
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

                const navItems = Utils.findInTree(
                    body[0],
                    (e) => e?.role === "tablist",
                    {
                        walkable: ["props", "children"],
                    }
                )?.children;

                if (!navItems) return newChildren;

                // prevents odd duplication
                if (
                    navItems.some(
                        (item) =>
                            item?.props?.viewType === EXPRESSION_PICKER_VIEW
                    )
                )
                    return newChildren;

                try {
                    const elementType = navItems[0].type.type;

                    const idx = navItems.findIndex(
                        (item) => item?.props?.viewType === "emoji"
                    );

                    navItems.splice(
                        idx,
                        0,
                        <RisiBankNavLabel elementType={elementType} />
                    );

                    const activePicker =
                        ExpressionPicker.useExpressionPickerStore.getState()
                            .activeView;

                    if (activePicker === EXPRESSION_PICKER_VIEW) {
                        body.push(<RisiBankPicker />);
                    }
                } catch (e) {
                    err(PLUGIN_NAME, "Failed to patch ExpressionPicker!", e);
                }

                return newChildren;
            };
        }
    );
};

export default {
    name: "ExpressionPicker",
    patch,
};
