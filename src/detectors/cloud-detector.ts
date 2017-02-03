import {Detector} from './detector';

export class CloudDetector extends Detector {
    /* AWS, Google, Heroku... */
    cloud?: string;
    data: any = {};

    constructor(model: Model) {
        super(model);
    }

    scanFiles(files: string[]) {
        let p = [],
            i = files.length;

        while (i-- != 0) {
            let fileName = files[i];
            switch (fileName) {
                case 'Procfile':
                    p.push(this.parseProcFile(fileName));
                    break;
            }
        }

        if (p.length == 0) {
            return Promise.resolve(null);
        } else {
            return Promise.all(p);
        }
    }

    parseProcFile(fileName: string) {
        return readFile(fileName, 'utf8').then((data) => {
            this.cloud = 'Heroku';
        });
    }
}