'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chalk = require('chalk'),
    inquirer = require('inquirer'),
    Spinner = require('node-spinner');

var is = require('./is'),
    pad = require('./pad'),
    unicode = require('./unicode');

var characters = unicode[is.utf() ? 'utf8' : 'ascii'];

var interval = void 0,
    _stopSpinner = void 0;

var decorators = {
  pauseSpinner: function pauseSpinner(fn) {
    return function () {
      var spinnerNeedsRestart = false;

      if (_stopSpinner) {
        _stopSpinner();
        spinnerNeedsRestart = true;
      }

      var result = fn.apply(undefined, arguments);

      if (spinnerNeedsRestart) {
        /* eslint-disable no-use-before-define */
        buntstift.wait();
        /* eslint-enable no-use-before-define */
      }

      return result;
    };
  },
  pauseSpinnerAsync: function pauseSpinnerAsync(fn) {
    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var spinnerNeedsRestart,
          result,
          _args = arguments;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              spinnerNeedsRestart = false;


              if (_stopSpinner) {
                _stopSpinner();
                spinnerNeedsRestart = true;
              }

              _context.next = 4;
              return fn.apply(undefined, _args);

            case 4:
              result = _context.sent;


              if (spinnerNeedsRestart) {
                /* eslint-disable no-use-before-define */
                buntstift.wait();
                /* eslint-enable no-use-before-define */
              }

              return _context.abrupt('return', result);

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
  },
  skipIfQuiet: function skipIfQuiet(fn) {
    return function () {
      if (is.quiet()) {
        /* eslint-disable no-use-before-define */
        return buntstift;
        /* eslint-enable no-use-before-define */
      }

      var result = fn.apply(undefined, arguments);

      return result;
    };
  },
  skipIfNotVerbose: function skipIfNotVerbose(fn) {
    return function () {
      if (!is.verbose()) {
        /* eslint-disable no-use-before-define */
        return buntstift;
        /* eslint-enable no-use-before-define */
      }

      var result = fn.apply(undefined, arguments);

      return result;
    };
  }
};

var buntstift = {
  forceColor: function forceColor() {
    chalk.enabled = true;
  },
  noColor: function noColor() {
    chalk.enabled = false;
  },
  forceUtf: function forceUtf() {
    characters = unicode.utf8;
  },
  noUtf: function noUtf() {
    characters = unicode.ascii;
  },


  error: decorators.pauseSpinner(function (message) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$prefix = _ref2.prefix,
        prefix = _ref2$prefix === undefined ? characters.crossMark : _ref2$prefix;

    console.error(chalk.red.bold(prefix + ' ' + String(message)));

    return buntstift;
  }),

  warn: decorators.pauseSpinner(function (message) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref3$prefix = _ref3.prefix,
        prefix = _ref3$prefix === undefined ? characters.rightPointingPointer : _ref3$prefix;

    console.error(chalk.yellow.bold(prefix + ' ' + String(message)));

    return buntstift;
  }),

  success: decorators.skipIfQuiet(decorators.pauseSpinner(function (message) {
    var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref4$prefix = _ref4.prefix,
        prefix = _ref4$prefix === undefined ? characters.checkMark : _ref4$prefix;

    console.log(chalk.green.bold(prefix + ' ' + String(message)));

    return buntstift;
  })),

  info: decorators.skipIfQuiet(decorators.pauseSpinner(function (message) {
    var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref5$prefix = _ref5.prefix,
        prefix = _ref5$prefix === undefined ? ' ' : _ref5$prefix;

    console.log(chalk.white(prefix + ' ' + String(message)));

    return buntstift;
  })),

  verbose: decorators.skipIfQuiet(decorators.skipIfNotVerbose(decorators.pauseSpinner(function (message) {
    var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref6$prefix = _ref6.prefix,
        prefix = _ref6$prefix === undefined ? ' ' : _ref6$prefix;

    console.log(chalk.gray(prefix + ' ' + String(message)));

    return buntstift;
  }))),

  line: decorators.skipIfQuiet(decorators.pauseSpinner(function () {
    console.log(chalk.gray('\u2500'.repeat(process.stdout.columns || 80)));

    return buntstift;
  })),

  header: function header(headline) {
    var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref7$prefix = _ref7.prefix,
        prefix = _ref7$prefix === undefined ? characters.rightPointingPointer : _ref7$prefix;

    buntstift.line();
    buntstift.info(headline, { prefix: prefix });
    buntstift.line();

    return buntstift;
  },
  list: function list(message) {
    var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref8$prefix = _ref8.prefix,
        prefix = _ref8$prefix === undefined ? characters.multiplicationDot : _ref8$prefix,
        _ref8$indent = _ref8.indent,
        indent = _ref8$indent === undefined ? 0 : _ref8$indent;

    var width = indent * (prefix.length + 1);

    prefix = new Array(width + 1).join(' ') + prefix;

    buntstift.info(message, { prefix: prefix });

    return buntstift;
  },


  newLine: decorators.skipIfQuiet(decorators.pauseSpinner(function () {
    console.log();

    return buntstift;
  })),

  table: function table(rows) {
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
          line.push(new Array(width + 1).join(characters.boxDrawingsLightHorizontal));
        });
      }

      buntstift.info(line.join('  '));
    });

    return buntstift;
  },


  passThrough: decorators.pauseSpinner(function (message) {
    var _ref9 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref9$prefix = _ref9.prefix,
        prefix = _ref9$prefix === undefined ? ' ' : _ref9$prefix,
        _ref9$target = _ref9.target,
        target = _ref9$target === undefined ? 'stdout' : _ref9$target;

    if (is.quiet() && target === 'stdout') {
      return buntstift;
    }

    process[target].write((prefix || ' ') + ' ' + String(message));

    return buntstift;
  }),

  wait: function wait() {
    if (is.quiet() || !is.interactiveMode()) {
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
      process.stderr.write('\r \r');
      clearInterval(interval);
    };

    return _stopSpinner;
  },


  ask: decorators.pauseSpinnerAsync(function () {
    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(question) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var defaultValue, mask, _ref11, answer;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (question) {
                _context2.next = 2;
                break;
              }

              throw new Error('Question is missing.');

            case 2:
              defaultValue = void 0, mask = void 0;


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

              _context2.next = 6;
              return inquirer.prompt([{
                type: 'input',
                name: 'answer',
                message: question,
                default: defaultValue,
                validate: function validate(value) {
                  if (mask && !mask.test(value)) {
                    return 'Malformed input, please retry.';
                  }

                  return true;
                }
              }]);

            case 6:
              _ref11 = _context2.sent;
              answer = _ref11.answer;
              return _context2.abrupt('return', answer);

            case 9:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x10) {
      return _ref10.apply(this, arguments);
    };
  }()),

  confirm: decorators.pauseSpinnerAsync(function () {
    var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(message) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var _ref13, isConfirmed;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (message) {
                _context3.next = 2;
                break;
              }

              throw new Error('Message is missing.');

            case 2:
              _context3.next = 4;
              return inquirer.prompt([{
                type: 'confirm',
                name: 'isConfirmed',
                message: message,
                default: value
              }]);

            case 4:
              _ref13 = _context3.sent;
              isConfirmed = _ref13.isConfirmed;
              return _context3.abrupt('return', isConfirmed);

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function (_x12) {
      return _ref12.apply(this, arguments);
    };
  }()),

  select: decorators.pauseSpinnerAsync(function () {
    var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(question, choices) {
      var _ref15, selection;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (question) {
                _context4.next = 2;
                break;
              }

              throw new Error('Question is missing.');

            case 2:
              if (choices) {
                _context4.next = 4;
                break;
              }

              throw new Error('Choices are missing.');

            case 4:
              _context4.next = 6;
              return inquirer.prompt([{
                type: 'list',
                name: 'selection',
                message: question,
                choices: choices
              }]);

            case 6:
              _ref15 = _context4.sent;
              selection = _ref15.selection;
              return _context4.abrupt('return', selection);

            case 9:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    return function (_x13, _x14) {
      return _ref14.apply(this, arguments);
    };
  }()),

  exit: function exit() {
    var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (_stopSpinner) {
      _stopSpinner();
    }

    /* eslint-disable no-process-exit */
    process.exit(code);
    /* eslint-enable no-process-exit */
  }
};

module.exports = buntstift;