import {Detector} from './detector';

export class DeployDetector extends Detector {
    data: any = {};

    constructor(model: Model) {
        super(model);
    }

    scanFiles(files: string[]) {
        return Promise.resolve(null);
    }
}