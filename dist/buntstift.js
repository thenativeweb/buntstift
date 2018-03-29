'use strict';

var util = require('util');

var chalk = require('chalk'),
    Spinner = require('node-spinner');

var is = require('./is'),
    pad = require('./pad');

var unicode = require('./unicode')[is.utf() ? 'utf8' : 'ascii'];

var interval = void 0,
    _stopSpinner = void 0;

var buntstift = {};

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

buntstift.error = function (message) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var spinnerNeedsRestart = false;

  if (_stopSpinner) {
    _stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.error(chalk.red.bold(util.format('%s %s', options.prefix || unicode.crossMark, String(message))));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.warn = function (message) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var spinnerNeedsRestart = false;

  if (_stopSpinner) {
    _stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.error(chalk.yellow.bold(util.format('%s %s', options.prefix || unicode.rightPointingPointer, String(message))));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.success = function (message) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (is.quiet()) {
    return buntstift;
  }

  var spinnerNeedsRestart = false;

  if (_stopSpinner) {
    _stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.log(chalk.green.bold(util.format('%s %s', options.prefix || unicode.checkMark, String(message))));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.info = function (message) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (is.quiet()) {
    return buntstift;
  }

  var spinnerNeedsRestart = false;

  if (_stopSpinner) {
    _stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.log(chalk.white(util.format('%s %s', options.prefix || ' ', String(message))));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.verbose = function (message) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (is.quiet() || !is.verbose()) {
    return buntstift;
  }

  var spinnerNeedsRestart = false;

  if (_stopSpinner) {
    _stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.log(chalk.gray(util.format('%s %s', options.prefix || ' ', String(message))));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.passThrough = function (message) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options.target = options.target || 'stdout';

  if (is.quiet() && options.target === 'stdout') {
    return buntstift;
  }

  var spinnerNeedsRestart = false;

  if (_stopSpinner) {
    _stopSpinner();
    spinnerNeedsRestart = true;
  }

  process[options.target].write((options.prefix || ' ') + ' ' + String(message));

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.list = function (message) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options.indent = options.indent || 0;
  options.prefix = options.prefix || unicode.multiplicationDot;

  var width = options.indent * (options.prefix.length + 1);

  options.prefix = new Array(width + 1).join(' ') + options.prefix;

  buntstift.info(message, options);

  return buntstift;
};

buntstift.table = function (rows) {
  if (!rows) {
    throw new Error('Rows are missing.');
  }

  var widths = [];

  rows.forEach(function (row) {
    row.forEach(function (value, columnIndex) {
      widths[columnIndex] = Math.max(widths[columnIndex] || 0, String(value).length);
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

  var spinnerNeedsRestart = false;

  if (_stopSpinner) {
    _stopSpinner();
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

  var spinnerNeedsRestart = false;

  if (_stopSpinner) {
    _stopSpinner();
    spinnerNeedsRestart = true;
  }

  console.log();

  if (spinnerNeedsRestart) {
    buntstift.wait();
  }

  return buntstift;
};

buntstift.wait = function () {
  if (is.quiet()) {
    return function () {
      // Intentionally left blank.
    };
  }

  if (_stopSpinner) {
    return;
  }

  var spinner = new Spinner();

  interval = setInterval(function () {
    process.stderr.write('\r' + spinner.next());
  }, 50);

  _stopSpinner = function stopSpinner() {
    _stopSpinner = undefined;
    process.stderr.write('\r');
    clearInterval(interval);
  };

  return _stopSpinner;
};

buntstift.exit = function (code) {
  if (_stopSpinner) {
    _stopSpinner();
  }

  /* eslint-disable no-process-exit */
  process.exit(code || 0);
  /* eslint-enable no-process-exit */
};

module.exports = buntstift;