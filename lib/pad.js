'use strict';

const pad = function (value, width) {
  let valueAsString = String(value);

  const valueType = typeof value;

  if (valueAsString.length > width) {
    valueAsString = `${valueAsString.slice(0, width - 1)}…`;
  }

  const spaces = new Array(width - valueAsString.length + 1).join(' ');

  if (valueType === 'number') {
    return spaces + valueAsString;
  }

  return valueAsString + spaces;
};

module.exports = pad;
