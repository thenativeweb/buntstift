const pad = function (value: any, width: number): string {
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

export { pad };
