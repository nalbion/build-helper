"use strict";
var model_1 = require("./model");
var detector_manager_1 = require("./detectors/detector-manager");
function run() {
    var model = new model_1.Model(), detectorManager = new detector_manager_1.DetectorManager(model), 
    /** init, set, version, deploy, rollback, connect, disconnect/kill, bot */
    cmd = process.argv[2] || 'help';
    switch (cmd) {
        case 'help':
            require('./commands/help')();
            break;
        case 'init':
            require('./commands/init')();
            break;
        case 'set':
            require('./commands/set')();
            break;
        case 'version':
            require('./commands/version')();
            break;
        case 'deploy':
            require('./commands/deploy')();
            break;
        case 'connect':
            require('./commands/connect')();
            break;
        case 'disconnect':
        case 'kill':
            require('./commands/disconnect')();
            break;
        case 'bot':
            require('./commands/bot')();
            break;
        default:
            console.info('Sorry, "' + cmd + '" is not a support command');
            require('./commands/help')();
    }
    /*model.load().then(() => {
        detectorManager.load().then(() => {
            console.info('model:', model);

            //
        });
    });*/
}
(module).exports = run;
//# sourceMappingURL=index.js.map