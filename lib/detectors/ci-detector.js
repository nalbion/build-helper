"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var detector_1 = require("./detector");
var CiDetector = (function (_super) {
    __extends(CiDetector, _super);
    function CiDetector(model) {
        var _this = _super.call(this, model) || this;
        _this.data = {};
        return _this;
    }
    CiDetector.prototype.scanFiles = function (files) {
        return Promise.resolve(null);
    };
    return CiDetector;
}(detector_1.Detector));
exports.CiDetector = CiDetector;
//# sourceMappingURL=ci-detector.js.map