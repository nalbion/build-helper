import {Model} from '../model';

(module).exports = function() {
    Model.readYaml('~/.build-helper.yml', 'utf8', false).then((globalConfig) => {
        console.info('globalConfig:', globalConfig);
    })
};
