#!/usr/bin/env node
'use strict';
// var processExit = require('../lib/term').term.processExit;
// var processExit = require('terminal-kit').terminal.processExit;
var processExit = process.exit;

require('../lib/index.js')().then(function() {
    processExit(0);
}, function (err) {
    console.error(err);
    processExit(1);
});
