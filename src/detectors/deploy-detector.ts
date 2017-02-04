import {Detector} from './detector';

export class DeployDetector extends Detector {
    data: any = {};

    scanFiles(files: string[]) {
        return Promise.resolve(null);
    }
}