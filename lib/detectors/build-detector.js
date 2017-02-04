"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var detector_1 = require("./detector");
var BuildDetector = (function (_super) {
    __extends(BuildDetector, _super);
    function BuildDetector() {
        var _this = _super.apply(this, arguments) || this;
        _this.data = {};
        return _this;
    }
    BuildDetector.prototype.scanFiles = function (files) {
        return Promise.resolve(null);
    };
    return BuildDetector;
}(detector_1.Detector));
exports.BuildDetector = BuildDetector;
//# sourceMappingURL=build-detector.js.map