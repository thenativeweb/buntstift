'use strict';

const is = {};

is.verbose = function () {
  return process.argv.includes('--verbose') || process.argv.includes('-v');
};

is.quiet = function () {
  return process.argv.includes('--quiet') || process.argv.includes('-q');
};

is.utf = function () {
  return !process.argv.includes('--no-utf');
};

module.exports = is;
