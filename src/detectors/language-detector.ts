import {Detector} from './detector';

export class LanguageDetector extends Detector {
    /** bitbucket-pipelines.yml, jenkinsfile */
    file: string;
    data: any = {};

    scanFiles(files: string[]) {
        return Promise.resolve(null);
    }
}