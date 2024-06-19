const {
    Webpack: { getModule },
} = BdApi;

/**
 * Represents an ExpressionPickerStore.
 * @class
 */
class ExpressionPickerStore {
    /**
     * Returns the internal Discord ExpressionPickerStore.
     * @returns {void}
     */
    useExpressionPickerStore = {
        getState: (): any => {
            throw Error("Not implemented");
        },
    };

    /**
     * Toggles the Expression Picker with the specified view and view type.
     * @param {string} activeView - The active view to be displayed in the Expression Picker.
     * @param {object} activeViewType - The type of the active view.
     * @returns {void}
     */
    toggleExpressionPicker = (activeView: string, activeViewType: any) => {
        throw Error("Not implemented");
    };

    /**
     * Closes the Expression Picker.
     * @param {object} [activeViewType] - The type of the active view.
     * @returns {void}
     */
    closeExpressionPicker = (activeViewType?: any) => {
        throw Error("Not implemented");
    };

    /**
     * Constructs a new instance of the ExpressionPickerStore class.
     * @constructor
     */
    constructor() {
        const ExpressionPickerModule = getModule((m) =>
            Object.keys(m).some(
                (key) =>
                    typeof m[key] === "function" &&
                    m[key].toString().includes("isSearchSuggestion")
            )
        );

        Object.values<any>(ExpressionPickerModule).forEach((fn) => {
            if (fn.getState) this.useExpressionPickerStore = fn;
            else if (/getState\(\)\.activeView.*===.*\?.*:/.test(fn.toString()))
                this.toggleExpressionPicker = fn;
            else if (
                fn.toString().includes("activeView:null,activeViewType:null")
            )
                this.closeExpressionPicker = fn;
        });
    }
}

const EPS = new ExpressionPickerStore();

export default EPS;
