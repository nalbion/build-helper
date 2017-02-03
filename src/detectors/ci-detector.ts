import {Detector} from './detector';

export class CiDetector extends Detector {
    /** bitbucket-pipelines.yml, jenkinsfile */
    file: string;
    data: any = {};

    constructor(model: Model) {
        super(model);
    }

    scanFiles(files: string[]) {
        return Promise.resolve(null);
    }
}