"use strict";
var model_1 = require("../model");
var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
require('../utils/handlebars-helpers');
/**
 * `build-helper gen <templateName>`
 */
(module).exports = function (templateName) {
    templateName = fixTemplateName(templateName);
    var outputName = determineOutputName(templateName);
    return model_1.Model.loadRepoConfig().then(function (repoConfig) {
        return model_1.Model.loadGlobalConfig().then(function (globalConfig) {
            var teamUrl = repoConfig.project.team;
            var teamConfig = globalConfig.teams[teamUrl];
            return loadPrecompiledTemplate(templateName)
                .catch(function () {
                // console.info('failed to require pre-cached template:', err);
                return loadTemplate(teamUrl, teamConfig.configRepo, teamConfig.configBranch, templateName);
            });
        }).then(function (template) {
            console.info('Writing', outputName);
            return model_1.Model.writeFile(outputName, template(repoConfig)).then(function () {
                if (outputName.startsWith('.git/hooks/')) {
                    return new Promise(function (resolve, reject) {
                        fs.chmod(outputName, 493, function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    });
                }
            });
        });
    });
};
function fixTemplateName(templateName) {
    switch (templateName) {
        case 'pre-commit':
            return 'git/hooks/' + templateName;
        case 'gitignore':
        case 'editorconfig':
            return '.' + templateName;
        case 'bitbucket':
            templateName += '-pipelines';
        case 'bitbucket-pipelines':
        case 'shippable':
            return templateName + '.yml';
        default:
            return templateName;
    }
}
function determineOutputName(templateName) {
    if (templateName.startsWith('git/hooks')) {
        return '.' + templateName;
    }
    return templateName;
}
/**
 * @param templateName  eg: shippable.yml
 *
 * @returns {Promise<Function>}
 */
function loadPrecompiledTemplate(templateName) {
    // look in local cache
    var templatePath = './' + model_1.BUILD_HELPER_CACHE + 'templates/' + templateName;
    // TODO: look in 'node_modules/' + teamConfigRepo + '/.build-helper/templates'
    return new Promise(function (resolve, reject) {
        // console.info('found pre-compiled template:', templatePath);
        try {
            var templateSpec = require(path.resolve(templatePath));
            var precompiled = Handlebars.template(templateSpec);
            resolve(precompiled);
        }
        catch (err) {
            reject('pre-compiled template not found: ' + templatePath);
        }
    });
}
/**
 * @param teamUrl       eg: bitbucket.org/dubbiebee
 * @param configRepo    eg: deploy-dubbie-bee
 * @param branch        eg: develop
 * @param templateName  eg: shippable.yml
 *
 * @returns {Promise<Function>}
 */
function loadTemplate(teamUrl, configRepo, branch, templateName) {
    var templatePath = model_1.BUILD_HELPER_CACHE + 'templates/' + templateName;
    return loadLocalTemplate(configRepo, templatePath).then(function (template) {
        if (template) {
            return template;
        }
        return loadRemoteTemplate(teamUrl, configRepo, branch, templateName);
    }).then(function (template) {
        // console.info('downloaded template:', template);
        var templateSpec = Handlebars.precompile(template);
        return model_1.Model.writeFile(templatePath + '.js', 'module.exports = ' + templateSpec)
            .then(function () {
            console.info('compiling template');
            return Handlebars.compile(template);
        });
    }).catch(function (err) {
        if (err == 404) {
            throw 'Sorry, unable to find template ' + templateName;
        }
        else {
            console.error('unexpected error:', err);
            throw err;
        }
    });
}
function loadLocalTemplate(configRepo, templatePath) {
    var localPath = '../' + configRepo + '/' + templatePath + '.hbs';
    return new Promise(function (resolve) {
        console.info('loading local template:', localPath);
        model_1.Model.readFile(localPath, 'utf8').then(resolve, function () { resolve(null); });
    });
}
function loadRemoteTemplate(teamUrl, configRepo, branch, templatePath) {
    // look the team config repo
    var hostName = teamUrl.substr(0, teamUrl.indexOf('/')), auth = getAuthorization(hostName), options = {
        hostname: hostName,
        headers: {
            'cache-control': 'private, no-cache, no-store, must-revalidate, max-age=0',
            pragma: 'no-cache'
        }
    };
    if (hostName == 'bitbucket.org') {
        options.path = teamUrl.substr(13) + '/' + configRepo + '/raw/' + branch + '/' + templatePath + '.hbs';
    }
    else if (hostName == 'github.com') {
        // https://raw.githubusercontent.com/nalbion/angular2-ts-demo/master/gulpfile.js
        options.hostname = 'raw.githubusercontent.com';
        options.path = teamUrl.substr(11) + '/' + branch + '/' + templatePath + '.hbs';
    }
    else {
        throw new Error('Don\'t know how to load templates from ' + teamUrl);
    }
    if (auth.password) {
        options.auth = auth.login + ':' + auth.password;
    }
    else {
        options.headers.Authorization = options.login;
    }
    console.info('loading remote template:', options.path);
    return sendHttpsGet(options);
}
function getAuthorization(hostName) {
    return require('netrc')()[hostName];
}
function sendHttpsGet(options) {
    var https = require('https');
    // console.info(options);
    return new Promise(function (resolve, reject) {
        https.get(options, function (res) {
            if (res.statusCode != 200) {
                console.log('statusCode:', res.statusCode);
                // console.log('headers:', res.headers);
                reject(res.statusCode);
            }
            var body = [];
            res.on('data', function (chunk) {
                body.push(chunk);
            }).on('end', function () {
                resolve(Buffer.concat(body).toString());
            });
        }).on('error', function (e) {
            reject(e);
        });
    });
}
//# sourceMappingURL=gen.js.map