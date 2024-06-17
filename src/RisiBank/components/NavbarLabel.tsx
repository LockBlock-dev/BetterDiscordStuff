const { useMemo } = BdApi.React as typeof import("react");

import React, { type ComponentType } from "react";
import { ExpressionPicker } from "../discordModules";
import { EXPRESSION_PICKER_VIEW, PLUGIN_NAME } from "../constants";

interface NavbarLabelProps {
    elementType: ComponentType<any>;
}

/**
 * Represents the RisiBank expression picker navbar label.
 */
export default function NavbarLabel({
    elementType: OriginalComponent,
}: NavbarLabelProps) {
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
