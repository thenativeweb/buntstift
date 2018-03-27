'use strict';

const util = require('util');

const chalk = require('chalk'),
      Spinner = require('node-spinner');

const is = require('./is'),
      pad = require('./pad');

let unicode = require('./unicode')[is.utf() ? 'utf8' : 'ascii'];

const buntstift = {};

buntstift.forceColor = function () {
  chalk.enabled = true;
};

buntstift.noColor = function () {
  chalk.enabled = false;
};

buntstift.forceUtf = function () {
  /* eslint-disable global-require */
  unicode = require('./unicode').utf8;
  /* eslint-enable global-require */
};

buntstift.noUtf = function () {
  /* eslint-disable global-require */
  unicode = require('./unicode').ascii;
  /* eslint-enable global-require */
};

buntstift.error = function (message, options) {
  options = options || {};

  /* eslint-disable no-console */
  console.error(chalk.red.bold(util.format('%s %s', options.prefix || unicode.crossMark, String(message))));
  /* eslint-enable no-console */

  return buntstift;
};

buntstift.warn = function (message, options) {
  options = options || {};

  /* eslint-disable no-console */
  console.error(chalk.yellow.bold(util.format('%s %s', options.prefix || unicode.rightPointingPointer, String(message))));
  /* eslint-enable no-console */

  return buntstift;
};

buntstift.success = function (message, options) {
  options = options || {};

  if (is.quiet()) {
    return buntstift;
  }

  /* eslint-disable no-console */
  console.log(chalk.green.bold(util.format('%s %s', options.prefix || unicode.checkMark, String(message))));
  /* eslint-enable no-console */

  return buntstift;
};

buntstift.info = function (message, options) {
  options = options || {};

  if (is.quiet()) {
    return buntstift;
  }

  /* eslint-disable no-console */
  console.log(chalk.white(util.format('%s %s', options.prefix || ' ', String(message))));
  /* eslint-enable no-console */

  return buntstift;
};

buntstift.verbose = function (message, options) {
  options = options || {};

  if (is.quiet() || !is.verbose()) {
    return buntstift;
  }

  /* eslint-disable no-console */
  console.log(chalk.gray(util.format('%s %s', options.prefix || ' ', String(message))));
  /* eslint-enable no-console */

  return buntstift;
};

buntstift.list = function (message, options) {
  options = options || {};
  options.indent = options.indent || 0;
  options.prefix = options.prefix || unicode.multiplicationDot;

  const width = options.indent * (options.prefix.length + 1);

  options.prefix = new Array(width + 1).join(' ') + options.prefix;

  buntstift.info(message, options);

  return buntstift;
};

buntstift.table = function (rows) {
  const widths = [];

  if (!rows) {
    throw new Error('Rows are missing.');
  }

  rows.forEach(row => {
    row.forEach((value, columnIndex) => {
      widths[columnIndex] = Math.max(widths[columnIndex] || 0, String(value).length);
    });
  });

  rows.forEach(row => {
    const line = [];

    if (row.length > 0) {
      row.forEach((value, columnIndex) => {
        line.push(pad(value, widths[columnIndex]));
      });
    } else {
      widths.forEach(width => {
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

buntstift.wait = function () {
  if (is.quiet()) {
    return function () {
      // Intentionally left blank.
    };
  }

  const spinner = new Spinner();

  const interval = setInterval(() => {
    process.stderr.write(`\r${spinner.next()}`);
  }, 50);

  return function () {
    process.stderr.write('\r');
    clearInterval(interval);
  };
};

buntstift.exit = function (code) {
  /* eslint-disable no-process-exit */
  process.exit(code || 0);
  /* eslint-enable no-process-exit */
};

module.exports = buntstift;
