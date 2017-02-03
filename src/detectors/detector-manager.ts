import {Model} from '../model';
import {BuildDetector} from './build-detector';
import {CiDetector} from './ci-detector';
import {CloudDetector} from './cloud-detector';
import {DeployDetector} from './deploy-detector';
import {LanguageDetector} from './language-detector';
import {ScmDetector} from './scm-detector';

var fs = require('fs');

export class DetectorManager {
    private build: BuildDetector;
    private ci: CiDetector;
    private cloud: CloudDetector;
    private deploy: DeployDetector;
    private language: LanguageDetector;
    private scm: ScmDetector;

    constructor(model: Model) {
        this.build = new BuildDetector(model);
        this.ci = new CiDetector(model);
        this.cloud = new CloudDetector(model);
        this.deploy = new DeployDetector(model);
        this.language = new LanguageDetector(model);
        this.scm = new ScmDetector(model);
    }

    load() {
        return new Promise((resolve, reject) => {
            fs.readdir('.', (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    console.info('files:', files);
                    resolve(Promise.all([
                        this.build.scanFiles(files),
                        this.ci.scanFiles(files),
                        this.cloud.scanFiles(files),
                        this.deploy.scanFiles(files),
                        this.language.scanFiles(files),
                        this.scm.scanFiles(files)
                    ]));
                }
            });
        });
    }
}
