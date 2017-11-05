System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Renderer;
    return {
        setters: [],
        execute: function () {
            /**
             * An abstract base class for implementors of the basic Renderer API.
             */
            Renderer = /** @class */ (function () {
                function Renderer() {
                }
                /**
                 * Gets an anchor for the ViewSlot to insert a view into.
                 * @returns A DOM element.
                 */
                Renderer.prototype.getDialogContainer = function () {
                    throw new Error('DialogRenderer must implement getDialogContainer().');
                };
                /**
                 * Displays the dialog.
                 * @returns Promise A promise that resolves when the dialog has been displayed.
                 */
                Renderer.prototype.showDialog = function (dialogController) {
                    throw new Error('DialogRenderer must implement showDialog().');
                };
                /**
                 * Hides the dialog.
                 * @returns Promise A promise that resolves when the dialog has been hidden.
                 */
                Renderer.prototype.hideDialog = function (dialogController) {
                    throw new Error('DialogRenderer must implement hideDialog().');
                };
                return Renderer;
            }());
            exports_1("Renderer", Renderer);
        }
    };
});
