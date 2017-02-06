var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

export const BUILD_HELPER_CONFIG = 'build-helper.yml';
export const BUILD_HELPER_GLOBAL_CONFIG = '~/.' + BUILD_HELPER_CONFIG;

export interface TeamConfig {
    configRepo?: string;
    configBranch?: string;
    /** http://docs.shippable.com/pipelines/gettingStarted/#sync-repository */
    syncRepo?: string;
}

/** stored at ~/.build-helper.yml */
export interface GlobalConfig {
    /** Mapped by team SCM URL compoent - eg 'github.com/my-team' */
    teams?: {[teamUrl: string]: TeamConfig};
}

export interface RepoConfig {
    /** eg 'github.com/my-team' */
    team?: string;
}


export class Model {
    private static model: RepoConfig = {};

    static loadGlobalConfig(): Promise<GlobalConfig> {
        return Model.readYaml(BUILD_HELPER_GLOBAL_CONFIG, 'utf8', false);
    }

    static loadRepoConfig(globalConfig?: GlobalConfig): Promise<RepoConfig> {
        return Model.readYaml(BUILD_HELPER_CONFIG, 'utf8', false).then((data) => {
            if (data != null) {
                Model.model = data;
                return data;
            } else {
                return Model.readPackageJson().then((data) => {
                    if (data != null) {
                        Model.model = data;
                        data;
                    } else {
                        return Model.readPomXml().then((data) => {
                            if (data != null) {
                                Model.model = data;
                            }
                            return data;
                        })
                    }
                })
            }
        })
    }

    static saveGlobalConfig(globalConfig: GlobalConfig) {
        // console.info('saving global config:', globalConfig);
        return Model.writeYaml(BUILD_HELPER_GLOBAL_CONFIG, globalConfig);
    }

    static saveRepoConfig() {
        return Model.writeYaml(BUILD_HELPER_CONFIG, Model.model);
    }

    static load() {
        return Model.loadGlobalConfig().then(Model.loadRepoConfig);
    }

    static save() {
        return Model.saveGlobalConfig().then(Model.saveRepoConfig);
    }

    // static setCloud(cloud: string) {
    //     Model.model.cloud = cloud;
    // }

    static setTeam(team: string) {
        Model.model.team = team;
    }

    static readPackageJson(failIfNotExist = false) {
        return Model.readJson('package.json', failIfNotExist);
    }

    static readPomXml(failIfNotExist = false) {
       return Model.readXml('pom.xml', 'utf-8', failIfNotExist);
    }

    static readJson(fileName: string, failIfNotExist = false) {
        return new Promise((resolve, reject) => {
            fs.exists(fileName, (exists) => {
                if (!exists) {
                    if (failIfNotExist) {
                        reject(fileName + ' does not exist');
                    } else {
                        resolve(null);
                    }
                } else {
                    var data = require(path.resolve(fileName));
                    // console.info(fileName, data);
                    resolve(data);
                }
            })
        })
    }

    static writeJson(fileName: string, data: any) {
        return Model.writeFile(fileName, JSON.stringify(data));
    }

    static readYaml(fileName: string, encoding: string = 'utf8', failIfNotExist = false): Promise<any> {
        return Model.readFile(fileName, encoding, failIfNotExist).then((data: string) => {
            if (data !== null) {
                data = yaml.safeLoad(data);
            }
            return <any>data;
        })
    }

    static writeYaml(fileName: string, data: any) {
        // console.info('saving to ', fileName, data);
        return Model.writeFile(fileName, yaml.safeDump(data));
    }

    static readXml(fileName: string, encoding: string = 'utf8', failIfNotExist = false): Promise<any> {
        var convert = require('xml-js');
        return Model.readFile(fileName, encoding, failIfNotExist).then((data) => {
            return convert.xml2js(data);
        });
    }

    static writeXml(fileName: string, data: any) {
        var convert = require('xml-js');
        return Model.writeFile(fileName, convert.js2xml(data));
    }

    static writeFile(fileName: string, data: string|Buffer, options?: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (fileName[0] === '~') {
                fileName = path.join(process.env.HOME, fileName.slice(1));
            }

            fs.writeFile(fileName, data, options, (err) => {
                if (err) {
                    console.info('failed to write file:', err);
                    reject(err);
                } else {
                    // console.info('wrote file:', fileName);
                    resolve();
                }
            })
        })
    }

    /**
     * @param fileName
     * @param encoding
     * @param failIfNotExist - defaults to true
     * @returns {Promise} - resolves with String if encoding specified, else Buffer
     */
    static readFile(fileName: string, encoding?: string, failIfNotExist?: boolean): Promise<string|Buffer> {
        return new Promise((resolve, reject) => {
            if (fileName[0] === '~') {
                fileName = path.join(process.env.HOME, fileName.slice(1));
            }

            // console.info('loading', fileName);
            fs.readFile(fileName, {encoding: encoding}, (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT' && failIfNotExist === false) {
                        resolve(null);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(data);
                }
            })
        })
    }
}
