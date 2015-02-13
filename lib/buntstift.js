'use strict';

var util = require('util');

var chalk = require('chalk'),
    mark = require('markup-js'),
    Spinner = require('node-spinner');

var pad = require('./pad'),
    unicode = require('./unicode');

var isVerbose = function () {
  return (process.argv.indexOf('--verbose') !== -1) || (process.argv.indexOf('-v') !== -1);
};

var isQuiet = function () {
  return (process.argv.indexOf('--quiet') !== -1) || (process.argv.indexOf('-q') !== -1);
};

var buntstift = {};

buntstift.error = function (message, options) {
  options = options || {};

  /*eslint-disable no-console*/
  console.error(chalk.red.bold(util.format('%s %s', options.prefix || unicode.crossMark, mark.up(message + '', options))));
  /*eslint-enable no-console*/

  return buntstift;
};

buntstift.warn = function (message, options) {
  options = options || {};

  /*eslint-disable no-console*/
  console.error(chalk.yellow.bold(util.format('%s %s', options.prefix || unicode.rightPointingPointer, mark.up(message + '', options))));
  /*eslint-enable no-console*/

  return buntstift;
};

buntstift.success = function (message, options) {
  options = options || {};

  if (isQuiet()) {
    return buntstift;
  }

  /*eslint-disable no-console*/
  console.log(chalk.green.bold(util.format('%s %s', options.prefix || unicode.checkMark, mark.up(message + '', options))));
  /*eslint-enable no-console*/

  return buntstift;
};

buntstift.info = function (message, options) {
  options = options || {};

  if (isQuiet()) {
    return buntstift;
  }

  /*eslint-disable no-console*/
  console.log(chalk.white(util.format('%s %s', options.prefix || ' ', mark.up(message + '', options))));
  /*eslint-enable no-console*/

  return buntstift;
};

buntstift.verbose = function (message, options) {
  options = options || {};

  if (isQuiet() || !isVerbose()) {
    return buntstift;
  }

  /*eslint-disable no-console*/
  console.log(chalk.gray(util.format('%s %s', options.prefix || ' ', mark.up(message + '', options))));
  /*eslint-enable no-console*/

  return buntstift;
};

buntstift.list = function (message, options) {
  var width;

  options = options || {};
  options.indent = options.indent || 0;
  options.prefix = options.prefix || unicode.multiplicationDot;

  width = options.indent * (options.prefix.length + 1);
  options.prefix = new Array(width + 1).join(' ') + options.prefix;

  buntstift.info(message, options);

  return buntstift;
};

buntstift.table = function (rows) {
  var widths = [];

  if (!rows) {
    throw new Error('Rows are missing.');
  }

  rows.forEach(function (row) {
    row.forEach(function (value, columnIndex) {
      widths[columnIndex] = Math.max(widths[columnIndex] || 0, ('' + value).length);
    });
  });

  rows.forEach(function (row) {
    var line = [];

    if (row.length > 0) {
      row.forEach(function (value, columnIndex) {
        line.push(pad(value, widths[columnIndex]));
      });
    } else {
      widths.forEach(function (width) {
        line.push(new Array(width + 1).join(unicode.boxDrawingsLightHorizontal));
      });
    }

    buntstift.info(line.join('  '));
  });

  return buntstift;
};

buntstift.newLine = function () {
  if (isQuiet()) {
    return buntstift;
  }

  /*eslint-disable no-console*/
  console.log();
  /*eslint-enable no-console*/

  return buntstift;
};

buntstift.waitFor = function (worker) {
  var interval,
      spinner;

  if (!worker) {
    throw new Error('Worker is missing.');
  }

  if (isQuiet()) {
    return worker(function () {});
  }

  spinner = new Spinner();

  interval = setInterval(function () {
    process.stderr.write('\r' + spinner.next());
  }, 50);

  worker(function () {
    process.stderr.write('\r');
    clearInterval(interval);
  });
};

buntstift.exit = function (code) {
  /*eslint-disable no-process-exit*/
  process.exit(code || 0);
  /*eslint-enable no-process-exit*/
};

module.exports = buntstift;
