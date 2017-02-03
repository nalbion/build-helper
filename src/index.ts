
import {Model} from './model'
import {DetectorManager} from "./detectors/detector-manager";


function run() {
    var model = new Model(),
        detectorManager = new DetectorManager(model);

    model.load().then(() => {
        detectorManager.load().then(() => {
            console.info('model:', model);
        });
    });
}

(module).exports = run;
