System.register(["aurelia-pal"], function (exports_1, context_1) {
    "use strict";
    var aurelia_pal_1, AttachFocus;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aurelia_pal_1_1) {
                aurelia_pal_1 = aurelia_pal_1_1;
            }
        ],
        execute: function () {
            AttachFocus = /** @class */ (function () {
                function AttachFocus(element) {
                    this.element = element;
                    this.value = true;
                }
                /**
                 * @internal
                 */
                // tslint:disable-next-line:member-ordering
                AttachFocus.inject = function () {
                    return [aurelia_pal_1.DOM.Element];
                };
                AttachFocus.prototype.attached = function () {
                    if (this.value === '' || (this.value && this.value !== 'false')) {
                        this.element.focus();
                    }
                };
                /**
                 * @internal
                 */
                AttachFocus.$resource = {
                    type: 'attribute',
                    name: 'attach-focus'
                };
                return AttachFocus;
            }());
            exports_1("AttachFocus", AttachFocus);
        }
    };
});
