'use strict';

var is = {
  verbose: function verbose() {
    return process.argv.includes('--verbose') || process.argv.includes('-v');
  },
  quiet: function quiet() {
    return process.argv.includes('--quiet') || process.argv.includes('-q');
  },
  utf: function utf() {
    return !process.argv.includes('--no-utf');
  },
  interactiveMode: function interactiveMode() {
    return process.stdout.isTTY;
  }
};

module.exports = is;