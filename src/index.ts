
import {Model} from './model'
import {DetectorManager} from "./detectors/detector-manager";


function run() {
    var detectorManager = new DetectorManager(),
        /** init, set, version, deploy, rollback, connect, disconnect/kill, bot */
        cmd = process.argv[2] || 'help',
        handler;

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
        case 'version':
            handler = require('./commands/version');
            break;
        case 'deploy':
            handler = require('./commands/deploy');
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

    return handler().then((result) => {
        console.info('result:', result);
        process.exit() ;
    }).catch((err) => {
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
