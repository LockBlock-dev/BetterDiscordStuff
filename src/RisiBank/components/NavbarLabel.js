const { React } = BdApi;

import { ExpressionPickerStore } from "../discordModules";
import { EXPRESSION_PICKER_VIEW, PLUGIN_NAME } from "../constants";

/**
 * Represents a RisiBank expression picker navbar label.
 * @param {object} elementType
 * @returns {React.Element} The React element representing the navbar label.
 */
export default NavbarLabel = (elementType) => {
    const type = EXPRESSION_PICKER_VIEW;
    const selected = type === ExpressionPickerStore.useExpressionPickerStore.getState().activeView;

    return React.createElement(
        elementType,
        {
            id: `${type}-picker-tab`,
            "aria-controls": `${type}-picker-tab-panel`,
            "aria-selected": selected,
            viewType: type,
            isActive: selected,
        },
        PLUGIN_NAME
    );
};
