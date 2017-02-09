"use strict";
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
exports.BUILD_HELPER_CACHE = '.build-helper/';
exports.BUILD_HELPER_CONFIG = 'build-helper.yml';
exports.BUILD_HELPER_GLOBAL_CONFIG = '~/.' + exports.BUILD_HELPER_CONFIG;
var RepoConfig = (function () {
    function RepoConfig(project) {
        this.project = project || {};
        this.build = {};
        this.deploy = {};
    }
    return RepoConfig;
}());
exports.RepoConfig = RepoConfig;
var Model = (function () {
    function Model() {
    }
    Model.loadGlobalConfig = function () {
        return Model.readYaml(exports.BUILD_HELPER_GLOBAL_CONFIG, 'utf8', false);
    };
    Model.loadRepoConfig = function (globalConfig) {
        return Model.readYaml(exports.BUILD_HELPER_CONFIG, 'utf8', false).then(function (data) {
            if (data != null) {
                Model.model = data;
                return data;
            }
            else {
                return Model.readPackageJson().then(function (data) {
                    if (data != null) {
                        Model.model = new RepoConfig({ name: data.name });
                        return data;
                    }
                    else {
                        // return Model.readPomXml().then((data) => {
                        //     if (data != null) {
                        //         Model.model = data;
                        //     }
                        //     return data;
                        // })
                        return null;
                    }
                });
            }
        });
    };
    Model.saveGlobalConfig = function (globalConfig) {
        // console.info('saving global config:', globalConfig);
        return Model.writeYaml(exports.BUILD_HELPER_GLOBAL_CONFIG, globalConfig);
    };
    Model.saveRepoConfig = function () {
        return Model.writeYaml(exports.BUILD_HELPER_CONFIG, Model.model);
    };
    Model.load = function () {
        return Model.loadGlobalConfig().then(Model.loadRepoConfig);
    };
    // static save() {
    //     return Model.saveGlobalConfig().then(Model.saveRepoConfig);
    // }
    // static setCloud(cloud: string) {
    //     Model.model.cloud = cloud;
    // }
    Model.setTeam = function (team) {
        Model.model.project.team = team;
    };
    Model.readPackageJson = function (failIfNotExist) {
        if (failIfNotExist === void 0) { failIfNotExist = false; }
        return Model.readJson('package.json', failIfNotExist);
    };
    Model.readPomXml = function (failIfNotExist) {
        if (failIfNotExist === void 0) { failIfNotExist = false; }
        return Model.readXml('pom.xml', 'utf-8', failIfNotExist);
    };
    Model.readJson = function (fileName, failIfNotExist) {
        if (failIfNotExist === void 0) { failIfNotExist = false; }
        return new Promise(function (resolve, reject) {
            try {
                var data = require(path.resolve(fileName));
                // console.info(fileName, data);
                resolve(data);
            }
            catch (err) {
                if (failIfNotExist) {
                    reject(fileName + ' does not exist');
                }
                else {
                    resolve(null);
                }
            }
        });
    };
    Model.writeJson = function (fileName, data) {
        console.info('writing to', fileName, JSON.stringify(data));
        return Model.writeFile(fileName, JSON.stringify(data));
    };
    Model.readYaml = function (fileName, encoding, failIfNotExist) {
        if (encoding === void 0) { encoding = 'utf8'; }
        if (failIfNotExist === void 0) { failIfNotExist = false; }
        return Model.readFile(fileName, encoding, failIfNotExist).then(function (data) {
            if (data !== null) {
                data = yaml.safeLoad(data);
            }
            return data;
        });
    };
    Model.writeYaml = function (fileName, data) {
        // console.info('saving to ', fileName, data);
        return Model.writeFile(fileName, yaml.safeDump(data));
    };
    Model.readXml = function (fileName, encoding, failIfNotExist) {
        if (encoding === void 0) { encoding = 'utf8'; }
        if (failIfNotExist === void 0) { failIfNotExist = false; }
        var convert = require('xml-js');
        return Model.readFile(fileName, encoding, failIfNotExist).then(function (data) {
            return convert.xml2js(data);
        });
    };
    Model.writeXml = function (fileName, data) {
        var convert = require('xml-js');
        return Model.writeFile(fileName, convert.js2xml(data));
    };
    Model.writeFile = function (fileName, data, options) {
        return new Promise(function (resolve, reject) {
            if (fileName[0] === '~') {
                fileName = path.join(process.env.HOME, fileName.slice(1));
            }
            require('mkdirp')(path.dirname(fileName), function (err) {
                if (err) {
                    console.error('failed to create directory:', err);
                    reject(err);
                }
                else {
                    fs.writeFile(fileName, data, options, function (err) {
                        if (err) {
                            console.error('failed to write file:', err);
                            reject(err);
                        }
                        else {
                            // console.info('wrote file:', fileName);
                            resolve();
                        }
                    });
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
    Model.readFile = function (fileName, encoding, failIfNotExist) {
        return new Promise(function (resolve, reject) {
            if (fileName[0] === '~') {
                fileName = path.join(process.env.HOME, fileName.slice(1));
            }
            // console.info('loading', fileName);
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
Model.model = new RepoConfig();
exports.Model = Model;
//# sourceMappingURL=model.js.map