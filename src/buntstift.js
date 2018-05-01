'use strict';

const util = require('util');

const chalk = require('chalk'),
      Spinner = require('node-spinner');

const is = require('./is'),
      pad = require('./pad');

let unicode = require('./unicode')[is.utf() ? 'utf8' : 'ascii'];

let interval,
    stopSpinner;

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

buntstift.error = function (message, options = {}) {
  let spinnerNeedsRestart = false;

  if (stopSpinner) {
    stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.error(chalk.red.bold(util.format('%s %s', options.prefix || unicode.crossMark, String(message))));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.warn = function (message, options = {}) {
  let spinnerNeedsRestart = false;

  if (stopSpinner) {
    stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.error(chalk.yellow.bold(util.format('%s %s', options.prefix || unicode.rightPointingPointer, String(message))));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.success = function (message, options = {}) {
  if (is.quiet()) {
    return buntstift;
  }

  let spinnerNeedsRestart = false;

  if (stopSpinner) {
    stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.log(chalk.green.bold(util.format('%s %s', options.prefix || unicode.checkMark, String(message))));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.info = function (message, options = {}) {
  if (is.quiet()) {
    return buntstift;
  }

  let spinnerNeedsRestart = false;

  if (stopSpinner) {
    stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.log(chalk.white(util.format('%s %s', options.prefix || ' ', String(message))));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.verbose = function (message, options = {}) {
  if (is.quiet() || !is.verbose()) {
    return buntstift;
  }

  let spinnerNeedsRestart = false;

  if (stopSpinner) {
    stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.log(chalk.gray(util.format('%s %s', options.prefix || ' ', String(message))));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.passThrough = function (message, options = {}) {
  options.target = options.target || 'stdout';

  if (is.quiet() && options.target === 'stdout') {
    return buntstift;
  }

  let spinnerNeedsRestart = false;

  if (stopSpinner) {
    stopSpinner();
    spinnerNeedsRestart = true;
  }

  process[options.target].write(`${options.prefix || ' '} ${String(message)}`);

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.list = function (message, options = {}) {
  options.indent = options.indent || 0;
  options.prefix = options.prefix || unicode.multiplicationDot;

  const width = options.indent * (options.prefix.length + 1);

  options.prefix = new Array(width + 1).join(' ') + options.prefix;

  buntstift.info(message, options);

  return buntstift;
};

buntstift.table = function (rows) {
  if (!rows) {
    throw new Error('Rows are missing.');
  }

  const widths = [];

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

  let spinnerNeedsRestart = false;

  if (stopSpinner) {
    stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.log(chalk.gray('\u2500'.repeat(process.stdout.columns || 80)));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.newLine = function () {
  if (is.quiet()) {
    return buntstift;
  }

  let spinnerNeedsRestart = false;

  if (stopSpinner) {
    stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.log();

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.wait = function () {
  if (is.quiet() || !is.interactiveMode()) {
    return function () {
      // Intentionally left blank.
    };
  }

  if (stopSpinner) {
    return;
  }

  const spinner = new Spinner();

  interval = setInterval(() => {
    process.stderr.write(`\r${spinner.next()}`);
  }, 50);

  stopSpinner = function () {
    stopSpinner = undefined;
    process.stderr.write('\r');
    clearInterval(interval);
  };

  return stopSpinner;
};

buntstift.exit = function (code) {
  if (stopSpinner) {
    stopSpinner();
  }

  /* eslint-disable no-process-exit */
  process.exit(code || 0);
  /* eslint-enable no-process-exit */
};

module.exports = buntstift;
