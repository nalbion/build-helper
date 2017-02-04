(module).exports = function () {
    var marked = require('marked');
    var TerminalRenderer = require('marked-terminal');
    marked.setOptions({
        // Define custom renderer
        renderer: new TerminalRenderer({}),
    });
    var fs = require('fs');
    var path = require('path');
    var readme = path.resolve(__dirname, '../../README.md');
    require('../model').Model.readFile(readme, 'utf8').then(function (data) {
        console.log(marked(data));
    }, function (err) {
        console.info('Sorry, failed to load the README');
    });
};
//# sourceMappingURL=help.js.map