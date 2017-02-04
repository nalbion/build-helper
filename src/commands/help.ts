import {Model} from '../model';
import {buildHelperBanner} from '../term';

var fs = require('fs');
var path = require('path');
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');

(module).exports = function() {
    buildHelperBanner().then(() => {
        marked.setOptions({
            // Define custom renderer
            renderer: new TerminalRenderer({
                /*firstHeading: function (text) {
                 return '*** ' + text;
                 }*/
            }),
        });

        Model.readFile(path.resolve(__dirname, '../../README.md'), 'utf8').then((data) => {
            console.log(marked(data));
        }, () => {
            console.info('Sorry, failed to load the README');
        })
    })
};
