"use strict";
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var Model = (function () {
    function Model() {
    }
    Model.prototype.load = function () {
        var _this = this;
        return this.readYaml('build-helper.yml', 'utf8', false).then(function (data) {
            if (data != null) {
                _this.model = data;
            }
            else {
                return _this.readPackageJson().then(function (data) {
                    if (data != null) {
                        _this.model = data;
                    }
                    else {
                        return _this.readPomXml().then(function (data) {
                            if (data != null) {
                                _this.model = data;
                            }
                        });
                    }
                });
            }
        });
    };
    Model.prototype.setCloud = function (cloud) {
        this.model.cloud = cloud;
    };
    Model.prototype.readPackageJson = function (failIfNotExist) {
        if (failIfNotExist === void 0) { failIfNotExist = false; }
        return this.readJson('package.json', failIfNotExist);
    };
    Model.prototype.readPomXml = function (failIfNotExist) {
        if (failIfNotExist === void 0) { failIfNotExist = false; }
        return this.readXml('pom.xml', failIfNotExist);
    };
    Model.prototype.readJson = function (fileName, failIfNotExist) {
        if (failIfNotExist === void 0) { failIfNotExist = false; }
        return new Promise(function (resolve, reject) {
            fs.exists(fileName, function (exists) {
                if (!exists) {
                    if (failIfNotExist) {
                        reject(fileName + ' does not exist');
                    }
                    else {
                        resolve(null);
                    }
                }
                else {
                    var data = require(path.resolve(fileName));
                    console.info(fileName, data);
                    resolve(data);
                }
            });
        });
    };
    Model.prototype.writeJson = function (fileName, data) {
        return this.writeFile(fileName, JSON.stringify(data));
    };
    Model.prototype.readYaml = function (fileName, encoding, failIfNotExist) {
        if (encoding === void 0) { encoding = 'utf8'; }
        if (failIfNotExist === void 0) { failIfNotExist = false; }
        return this.readFile(fileName, encoding, failIfNotExist).then(function (data) {
            if (data !== null) {
                data = yaml.safeLoad(data);
            }
            return data;
        });
    };
    Model.prototype.writeYaml = function (fileName, data) {
        return this.writeFile(fileName, yaml.safeDump(data));
    };
    Model.prototype.readXml = function (fileName, encoding, failIfNotExist) {
        if (encoding === void 0) { encoding = 'utf8'; }
        if (failIfNotExist === void 0) { failIfNotExist = false; }
        var convert = require('xml-js');
        return readFile(fileName, encoding, failIfNotExist).then(function (data) {
            return convert.xml2js(data);
        });
    };
    Model.prototype.writeXml = function (fileName, data) {
        var convert = require('xml-js');
        return this.writeFile(fileName, convert.js2xml(data));
    };
    Model.prototype.writeFile = function (fileName, data, options) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(fileName, data, options, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    /**
     * @param fileName
     * @param encoding
     * @param failIfNotExist - defaults to true
     * @returns {Promise} - resolves with String if encoding specified, else Buffer
     */
    Model.prototype.readFile = function (fileName, encoding, failIfNotExist) {
        return new Promise(function (resolve, reject) {
            console.info('loading', fileName);
            fs.readFile(fileName, { encoding: encoding }, function (err, data) {
                if (err) {
                    if (err.code === 'ENOENT' && failIfNotExist === false) {
                        resolve(null);
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=model.js.map