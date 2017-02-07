import {Model, GlobalConfig, TeamConfig, RepoConfig} from '../model';
import {term, buildHelperBanner} from '../term';

var fs = require('fs');
var path = require('path');

(module).exports = function() {
    return buildHelperBanner().then((bhPackage) => {
        return Model.loadGlobalConfig().then((globalConfig) => {
            if (!globalConfig) {
                // term('The responses you provide to the following questions will be stored in ' + BUILD_HELPER_GLOBAL_CONFIG);
                globalConfig = {};
            }

            return Model.loadRepoConfig().then((repoConfig) => {
                if (!repoConfig) {
                    repoConfig = new RepoConfig();
                }
                return initTeam(globalConfig, repoConfig);
            }).then((repoConfig: RepoConfig) => {
                return Model.saveGlobalConfig(globalConfig).then(Model.saveRepoConfig);
            });
        });
    }).catch((err) => {
        term.red('\n' + err + '\n');
        throw 'init failed'
    });
};

function initTeam(globalConfig: GlobalConfig, repoConfig?: RepoConfig): Promise<RepoConfig> {
    return promptForTeamUrl(globalConfig, repoConfig).then((teamUrl) => {
        Model.setTeam(teamUrl);

        if (!globalConfig.teams[teamUrl]) {
            globalConfig.teams[teamUrl] = {};
        }
        var teamConfig = globalConfig.teams[teamUrl];

        // All sub-functions should accept `teamConfig` as the last parameter so that the promises can be chained
        return initTeamConfigRepo(teamUrl, teamConfig)  // .then(initHttpsOrSsh)
                .then(initTeamConfigBranch);
    }).then(() => {
        return repoConfig;
    })
}

function initTeamConfigRepo(teamUrl: string, teamConfig: TeamConfig) {
    var prefix = 'https://' + teamUrl + '/',
        label = 'Team build-helper config repo: ' + prefix;

    if (teamConfig.configRepo) {
        console.info(label + teamConfig.configRepo);
        return Promise.resolve(teamConfig);
    } else {
        return new Promise((resolve, reject) => {
            term.bold(label);
            term.inputField({}, (err, input: string) => {
                if (err) {
                    reject(err);
                } else if (input.length == 0) {
                    reject('invalid team config repo URL');
                } else {
                    term('\n');
                    teamConfig.configRepo = input;
                    resolve(teamConfig);
                }
            })
        });
    }
}

function initTeamConfigBranch(teamConfig: TeamConfig) {
    var label = 'Team build-helper config branch: ';

    if (teamConfig.configBranch) {
        console.info(label + teamConfig.configBranch);
        return Promise.resolve(teamConfig);
    } else {
        return new Promise((resolve, reject) => {
            term.bold(label);
            term.inputField({
                autoComplete: [
                    'develop',
                    'master',
                    'main'
                ]
            }, (err, input: string) => {
                if (err) {
                    reject(err);
                } else if (input.length == 0) {
                    reject('invalid team config repo branch');
                } else {
                    term('\n');
                    teamConfig.configBranch = input;
                    resolve(teamConfig);
                }
            })
        });
    }
}

function guessTeamUrl(globalConfig: GlobalConfig, workingDir: string): string {
    var teamUrls = globalConfig.teams ? Object.keys(globalConfig.teams): null;
    var bestGuess = teamUrls ? teamUrls[0] : null;

    // Go projects will provide the team url component we need
    // Attempt to extract the team URL from the working dir
    var gopath = process.env.GOPATH;
    if (gopath) {
        gopath = gopath.split(path.delimiter);
        let i = gopath.length;
        while (i-- != 0) {
            let pathi = gopath[i];
            if (pathi[0] === '~') {
                pathi = path.join(process.env.HOME, pathi.slice(1));
            }
            pathi += '/src/';
            if (workingDir.startsWith(pathi)) {
                return workingDir.substring(pathi.length, workingDir.lastIndexOf('/'));
            }
        }
    }

    // Not found in GOPATH, does one of the existing team URLs exist in the workingDir?
    if (teamUrls) {
        let i = teamUrls.length;
        while (i-- != 0) {
            if (workingDir.includes(teamUrls[i])) {
                return teamUrls[i];
            }
        }
    }

    // Do any known prefixes exist in the workingDir?
    let j = TEAM_URL_SUGGESTIONS.length;
    while (j-- != 0) {
        let start = workingDir.indexOf(TEAM_URL_SUGGESTIONS[j]);
        if (start >= 0) {
            return workingDir.substring(start, workingDir.lastIndexOf('/'));
        }
    }

    return bestGuess;
}

/**
 * User can press TAB for auto completion and UP/DOWN for team urls already in global config
 *
 * @param globalConfig
 * @returns {Promise} resolves with the team URL path, eg: 'github.com/my-team'
 */
function promptForTeamUrl(globalConfig: GlobalConfig, repoConfig?: RepoConfig): Promise<string> {
    var label = 'Team version control URL: https://';

    if (repoConfig.project.team) {
        console.info(label + repoConfig.project.team);
        return Promise.resolve(repoConfig.project.team);
    }

    var guess = guessTeamUrl(globalConfig, process.env.PWD || process.env.CWD);

    if (guess == null) {
        term.brightBlack.bgYellow('  TIP: ')
            .brightBlack.bgYellow.bold('https://golang.org/doc/code.html#Workspaces')
            .brightBlack.bgYellow('provides a good convention for project paths ');
    }

    if (!globalConfig.teams || Object.keys(globalConfig.teams).length == 0) {
        var example = guess ? guess : 'github.com/your-team';
        console.info('You need to create a build-helper config repo to store default config and shared recipes etc.');
        term('Let\'s start with your team version control URL prefix - eg: ').bold('https://' + example + '\n');
        term.brightBlack.bgYellow('  press ')
            .brightBlack.bgYellow.bold('TAB')
            .brightBlack.bgYellow(' for autocompletion  \n');
        globalConfig.teams = {};
    } else {
        term.brightBlack.bgYellow('  press ')
            .brightBlack.bgYellow.bold('TAB')
            .brightBlack.bgYellow(' for autocompletion or ')
            .brightBlack.bgYellow.bold('UP')
            .brightBlack.bgYellow(' for your existing teams');
        if (guess) {
            term.brightBlack.bgYellow(' or ')
                .brightBlack.bgYellow.bold('ENTER')
                .brightBlack.bgYellow(' for ')
                .brightBlack.bgYellow.bold(guess);
        }
        term('  \n');
    }
    term.defaultColor.bgDefaultColor().styleReset();

    return new Promise<string>((resolve, reject) => {
        term.bold(label);
        term.inputField({
            history: Object.keys(globalConfig.teams),
            autoComplete: createAutoCompleter(TEAM_URL_SUGGESTIONS, guess),
            autoCompleteMenu: true
        }, (err, input: string) => {
            if (err) {
                reject(err);
            } else if (input.length == 0) {
                if (guess == null) {
                    reject('invalid team URL');
                } else {
                    term(guess + '\n');
                    resolve(guess);
                }
            } else {
                term('\n');
                resolve(input);
            }
        })
    });
}

const TEAM_URL_SUGGESTIONS = [
    'github.com/',
    'bitbucket.org/',
    'git-codecommit.us-east-1.amazonaws.com/v1/repos/',
    'git-codecommit.us-east-2.amazonaws.com/v1/repos/',
    'git-codecommit.us-west-2.amazonaws.com/v1/repos/',
    'git-codecommit.eu-west-1.amazonaws.com/v1/repos/',
    'source.developers.google.com/p/'
];

function createAutoCompleter(suggestions: string[], guess?: string): (text: string) => string[] | boolean {
    return (text: string) => {
        var results: string[] = [];
        if (guess) {
            results.push(guess);
        }

        // add any that start with the text
        for (let i = 0; i < suggestions.length; i++) {
            if (suggestions[i].startsWith(text)) {
                results.push(suggestions[i]);
            }
        }
        // add any extra suggestions which contain the text, but are not already included
        for (let i = 0; i < suggestions.length; i++) {
            if (suggestions[i].includes(text) && !results.includes(suggestions[i])) {
                results.push(suggestions[i]);
            }
        }
        return results.length ? results : false;
    }
}
