'use strict';

var util = require('util');

var chalk = require('chalk'),
    mark = require('markup-js'),
    Spinner = require('node-spinner');

var is = require('./is'),
    pad = require('./pad'),
    unicode = require('./unicode')[is.utf() ? 'utf8' : 'ascii'];

var buntstift = {};

buntstift.forceColor = function () {
  chalk.enabled = true;
};

buntstift.noColor = function () {
  chalk.enabled = false;
};

buntstift.forceUtf = function () {
  unicode = require('./unicode').utf8;
};

buntstift.noUtf = function () {
  unicode = require('./unicode').ascii;
};

buntstift.error = function (message, options) {
  options = options || {};

  /* eslint-disable no-console */
  console.error(chalk.red.bold(util.format('%s %s', options.prefix || unicode.crossMark, mark.up(message + '', options))));
  /* eslint-enable no-console */

  return buntstift;
};

buntstift.warn = function (message, options) {
  options = options || {};

  /* eslint-disable no-console */
  console.error(chalk.yellow.bold(util.format('%s %s', options.prefix || unicode.rightPointingPointer, mark.up(message + '', options))));
  /* eslint-enable no-console */

  return buntstift;
};

buntstift.success = function (message, options) {
  options = options || {};

  if (is.quiet()) {
    return buntstift;
  }

  /* eslint-disable no-console */
  console.log(chalk.green.bold(util.format('%s %s', options.prefix || unicode.checkMark, mark.up(message + '', options))));
  /* eslint-enable no-console */

  return buntstift;
};

buntstift.info = function (message, options) {
  options = options || {};

  if (is.quiet()) {
    return buntstift;
  }

  /* eslint-disable no-console */
  console.log(chalk.white(util.format('%s %s', options.prefix || ' ', mark.up(message + '', options))));
  /* eslint-enable no-console */

  return buntstift;
};

buntstift.verbose = function (message, options) {
  options = options || {};

  if (is.quiet() || !is.verbose()) {
    return buntstift;
  }

  /* eslint-disable no-console */
  console.log(chalk.gray(util.format('%s %s', options.prefix || ' ', mark.up(message + '', options))));
  /* eslint-enable no-console */

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

buntstift.line = function () {
  if (is.quiet()) {
    return buntstift;
  }

  /* eslint-disable no-console */
  console.log(chalk.gray('\u2500'.repeat(process.stdout.columns || 80)));
  /* eslint-enable no-console */

  return buntstift;
};

buntstift.newLine = function () {
  if (is.quiet()) {
    return buntstift;
  }

  /* eslint-disable no-console */
  console.log();
  /* eslint-enable no-console */

  return buntstift;
};

buntstift.waitFor = function (worker) {
  var interval,
      spinner;

  if (!worker) {
    throw new Error('Worker is missing.');
  }

  if (is.quiet()) {
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
  /* eslint-disable no-process-exit */
  process.exit(code || 0);
  /* eslint-enable no-process-exit */
};

module.exports = buntstift;
