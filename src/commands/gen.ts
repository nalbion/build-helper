import {Model, GlobalConfig, TeamConfig, RepoConfig, BUILD_HELPER_CACHE} from '../model';

var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
require('../utils/handlebars-helpers');

/**
 * `bh gen <templateName>`
 */
(module).exports = function() {
    var templateName = process.argv[3];

    return Model.loadRepoConfig().then((repoConfig) => {
        return Model.loadGlobalConfig().then((globalConfig) => {
            var teamUrl = repoConfig.project.team;
            var teamConfig = globalConfig.teams[teamUrl];
            return requireTemplate(templateName)
                .catch((err) => {
                    // console.info('failed to require pre-cached template:', err);
                    return loadTemplate(teamUrl, teamConfig.configRepo, teamConfig.configBranch, templateName);
                });
        }).then((template) => {
            console.info('Writing', templateName);
            return Model.writeFile(templateName, template(repoConfig));
        });
    });
};

/**
 * @param templateName  eg: shippable.yml
 *
 * @returns {Promise<TResult>}
 */
function requireTemplate(templateName: string): Promise<Function> {
    // look in local cache
    var templatePath = './' + BUILD_HELPER_CACHE + 'templates/' + templateName;

    // TODO: look in 'node_modules/' + teamConfigRepo + '/.build-helper/templates'
    return new Promise((resolve, reject) => {
        fs.exists(templatePath + '.js', (exists) => {
            if (exists) {
                // console.info('found pre-compiled template:', templatePath);
                try {
                    var templateSpec = require(path.resolve(templatePath));
                    var precompiled = Handlebars.template(templateSpec);
                    resolve(precompiled);
                } catch (err) {
                    reject(err);
                }
            } else {
                reject('pre-compiled template not found: ' + templatePath);
            }
        });
    });
}

/**
 * @param teamUrl       eg: bitbucket.org/dubbiebee
 * @param configRepo    eg: deploy-dubbie-bee
 * @param branch        eg: develop
 * @param templateName  eg: shippable.yml
 *
 * @returns {Promise<TResult>}
 */
function loadTemplate(teamUrl: string, configRepo: string, branch: string, templateName: string): Promise<Function> {
    var templatePath = BUILD_HELPER_CACHE + 'templates/' + templateName;

    // look the team config repo
    var hostName = teamUrl.substr(0, teamUrl.indexOf('/')),
        auth = getAuthorization(hostName),
        options = {
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

    return sendHttpsGet(options)
        .then((template) => {
            // console.info('downloaded template:', template);
            var templateSpec = Handlebars.precompile(template);
            return Model.writeFile(templatePath + '.js', 'module.exports = ' + templateSpec)
                .then(() => {
                    return Handlebars.compile(template);
                });
        })
        .catch((err) => {
            if (err == 404) {
                throw 'Sorry, unable to find template ' + templateName;
            } else {
                console.error('unexpected error:', err);
            }
        });
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

            var body = [];
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