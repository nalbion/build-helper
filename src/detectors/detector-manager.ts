import {BuildDetector} from './build-detector';
import {CiDetector} from './ci-detector';
import {CloudDetector} from './cloud-detector';
import {DeployDetector} from './deploy-detector';
import {LanguageDetector} from './language-detector';
import {ScmDetector} from './scm-detector';

var fs = require('fs');

export class DetectorManager {
    private build = new BuildDetector();
    private ci = new CiDetector();
    private cloud = new CloudDetector();
    private deploy = new DeployDetector();
    private language = new LanguageDetector();
    private scm = new ScmDetector();

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
