'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var pad = function pad(value, width) {
  var valueAsString = String(value);

  var valueType = typeof value === 'undefined' ? 'undefined' : _typeof(value);

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