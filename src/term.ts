import {Model} from './model';

var path = require('path');
export var term = require('terminal-kit').terminal;

export function buildHelperBanner() {
    return Model.readJson(path.resolve(__dirname, '../package.json')).then((bhPackage: any) => {
        term.bold('========== ' + bhPackage.name + ' ' + bhPackage.version + ' ==========\n');
        return bhPackage;
    })
}
