/**
 * @internal
 */
var DefaultDialogSettings = /** @class */ (function () {
    function DefaultDialogSettings() {
        this.lock = true;
        this.startingZIndex = 1000;
        this.centerHorizontalOnly = false;
        this.rejectOnCancel = false;
        this.ignoreTransitions = false;
    }
    return DefaultDialogSettings;
}());
export { DefaultDialogSettings };
