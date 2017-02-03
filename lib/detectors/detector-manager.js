"use strict";
var build_detector_1 = require("./build-detector");
var ci_detector_1 = require("./ci-detector");
var cloud_detector_1 = require("./cloud-detector");
var deploy_detector_1 = require("./deploy-detector");
var language_detector_1 = require("./language-detector");
var scm_detector_1 = require("./scm-detector");
var fs = require('fs');
var DetectorManager = (function () {
    function DetectorManager(model) {
        this.build = new build_detector_1.BuildDetector(model);
        this.ci = new ci_detector_1.CiDetector(model);
        this.cloud = new cloud_detector_1.CloudDetector(model);
        this.deploy = new deploy_detector_1.DeployDetector(model);
        this.language = new language_detector_1.LanguageDetector(model);
        this.scm = new scm_detector_1.ScmDetector(model);
    }
    DetectorManager.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.readdir('.', function (err, files) {
                if (err) {
                    reject(err);
                }
                else {
                    console.info('files:', files);
                    resolve(Promise.all([
                        _this.build.scanFiles(files),
                        _this.ci.scanFiles(files),
                        _this.cloud.scanFiles(files),
                        _this.deploy.scanFiles(files),
                        _this.language.scanFiles(files),
                        _this.scm.scanFiles(files)
                    ]));
                }
            });
        });
    };
    return DetectorManager;
}());
exports.DetectorManager = DetectorManager;
//# sourceMappingURL=detector-manager.js.map