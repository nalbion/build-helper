"use strict";
var model_1 = require("../model");
(module).exports = function () {
    model_1.Model.readYaml('~/.build-helper.yml', 'utf8', false).then(function (globalConfig) {
        console.info('globalConfig:', globalConfig);
    });
};
//# sourceMappingURL=init.js.map