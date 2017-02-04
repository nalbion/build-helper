import {Detector} from './detector';

export class BuildDetector extends Detector {
    /** pom.xml, Makefile, gulpfile.js... */
    buildFile: string;
    data: any = {};

    scanFiles(files: string[]) {
        return Promise.resolve(null);
    }
}
