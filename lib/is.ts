const is = {
  verbose (): boolean {
    return process.argv.includes('--verbose') || process.argv.includes('-v');
  },

  quiet (): boolean {
    return process.argv.includes('--quiet') || process.argv.includes('-q');
  },

  utf (): boolean {
    return !process.argv.includes('--no-utf');
  },

  interactiveMode (): boolean {
    return Boolean(process.stdout.isTTY);
  }
};

export { is };
