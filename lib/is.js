'use strict';

var is = {};

is.verbose = function () {
  return (process.argv.indexOf('--verbose') !== -1) || (process.argv.indexOf('-v') !== -1);
};

is.quiet = function () {
  return (process.argv.indexOf('--quiet') !== -1) || (process.argv.indexOf('-q') !== -1);
};

is.utf = function () {
  return (process.argv.indexOf('--no-utf') === -1);
};

module.exports = is;
