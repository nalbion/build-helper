"use strict";
var Detector = (function () {
    function Detector(model) {
        this.model = model;
    }
    /**
     * @param fileName
     * @param encoding
     * @returns {Promise} - resolves with String if encoding specified, else Buffer
     */
    Detector.prototype.readFile = function (fileName, encoding) {
        return model.readFile(fileName, encoding);
    };
    return Detector;
}());
exports.Detector = Detector;
//# sourceMappingURL=detector.js.map