import {Detector} from './detector';

/** Detects version control system */
export class ScmDetector extends Detector {
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