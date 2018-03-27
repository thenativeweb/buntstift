'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pad = function pad(value, width) {
  var valueAsString = String(value);

  var valueType = typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value);

  if (valueAsString.length > width) {
    valueAsString = valueAsString.slice(0, width - 1) + '\u2026';
  }

  var spaces = new Array(width - valueAsString.length + 1).join(' ');

  if (valueType === 'number') {
    return spaces + valueAsString;
  }

  return valueAsString + spaces;
};

module.exports = pad;