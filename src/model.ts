var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');


export class Model {
    private model: any;

    load() {
        return Model.readYaml('build-helper.yml', 'utf8', false).then((data) => {
            if (data != null) {
                this.model = data;
            } else {
                return Model.readPackageJson().then((data) => {
                    if (data != null) {
                        this.model = data;
                    } else {
                        return Model.readPomXml().then((data) => {
                            if (data != null) {
                                this.model = data;
                            }
                        })
                    }
                })
            }
        })
    }

    setCloud(cloud: string) {
        this.model.cloud = cloud;
    }

    static readPackageJson(failIfNotExist = false) {
        return Model.readJson('package.json', failIfNotExist);
    }

    static readPomXml(failIfNotExist = false) {
       return Model.readXml('pom.xml', failIfNotExist);
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
                    console.info(fileName, data);
                    resolve(data);
                }
            })
        })
    }

    static writeJson(fileName: string, data: any) {
        return Model.writeFile(fileName, JSON.stringify(data));
    }

    static readYaml(fileName: string, encoding = 'utf8', failIfNotExist = false) {
        return Model.readFile(fileName, encoding, failIfNotExist).then((data) => {
            if (data !== null) {
                data = yaml.safeLoad(data);
            }
            return data;
        })
    }

    static writeYaml(fileName: string, data: any) {
        return Model.writeFile(fileName, yaml.safeDump(data));
    }

    static readXml(fileName: string, encoding = 'utf8', failIfNotExist = false) {
        var convert = require('xml-js');
        return Model.readFile(fileName, encoding, failIfNotExist).then((data) => {
            return convert.xml2js(data);
        });
    }

    static writeXml(fileName: string, data: any) {
        var convert = require('xml-js');
        return Model.writeFile(fileName, convert.js2xml(data));
    }

    static writeFile(fileName: string, data: string|Buffer, options?: any): Promise.IThenable<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(fileName, data, options, (err) => {
                if (err) {
                    reject(err);
                } else {
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
    static readFile(fileName: string, encoding?: string, failIfNotExist?: boolean): Promise.IThenable<string|Buffer> {
        return new Promise((resolve, reject) => {
            console.info('loading', fileName);
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
