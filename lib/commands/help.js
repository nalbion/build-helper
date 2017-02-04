"use strict";
var model_1 = require("../model");
var term_1 = require("../term");
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');
(module).exports = function () {
    term_1.buildHelperBanner().then(function () {
        marked.setOptions({
            // Define custom renderer
            renderer: new TerminalRenderer({}),
        });
        model_1.Model.readFile(path.resolve(__dirname, '../../README.md'), 'utf8').then(function (data) {
            console.log(marked(data));
        }, function () {
            console.info('Sorry, failed to load the README');
        });
    });
};
//# sourceMappingURL=help.js.map