'use strict';

var UxDialog = (function () {
    function UxDialog() {
    }
    UxDialog.$view = "<template><slot></slot></template>";
    UxDialog.$resource = 'ux-dialog';
    return UxDialog;
}());

exports.UxDialog = UxDialog;
//# sourceMappingURL=ux-dialog.js.map
