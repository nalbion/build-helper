"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var detector_1 = require("./detector");
/** Detects version control system */
var ScmDetector = (function (_super) {
    __extends(ScmDetector, _super);
    function ScmDetector(model) {
        var _this = _super.call(this, model) || this;
        _this.data = {};
        return _this;
    }
    ScmDetector.prototype.scanFiles = function (files) {
        return Promise.resolve(null);
    };
    return ScmDetector;
}(detector_1.Detector));
exports.ScmDetector = ScmDetector;
//# sourceMappingURL=scm-detector.js.map