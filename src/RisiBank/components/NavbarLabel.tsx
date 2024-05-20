const { useMemo } = BdApi.React as typeof import("react");

import React, { type ReactNode } from "react";
import { ExpressionPicker } from "../discordModules";
import { EXPRESSION_PICKER_VIEW, PLUGIN_NAME } from "../constants";

/**
 * Represents a RisiBank expression picker navbar label.
 * @param {unknown} OriginalComponent
 * @returns {ReactNode} The React element representing the navbar label.
 */
export default function NavbarLabel(OriginalComponent): ReactNode {
    const expressionPickerState =
        ExpressionPicker.useExpressionPickerStore.getState();

    const selected = useMemo(
        () => EXPRESSION_PICKER_VIEW === expressionPickerState.activeView,
        [EXPRESSION_PICKER_VIEW, expressionPickerState]
    );

    return (
        <OriginalComponent
            id={`${EXPRESSION_PICKER_VIEW}-picker-tab`}
            aria-controls={`${EXPRESSION_PICKER_VIEW}-picker-tab-panel`}
            aria-selected={selected}
            viewType={EXPRESSION_PICKER_VIEW}
            isActive={selected}
        >
            {PLUGIN_NAME}
        </OriginalComponent>
    );
}
