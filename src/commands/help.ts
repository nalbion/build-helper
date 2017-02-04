(module).exports = function() {
    var marked = require('marked');
    var TerminalRenderer = require('marked-terminal');

    marked.setOptions({
        // Define custom renderer
        renderer: new TerminalRenderer({
            /*firstHeading: function (text) {
                return '*** ' + text;
            }*/
        }),
    });

    var fs = require('fs');
    var path = require('path');
    var readme = path.resolve(__dirname, '../../README.md');
    require('../model').Model.readFile(readme, 'utf8').then((data) => {
        console.log(marked(data));
    }, (err) => {
        console.info('Sorry, failed to load the README');
    })
};
