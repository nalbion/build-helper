"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var detector_1 = require("./detector");
var CloudDetector = (function (_super) {
    __extends(CloudDetector, _super);
    function CloudDetector(model) {
        var _this = _super.call(this, model) || this;
        _this.data = {};
        return _this;
    }
    CloudDetector.prototype.scanFiles = function (files) {
        var p = [], i = files.length;
        while (i-- != 0) {
            var fileName = files[i];
            switch (fileName) {
                case 'Procfile':
                    p.push(this.parseProcFile(fileName));
                    break;
            }
        }
        if (p.length == 0) {
            return Promise.resolve(null);
        }
        else {
            return Promise.all(p);
        }
    };
    CloudDetector.prototype.parseProcFile = function (fileName) {
        var _this = this;
        return readFile(fileName, 'utf8').then(function (data) {
            _this.cloud = 'Heroku';
        });
    };
    return CloudDetector;
}(detector_1.Detector));
exports.CloudDetector = CloudDetector;
//# sourceMappingURL=cloud-detector.js.map