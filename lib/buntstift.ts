import chalk from 'chalk';
import inquirer from 'inquirer';
import is from './is';
import pad from './pad';
import Spinner from 'node-spinner';
import unicode from './unicode';

let characters = unicode[is.utf() ? 'utf8' : 'ascii'];

let interval: NodeJS.Timeout | undefined,
    stopSpinner: (() => void) | undefined;

type Unpacked<T> = T extends Promise<infer TValue> ? TValue : T;

const decorators = {
  pauseSpinner <T extends (...args: any[]) => any>(fn: T): (...args: Parameters<typeof fn>) => ReturnType<typeof fn> {
    return function (...args: Parameters<typeof fn>): ReturnType<typeof fn> {
      let spinnerNeedsRestart = false;

      if (stopSpinner) {
        stopSpinner();
        spinnerNeedsRestart = true;
      }

      const result = fn(...args);

      if (spinnerNeedsRestart) {
        /* eslint-disable @typescript-eslint/no-use-before-define */
        buntstift.wait();
        /* eslint-enable @typescript-eslint/no-use-before-define */
      }

      return result;
    };
  },

  pauseSpinnerAsync <T extends (...args: any[]) => Promise<any>>(fn: T): (...args: Parameters<typeof fn>) => Promise<Unpacked<ReturnType<typeof fn>>> {
    return async function (...args: Parameters<typeof fn>): Promise<Unpacked<ReturnType<typeof fn>>> {
      let spinnerNeedsRestart = false;

      if (stopSpinner) {
        stopSpinner();
        spinnerNeedsRestart = true;
      }

      const result = await fn(...args);

      if (spinnerNeedsRestart) {
        /* eslint-disable @typescript-eslint/no-use-before-define */
        buntstift.wait();
        /* eslint-enable @typescript-eslint/no-use-before-define */
      }

      return result;
    };
  },

  skipIfQuiet <T extends (...args: any[]) => any>(fn: T): (...args: Parameters<typeof fn>) => Buntstift | ReturnType<typeof fn> {
    return function (...args: Parameters<typeof fn>): Buntstift | ReturnType<typeof fn> {
      if (is.quiet()) {
        /* eslint-disable @typescript-eslint/no-use-before-define */
        return buntstift;
        /* eslint-enable @typescript-eslint/no-use-before-define */
      }

      const result = fn(...args);

      return result;
    };
  },

  skipIfNotVerbose <T extends (...args: any[]) => any>(fn: T): (...args: Parameters<typeof fn>) => Buntstift | ReturnType<typeof fn> {
    return function (...args: Parameters<typeof fn>): Buntstift | ReturnType<typeof fn> {
      if (!is.verbose()) {
        /* eslint-disable @typescript-eslint/no-use-before-define */
        return buntstift;
        /* eslint-enable @typescript-eslint/no-use-before-define */
      }

      const result = fn(...args);

      return result;
    };
  }
};

interface Buntstift {
  forceColor(): void;
  noColor(): void;
  forceUtf(): void;
  noUtf(): void;
  error(message: any, options?: { prefix?: string }): Buntstift;
  warn(message: any, options?: { prefix?: string }): Buntstift;
  success(message: any, options?: { prefix?: string }): Buntstift;
  info(message: any, options?: { prefix?: string }): Buntstift;
  verbose(message: any, options?: { prefix?: string }): Buntstift;
  line(): Buntstift;
  header(headline: any, options?: { prefix?: string }): Buntstift;
  list(message: any, options?: { prefix?: string; indent?: number }): Buntstift;
  newLine(): Buntstift;
  table(rows: any[][]): Buntstift;
  passThrough(message: any, options?: { prefix?: string; target?: 'stdout' | 'stderr' }): Buntstift;
  wait(): () => void;
  ask(question: any, options?: RegExp | string | { default?: string; mask?: RegExp }): Promise<string>;
  confirm(message: any, value: boolean): Promise<boolean>;
  select(question: any, choices: string[]): Promise<string>;
  exit(code: number): void;
}

const buntstift: Buntstift = {
  forceColor (): void {
    chalk.enabled = true;
  },

  noColor (): void {
    chalk.enabled = false;
  },

  forceUtf (): void {
    characters = unicode.utf8;
  },

  noUtf (): void {
    characters = unicode.ascii;
  },

  error: decorators.pauseSpinner(
    (message: any, { prefix = characters.crossMark }: { prefix?: string } = {}): typeof buntstift => {
      console.error(chalk.red.bold(`${prefix} ${String(message)}`));

      return buntstift;
    }
  ),

  warn: decorators.pauseSpinner(
    (message: any, { prefix = characters.rightPointingPointer }: { prefix?: string } = {}): typeof buntstift => {
      console.error(chalk.yellow.bold(`${prefix} ${String(message)}`));

      return buntstift;
    }
  ),

  success: decorators.skipIfQuiet(decorators.pauseSpinner(
    (message: any, { prefix = characters.checkMark }: { prefix?: string } = {}): typeof buntstift => {
      console.log(chalk.green.bold(`${prefix} ${String(message)}`));

      return buntstift;
    }
  )),

  info: decorators.skipIfQuiet(decorators.pauseSpinner(
    (message: any, { prefix = ' ' }: { prefix?: string } = {}): typeof buntstift => {
      console.log(chalk.white(`${prefix} ${String(message)}`));

      return buntstift;
    }
  )),

  verbose: decorators.skipIfQuiet(decorators.skipIfNotVerbose(decorators.pauseSpinner(
    (message: any, { prefix = ' ' }: { prefix?: string } = {}): typeof buntstift => {
      console.log(chalk.gray(`${prefix} ${String(message)}`));

      return buntstift;
    }
  ))),

  line: decorators.skipIfQuiet(decorators.pauseSpinner(
    (): typeof buntstift => {
      console.log(chalk.gray('\u2500'.repeat(process.stdout.columns || 80)));

      return buntstift;
    }
  )),

  header (headline: any, { prefix = characters.rightPointingPointer }: { prefix?: string } = {}): typeof buntstift {
    buntstift.line();
    buntstift.info(headline, { prefix });
    buntstift.line();

    return buntstift;
  },

  list (message: any, { prefix = characters.multiplicationDot, indent = 0 }: { prefix?: string; indent?: number } = {}): typeof buntstift {
    const width = indent * (prefix.length + 1);

    const paddedPrefix = new Array(width + 1).join(' ') + prefix;

    buntstift.info(message, { prefix: paddedPrefix });

    return buntstift;
  },

  newLine: decorators.skipIfQuiet(decorators.pauseSpinner(
    (): typeof buntstift => {
      console.log();

      return buntstift;
    }
  )),

  table (rows: any[][]): typeof buntstift {
    const widths: number[] = [];

    rows.forEach((row: any[]): void => {
      row.forEach((value: any, columnIndex: number): void => {
        widths[columnIndex] = Math.max(widths[columnIndex] || 0, String(value).length);
      });
    });

    rows.forEach((row: any[]): void => {
      const line: string[] = [];

      if (row.length > 0) {
        row.forEach((value: any, columnIndex: number): void => {
          line.push(pad(value, widths[columnIndex]));
        });
      } else {
        widths.forEach((width: number): void => {
          line.push(new Array(width + 1).join(characters.boxDrawingsLightHorizontal));
        });
      }

      buntstift.info(line.join('  '));
    });

    return buntstift;
  },

  passThrough: decorators.pauseSpinner(
    (message: any, { prefix = ' ', target = 'stdout' }: { prefix?: string; target?: 'stdout' | 'stderr' } = {}): typeof buntstift => {
      if (is.quiet() && target === 'stdout') {
        return buntstift;
      }

      process[target].write(`${prefix || ' '} ${String(message)}`);

      return buntstift;
    }
  ),

  wait (): () => void {
    if (is.quiet() || !is.interactiveMode()) {
      return function (): void {
        // Intentionally left blank.
      };
    }

    if (stopSpinner) {
      return stopSpinner;
    }

    const spinner = new Spinner();

    interval = setInterval((): void => {
      process.stderr.write(`\r${spinner.next()}`);
    }, 50);

    stopSpinner = function (): void {
      stopSpinner = undefined;
      process.stderr.write('\r \r');
      if (interval) {
        clearInterval(interval);
      }
    };

    return stopSpinner;
  },

  ask: decorators.pauseSpinnerAsync(
    async (question: any, options: RegExp | string | { default?: string; mask?: RegExp } = {}): Promise<string> => {
      let defaultValue: string | undefined,
          mask: RegExp | undefined;

      if (options instanceof RegExp) {
        defaultValue = undefined;
        mask = options;
      } else if (typeof options === 'string') {
        defaultValue = options;
        mask = undefined;
      } else {
        defaultValue = options.default;
        /* eslint-disable prefer-destructuring */
        mask = options.mask;
        /* eslint-enable prefer-destructuring */
      }

      const { answer } = await inquirer.prompt([
        {
          type: 'input',
          name: 'answer',
          message: question,
          default: defaultValue,
          validate (value: string): boolean | string {
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
    async (message: any, value = true): Promise<boolean> => {
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
    async (question: any, choices: string[]): Promise<string> => {
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

  exit (code = 0): void {
    if (stopSpinner) {
      stopSpinner();
    }

    /* eslint-disable unicorn/no-process-exit */
    process.exit(code);
    /* eslint-enable unicorn/no-process-exit */
  }
};

export default buntstift;
