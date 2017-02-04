"use strict";
var model_1 = require("./model");
var path = require('path');
exports.term = require('terminal-kit').terminal;
function buildHelperBanner() {
    return model_1.Model.readJson(path.resolve(__dirname, '../package.json'), 'utf8').then(function (bhPackage) {
        exports.term.bold('========== ' + bhPackage.name + ' ' + bhPackage.version + ' ==========\n');
        return bhPackage;
    });
}
exports.buildHelperBanner = buildHelperBanner;
//# sourceMappingURL=term.js.map