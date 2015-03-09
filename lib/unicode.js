'use strict';

var isUtf = function () {
  return (process.argv.indexOf('--no-utf') === -1);
};

var unicode = function () {
  if (!isUtf()) {
    return {
      checkMark: '+',
      crossMark: '!',
      multiplicationDot: '-',
      rightPointingPointer: '?',
      boxDrawingsLightHorizontal: '-'
    };
  }

  return {
    checkMark: '\u2713',
    crossMark: '\u2717',
    multiplicationDot: '\u2219',
    rightPointingPointer: '\u25bb',
    boxDrawingsLightHorizontal: '\u2500'
  };
};

module.exports = unicode;
