"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var detector_1 = require("./detector");
var DeployDetector = (function (_super) {
    __extends(DeployDetector, _super);
    function DeployDetector() {
        var _this = _super.apply(this, arguments) || this;
        _this.data = {};
        return _this;
    }
    DeployDetector.prototype.scanFiles = function (files) {
        return Promise.resolve(null);
    };
    return DeployDetector;
}(detector_1.Detector));
exports.DeployDetector = DeployDetector;
//# sourceMappingURL=deploy-detector.js.map