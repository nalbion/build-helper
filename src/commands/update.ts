import {Model, GlobalConfig, TeamConfig, RepoConfig} from '../model';

var fs = require('fs');
var path = require('path');

/**
 * `bh update <template_name>`
 */
(module).exports = function() {
    var cmd = process.argv[2],      // `gen`, `update` or `run`
        recipe = process.argv[3];

    // look in 'node_modules/' + teamConfigRepo + '/.build-helper/templates'

    // then in 'https://' + teamUrl + '/' + teamConfigRepo + '/.build-helper/templates'


};
