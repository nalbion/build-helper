import {Detector} from './detector';

export class BuildDetector extends Detector {
    /** pom.xml, Makefile, gulpfile.js... */
    buildFile: string;
    data: any = {};

    constructor(model: Model) {
        super(model);
    }

    scanFiles(files: string[]) {
        return Promise.resolve(null);
    }
}
