"use strict";
var detector_manager_1 = require("./detectors/detector-manager");
require('source-map-support').install();
function run() {
    var detectorManager = new detector_manager_1.DetectorManager(), 
    /** init, set, genm, version, deploy, rollback, connect, disconnect/kill, bot */
    cmd = process.argv[2] || 'help', handler;
    switch (cmd) {
        case 'help':
            handler = require('./commands/help');
            break;
        case 'init':
            handler = require('./commands/init');
            break;
        case 'set':
            handler = require('./commands/set');
            break;
        case 'gen':
            handler = require('./commands/gen');
            break;
        case 'update':
            handler = require('./commands/update');
            break;
        case 'run':
            handler = require('./commands/run');
            break;
        case 'version':
            handler = require('./commands/version');
            break;
        case 'deploy':
            handler = require('./commands/deploy');
            break;
        case 'rollback':
            handler = require('./commands/rollback');
            break;
        case 'connect':
            handler = require('./commands/connect');
            break;
        case 'disconnect':
        case 'kill':
            handler = require('./commands/disconnect');
            break;
        case 'bot':
            handler = require('./commands/bot');
            break;
        default:
            console.info('Sorry, "' + cmd + '" is not a support command');
            handler = require('./commands/help');
    }
    return handler().then(function (result) {
        if (result) {
            console.info('result:', result);
        }
        process.exit();
    }).catch(function (err) {
        console.error(err);
    });
    /*Model.load().then(() => {
        detectorManager.load().then(() => {
            console.info('model:', model);

            //
        });
    });*/
}
(module).exports = run;
//# sourceMappingURL=index.js.map