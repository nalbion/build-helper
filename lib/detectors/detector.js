"use strict";
var model_1 = require("../model");
var Detector = (function () {
    function Detector() {
    }
    /**
     * @param fileName
     * @param encoding
     * @returns {Promise} - resolves with String if encoding specified, else Buffer
     */
    Detector.prototype.readFile = function (fileName, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        return model_1.Model.readFile(fileName, encoding);
    };
    return Detector;
}());
exports.Detector = Detector;
//# sourceMappingURL=detector.js.map