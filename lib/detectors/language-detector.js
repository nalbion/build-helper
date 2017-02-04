"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var detector_1 = require("./detector");
var LanguageDetector = (function (_super) {
    __extends(LanguageDetector, _super);
    function LanguageDetector() {
        var _this = _super.apply(this, arguments) || this;
        _this.data = {};
        return _this;
    }
    LanguageDetector.prototype.scanFiles = function (files) {
        return Promise.resolve(null);
    };
    return LanguageDetector;
}(detector_1.Detector));
exports.LanguageDetector = LanguageDetector;
//# sourceMappingURL=language-detector.js.map