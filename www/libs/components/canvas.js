"use strict";

System.register(["angular2/core"], function (_export, _context) {
    "use strict";

    var Component, _typeof, __decorate, Canvas;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_angular2Core) {
            Component = _angular2Core.Component;
        }],
        execute: function () {
            _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
            };

            __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
                var c = arguments.length,
                    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
                    d;
                if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
                    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                }return c > 3 && r && Object.defineProperty(target, key, r), r;
            };

            _export("Canvas", Canvas = function Canvas() {
                _classCallCheck(this, Canvas);
            });

            _export("Canvas", Canvas);

            Canvas.width = 300;
            Canvas.height = 250;
            _export("Canvas", Canvas = __decorate([Component({
                selector: 'spectre',
                template: "<canvas *ngIf=\"height \" height='{{height}}' width='{{height}}' id='example'></canvas>"
            })], Canvas));
        }
    };
});