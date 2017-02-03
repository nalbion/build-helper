var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');


export class Model {
    private model: any;

    load() {
        return this.readYaml('build-helper.yml', 'utf8', false).then((data) => {
            if (data != null) {
                this.model = data;
            } else {
                return this.readPackageJson().then((data) => {
                    if (data != null) {
                        this.model = data;
                    } else {
                        return this.readPomXml().then((data) => {
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

    readPackageJson(failIfNotExist = false) {
        return this.readJson('package.json', failIfNotExist);
    }

    readPomXml(failIfNotExist = false) {
       return this.readXml('pom.xml', failIfNotExist);
    }

    readJson(fileName: string, failIfNotExist = false) {
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

    writeJson(fileName: string, data: any) {
        return this.writeFile(fileName, JSON.stringify(data));
    }

    readYaml(fileName: string, encoding = 'utf8', failIfNotExist = false) {
        return this.readFile(fileName, encoding, failIfNotExist).then((data) => {
            if (data !== null) {
                data = yaml.safeLoad(data);
            }
            return data;
        })
    }

    writeYaml(fileName: string, data: any) {
        return this.writeFile(fileName, yaml.safeDump(data));
    }

    readXml(fileName: string, encoding = 'utf8', failIfNotExist = false) {
        var convert = require('xml-js');
        return readFile(fileName, encoding, failIfNotExist).then((data) => {
            return convert.xml2js(data);
        });
    }

    writeXml(fileName: string, data: any) {
        var convert = require('xml-js');
        return this.writeFile(fileName, convert.js2xml(data));
    }

    writeFile(fileName: string, data: string|Buffer, options?: any): Promise.IThenable<void> {
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
    readFile(fileName: string, encoding?: string, failIfNotExist?: boolean): Promise.IThenable<string|Buffer> {
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
