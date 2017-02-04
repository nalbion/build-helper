import {Model} from '../model';

export abstract class Detector {
    abstract scanFiles(files: string[]): Promise.IThenable;

    /**
     * @param fileName
     * @param encoding
     * @returns {Promise} - resolves with String if encoding specified, else Buffer
     */
    protected readFile(fileName: string, encoding?: string): Promise.IThenable<string|Buffer> {
        return Model.readFile(fileName, encoding);
    }
}