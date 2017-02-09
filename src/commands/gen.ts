import {Model, GlobalConfig, TeamConfig, RepoConfig, BUILD_HELPER_CACHE} from '../model';

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
require('../utils/handlebars-helpers');

/**
 * `build-helper gen <templateName>`
 */
(module).exports = function(templateName: string) {
    templateName = fixTemplateName(templateName);
    var outputName = determineOutputName(templateName);

    return Model.loadRepoConfig().then((repoConfig) => {
        return Model.loadGlobalConfig().then((globalConfig) => {
            const teamUrl = repoConfig.project.team;
            const teamConfig = globalConfig.teams[teamUrl];
            return loadPrecompiledTemplate(templateName)
                .catch(() => {
                    // console.info('failed to require pre-cached template:', err);
                    return loadTemplate(teamUrl, teamConfig.configRepo, teamConfig.configBranch, templateName);
                });
        }).then((template) => {
            console.info('Writing', outputName);
            return Model.writeFile(outputName, template(repoConfig)).then(() => {
                if (outputName.startsWith('.git/hooks/')) {
                    return new Promise((resolve, reject) => {
                        fs.chmod(outputName, 493, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        })
                    })
                }
            });
        });
    });
};

function fixTemplateName(templateName) {
    switch(templateName) {
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
function loadPrecompiledTemplate(templateName: string): Promise<Function> {
    // look in local cache
    const templatePath = './' + BUILD_HELPER_CACHE + 'templates/' + templateName;

    // TODO: look in 'node_modules/' + teamConfigRepo + '/.build-helper/templates'
    return new Promise((resolve, reject) => {
        // console.info('found pre-compiled template:', templatePath);
        try {
            const templateSpec = require(path.resolve(templatePath));
            const precompiled = Handlebars.template(templateSpec);
            resolve(precompiled);
        } catch (err) {
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
function loadTemplate(teamUrl: string, configRepo: string, branch: string, templateName: string): Promise<Function> {
    const templatePath = BUILD_HELPER_CACHE + 'templates/' + templateName;

    return loadLocalTemplate(configRepo, templatePath).then((template) => {
        if (template) {
            return template;
        }
        return loadRemoteTemplate(teamUrl, configRepo, branch, templateName);
    }).then((template: string) => {
        // console.info('downloaded template:', template);
        const templateSpec = Handlebars.precompile(template);
        return Model.writeFile(templatePath + '.js', 'module.exports = ' + templateSpec)
            .then(() => {
                console.info('compiling template');
                return Handlebars.compile(template);
            });
    }).catch((err) => {
        if (err == 404) {
            throw 'Sorry, unable to find template ' + templateName;
        } else {
            console.error('unexpected error:', err);
            throw err;
        }
    });
}

function loadLocalTemplate(configRepo: string, templatePath: string): Promise<string> {
    const localPath = '../' + configRepo + '/' + templatePath + '.hbs';

    return new Promise(resolve => {
        console.info('loading local template:', localPath);
        Model.readFile(localPath, 'utf8').then(resolve, () => {resolve(null)});
    });
}

function loadRemoteTemplate(teamUrl: string, configRepo: string, branch: string, templatePath: string): Promise<string> {
    // look the team config repo
    const hostName = teamUrl.substr(0, teamUrl.indexOf('/')),
        auth = getAuthorization(hostName),
        options: any = {
            hostname: hostName,
            headers: {
                'cache-control': 'private, no-cache, no-store, must-revalidate, max-age=0',
                pragma: 'no-cache'
            }
        };
    if (hostName == 'bitbucket.org') {
        options.path = teamUrl.substr(13) + '/' + configRepo + '/raw/' + branch + '/' + templatePath + '.hbs';
    } else if (hostName == 'github.com') {
        // https://raw.githubusercontent.com/nalbion/angular2-ts-demo/master/gulpfile.js
        options.hostname = 'raw.githubusercontent.com';
        options.path = teamUrl.substr(11) + '/' + branch + '/' + templatePath + '.hbs';
    } else {
        throw new Error('Don\'t know how to load templates from ' + teamUrl);
    }
    if (auth.password) {
        options.auth = auth.login + ':' + auth.password;
    } else {
        options.headers.Authorization = options.login;
    }

    console.info('loading remote template:', options.path);
    return sendHttpsGet(options);
}

function getAuthorization(hostName: string): {login: string, password?: string} {
    return require('netrc')()[hostName];
}

function sendHttpsGet(options: {hostname: string, path?: string, auth?: string, headers?: any, method?; string}): Promise<string> {
    const https = require('https');
    // console.info(options);
    return new Promise((resolve, reject) => {
        https.get(options, (res) => {
            if (res.statusCode != 200) {
                console.log('statusCode:', res.statusCode);
                // console.log('headers:', res.headers);
                reject(res.statusCode);
            }

            const body = [];
            res.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', function() {
                resolve(Buffer.concat(body).toString());
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
}
