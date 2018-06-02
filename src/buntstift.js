'use strict';

const chalk = require('chalk'),
      inquirer = require('inquirer'),
      Spinner = require('node-spinner');

const is = require('./is'),
      pad = require('./pad'),
      unicode = require('./unicode');

let characters = unicode[is.utf() ? 'utf8' : 'ascii'];

let interval,
    stopSpinner;

const decorators = {
  pauseSpinner (fn) {
    return function (...args) {
      let spinnerNeedsRestart = false;

      if (stopSpinner) {
        stopSpinner();
        spinnerNeedsRestart = true;
      }

      const result = fn(...args);

      if (spinnerNeedsRestart) {
        /* eslint-disable no-use-before-define */
        buntstift.wait();
        /* eslint-enable no-use-before-define */
      }

      return result;
    };
  },

  pauseSpinnerAsync (fn) {
    return async function (...args) {
      let spinnerNeedsRestart = false;

      if (stopSpinner) {
        stopSpinner();
        spinnerNeedsRestart = true;
      }

      const result = await fn(...args);

      if (spinnerNeedsRestart) {
        /* eslint-disable no-use-before-define */
        buntstift.wait();
        /* eslint-enable no-use-before-define */
      }

      return result;
    };
  },

  skipIfQuiet (fn) {
    return function (...args) {
      if (is.quiet()) {
        /* eslint-disable no-use-before-define */
        return buntstift;
        /* eslint-enable no-use-before-define */
      }

      const result = fn(...args);

      return result;
    };
  },

  skipIfNotVerbose (fn) {
    return function (...args) {
      if (!is.verbose()) {
        /* eslint-disable no-use-before-define */
        return buntstift;
        /* eslint-enable no-use-before-define */
      }

      const result = fn(...args);

      return result;
    };
  }
};

const buntstift = {
  forceColor () {
    chalk.enabled = true;
  },

  noColor () {
    chalk.enabled = false;
  },

  forceUtf () {
    characters = unicode.utf8;
  },

  noUtf () {
    characters = unicode.ascii;
  },

  error: decorators.pauseSpinner(
    (message, { prefix = characters.crossMark } = {}) => {
      console.error(chalk.red.bold(`${prefix} ${String(message)}`));

      return buntstift;
    }
  ),

  warn: decorators.pauseSpinner(
    (message, { prefix = characters.rightPointingPointer } = {}) => {
      console.error(chalk.yellow.bold(`${prefix} ${String(message)}`));

      return buntstift;
    }
  ),

  success: decorators.skipIfQuiet(decorators.pauseSpinner(
    (message, { prefix = characters.checkMark } = {}) => {
      console.log(chalk.green.bold(`${prefix} ${String(message)}`));

      return buntstift;
    }
  )),

  info: decorators.skipIfQuiet(decorators.pauseSpinner(
    (message, { prefix = ' ' } = {}) => {
      console.log(chalk.white(`${prefix} ${String(message)}`));

      return buntstift;
    }
  )),

  verbose: decorators.skipIfQuiet(decorators.skipIfNotVerbose(decorators.pauseSpinner(
    (message, { prefix = ' ' } = {}) => {
      console.log(chalk.gray(`${prefix} ${String(message)}`));

      return buntstift;
    }
  ))),

  line: decorators.skipIfQuiet(decorators.pauseSpinner(
    () => {
      console.log(chalk.gray('\u2500'.repeat(process.stdout.columns || 80)));

      return buntstift;
    }
  )),

  header (headline, { prefix = characters.rightPointingPointer } = {}) {
    buntstift.line();
    buntstift.info(headline, { prefix });
    buntstift.line();

    return buntstift;
  },

  list (message, { prefix = characters.multiplicationDot, indent = 0 } = {}) {
    const width = indent * (prefix.length + 1);

    prefix = new Array(width + 1).join(' ') + prefix;

    buntstift.info(message, { prefix });

    return buntstift;
  },

  newLine: decorators.skipIfQuiet(decorators.pauseSpinner(
    () => {
      console.log();

      return buntstift;
    }
  )),

  table (rows) {
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
          line.push(new Array(width + 1).join(characters.boxDrawingsLightHorizontal));
        });
      }

      buntstift.info(line.join('  '));
    });

    return buntstift;
  },

  passThrough: decorators.pauseSpinner(
    (message, { prefix = ' ', target = 'stdout' } = {}) => {
      if (is.quiet() && target === 'stdout') {
        return buntstift;
      }

      process[target].write(`${prefix || ' '} ${String(message)}`);

      return buntstift;
    }
  ),

  wait () {
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
      process.stderr.write('\r \r');
      clearInterval(interval);
    };

    return stopSpinner;
  },

  ask: decorators.pauseSpinnerAsync(
    async (question, options = {}) => {
      if (!question) {
        throw new Error('Question is missing.');
      }

      let defaultValue,
          mask;

      if (options instanceof RegExp) {
        defaultValue = undefined;
        mask = options;
      } else if (typeof options === 'string') {
        defaultValue = options;
        mask = undefined;
      } else {
        defaultValue = options.default;
        mask = options.mask;
      }

      const { answer } = await inquirer.prompt([
        {
          type: 'input',
          name: 'answer',
          message: question,
          default: defaultValue,
          validate (value) {
            if (mask && !mask.test(value)) {
              return 'Malformed input, please retry.';
            }

            return true;
          }
        }
      ]);

      return answer;
    }
  ),

  confirm: decorators.pauseSpinnerAsync(
    async (message, value = true) => {
      if (!message) {
        throw new Error('Message is missing.');
      }

      const { isConfirmed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'isConfirmed',
          message,
          default: value
        }
      ]);

      return isConfirmed;
    }
  ),

  select: decorators.pauseSpinnerAsync(
    async (question, choices) => {
      if (!question) {
        throw new Error('Question is missing.');
      }
      if (!choices) {
        throw new Error('Choices are missing.');
      }

      const { selection } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selection',
          message: question,
          choices
        }
      ]);

      return selection;
    }
  ),

  exit (code = 0) {
    if (stopSpinner) {
      stopSpinner();
    }

    /* eslint-disable no-process-exit */
    process.exit(code);
    /* eslint-enable no-process-exit */
  }
};

module.exports = buntstift;
