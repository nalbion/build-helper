"use strict";
var model_1 = require("./model");
var detector_manager_1 = require("./detectors/detector-manager");
function run() {
    var model = new model_1.Model(), detectorManager = new detector_manager_1.DetectorManager(model);
    model.load().then(function () {
        detectorManager.load().then(function () {
            console.info('model:', model);
        });
    });
}
(module).exports = run;
//# sourceMappingURL=index.js.map