"use strict";
var build_detector_1 = require("./build-detector");
var ci_detector_1 = require("./ci-detector");
var cloud_detector_1 = require("./cloud-detector");
var deploy_detector_1 = require("./deploy-detector");
var language_detector_1 = require("./language-detector");
var scm_detector_1 = require("./scm-detector");
var fs = require('fs');
var DetectorManager = (function () {
    function DetectorManager() {
        this.build = new build_detector_1.BuildDetector();
        this.ci = new ci_detector_1.CiDetector();
        this.cloud = new cloud_detector_1.CloudDetector();
        this.deploy = new deploy_detector_1.DeployDetector();
        this.language = new language_detector_1.LanguageDetector();
        this.scm = new scm_detector_1.ScmDetector();
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