'use strict';

const is = {
  verbose () {
    return process.argv.includes('--verbose') || process.argv.includes('-v');
  },

  quiet () {
    return process.argv.includes('--quiet') || process.argv.includes('-q');
  },

  utf () {
    return !process.argv.includes('--no-utf');
  },

  interactiveMode () {
    return process.stdout.isTTY;
  }
};

module.exports = is;
