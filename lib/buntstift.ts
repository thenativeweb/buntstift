import chalk from 'chalk';
import { ColorLevel } from './ColorLevel';
import { Configuration } from './Configuration';
import humanizeString from 'humanize-string';
import inquirer from 'inquirer';
import { ListOptions } from './ListOptions';
import { Message } from './Message';
import { MessageType } from './MessageType';
import { ModeOptions } from './ModeOptions';
import { noop } from './noop';
import ora from 'ora';
import { PrefixOptions } from './PrefixOptions';
import { RawOptions } from './RawOptions';
import { TableOptions } from './TableOptions';

class Buntstift {
  private configuration: Configuration;

  private static readonly detectedColorLevel: ColorLevel = chalk.level;

  private static spinner = ora({
    color: 'white',
    spinner: 'dots',
    isEnabled: true
  });

  public constructor () {
    this.configuration = new Configuration({
      colorLevel: Buntstift.detectedColorLevel,
      isInteractiveSession: process.stdout.isTTY,
      isQuietModeEnabled: false,
      isUtf8Enabled: true,
      isVerboseModeEnabled: false
    });
  }

  protected getPrefix (messageType: MessageType, modeOptions?: ModeOptions): string {
    switch (messageType) {
      case 'error':
        return this.isUtf8Enabled(modeOptions) ? '\u2717' : '!';
      case 'warn':
        return this.isUtf8Enabled(modeOptions) ? '\u25BB' : '>';
      case 'success':
        return this.isUtf8Enabled(modeOptions) ? '\u2713' : '+';
      case 'info':
        return ' ';
      case 'verbose':
        return ' ';
      case 'header':
        return this.isUtf8Enabled(modeOptions) ? '\u25BB' : '>';
      case 'list':
        return this.isUtf8Enabled(modeOptions) ? '\u2219' : '-';
      default:
        throw new Error('Invalid operation.');
    }
  }

  protected isInteractiveSession (modeOptions?: ModeOptions): boolean {
    return modeOptions?.isInteractiveSession ?? this.configuration.isInteractiveSession;
  }

  protected isQuietModeEnabled (modeOptions?: ModeOptions): boolean {
    return modeOptions?.isQuietModeEnabled ?? this.configuration.isQuietModeEnabled;
  }

  protected isUtf8Enabled (modeOptions?: ModeOptions): boolean {
    return modeOptions?.isUtf8Enabled ?? this.configuration.isUtf8Enabled;
  }

  protected isVerboseModeEnabled (modeOptions?: ModeOptions): boolean {
    return modeOptions?.isVerboseModeEnabled ?? this.configuration.isVerboseModeEnabled;
  }

  protected static pauseSpinner (): () => void {
    if (!Buntstift.spinner.isSpinning) {
      return noop;
    }

    Buntstift.spinner.stop();

    const resume = (): void => {
      Buntstift.spinner.start();
    };

    return resume;
  }

  public configure (configuration: Configuration): void {
    this.configuration = configuration;

    chalk.level = this.configuration.colorLevel;

    if (this.configuration.isUtf8Enabled) {
      Buntstift.spinner.spinner = 'dots';
    } else {
      Buntstift.spinner.spinner = 'line';
    }
  }

  public getConfiguration (): Configuration {
    return this.configuration.clone();
  }

  public wait (options?: ModeOptions): () => void {
    if (this.isQuietModeEnabled(options) || !this.isInteractiveSession(options)) {
      return noop;
    }

    Buntstift.spinner.start();

    const stop = (): void => {
      Buntstift.spinner.stop();
    };

    return stop;
  }

  public error (message: Message, options?: PrefixOptions & ModeOptions): Buntstift {
    const resumeSpinner = Buntstift.pauseSpinner();
    const prefix = options?.prefix ?? this.getPrefix('error', options);

    console.error(chalk.red.bold(`${prefix} ${String(message)}`));
    resumeSpinner();

    return this;
  }

  public warn (message: Message, options?: PrefixOptions & ModeOptions): Buntstift {
    const resumeSpinner = Buntstift.pauseSpinner();
    const prefix = options?.prefix ?? this.getPrefix('warn', options);

    console.error(chalk.yellow.bold(`${prefix} ${String(message)}`));
    resumeSpinner();

    return this;
  }

  public success (message: Message, options?: PrefixOptions & ModeOptions): Buntstift {
    if (this.isQuietModeEnabled(options)) {
      return this;
    }

    const resumeSpinner = Buntstift.pauseSpinner();
    const prefix = options?.prefix ?? this.getPrefix('success', options);

    console.log(chalk.green.bold(`${prefix} ${String(message)}`));
    resumeSpinner();

    return this;
  }

  public info (message: Message, options?: PrefixOptions & ModeOptions): Buntstift {
    if (this.isQuietModeEnabled(options)) {
      return this;
    }

    const resumeSpinner = Buntstift.pauseSpinner();
    const prefix = options?.prefix ?? this.getPrefix('info', options);

    console.log(chalk.white(`${prefix} ${String(message)}`));
    resumeSpinner();

    return this;
  }

  public verbose (message: Message, options?: PrefixOptions & ModeOptions): Buntstift {
    if (this.isQuietModeEnabled(options)) {
      return this;
    }
    if (!this.isVerboseModeEnabled(options)) {
      return this;
    }

    const resumeSpinner = Buntstift.pauseSpinner();
    const prefix = options?.prefix ?? this.getPrefix('verbose', options);

    console.log(chalk.gray(`${prefix} ${String(message)}`));
    resumeSpinner();

    return this;
  }

  public line (options?: ModeOptions): Buntstift {
    if (this.isQuietModeEnabled(options)) {
      return this;
    }

    const resumeSpinner = Buntstift.pauseSpinner();
    const dash = this.configuration.isUtf8Enabled ? '\u2500' : '-';

    console.log(chalk.gray(dash.repeat(process.stdout.columns || 80)));
    resumeSpinner();

    return this;
  }

  public header (headline: Message, options?: PrefixOptions & ModeOptions): Buntstift {
    if (this.isQuietModeEnabled(options)) {
      return this;
    }

    const prefix = options?.prefix ?? this.getPrefix('header', options);

    this.line(options);
    this.info(headline, { ...options, prefix });
    this.line(options);

    return this;
  }

  public newLine (options?: ModeOptions): Buntstift {
    if (this.isQuietModeEnabled(options)) {
      return this;
    }

    const resumeSpinner = Buntstift.pauseSpinner();

    console.log();
    resumeSpinner();

    return this;
  }

  public list (message: Message, options?: PrefixOptions & ModeOptions & ListOptions): Buntstift {
    if (this.isQuietModeEnabled(options)) {
      return this;
    }

    const prefix = options?.prefix ?? this.getPrefix('list', options);

    const level = options?.level ?? 0;
    const indent = (prefix.length + 1) * level;

    const indentedPrefix = `${' '.repeat(indent)}${prefix}`;

    this.info(message, { ...options, prefix: indentedPrefix });

    return this;
  }

  public table (items: Record<string, Message>[], options?: ModeOptions & TableOptions): Buntstift {
    if (this.isQuietModeEnabled(options)) {
      return this;
    }

    const showHeader = options?.showHeader ?? true;

    const columns: Record<string, { title: string; width: number }> = {};

    for (const columnName of Object.keys(items[0])) {
      const title = humanizeString(columnName);

      columns[columnName] = { title, width: showHeader ? title.length : 0 };
    }

    for (const item of items) {
      for (const [ columnName, value ] of Object.entries(item)) {
        const lengthValue = String(value).length;

        if (lengthValue > columns[columnName].width) {
          columns[columnName].width = lengthValue;
        }
      }
    }

    if (showHeader) {
      const headerData: string[] = [];

      for (const column of Object.values(columns)) {
        headerData.push(column.title.padEnd(column.width));
      }

      const header = headerData.join('  ');

      this.info(header, options);

      const dash = this.isUtf8Enabled(options) ? '\u2500' : '-';
      const separatorData = [];

      for (const column of Object.values(columns)) {
        separatorData.push(dash.repeat(column.width));
      }

      const separator = separatorData.join('  ');

      this.info(separator, options);
    }

    for (const item of items) {
      const data: string[] = [];

      for (const [ key, value ] of Object.entries(item)) {
        if (typeof value === 'number') {
          data.push(String(value).padStart(columns[key].width));
        } else {
          data.push(String(value).padEnd(columns[key].width));
        }
      }

      const line = data.join('  ');

      this.info(line, options);
    }

    return this;
  }

  public raw (message: Message, options?: RawOptions): Buntstift {
    const resumeSpinner = Buntstift.pauseSpinner();
    const target = options?.target ?? 'stdout';

    process[target].write(String(message));
    resumeSpinner();

    return this;
  }

  /* eslint-disable class-methods-use-this */
  public async ask (question: string, options?: RegExp | string | { default?: string; mask?: RegExp; echo?: boolean }): Promise<string> {
    const resumeSpinner = Buntstift.pauseSpinner();

    let defaultValue: string | undefined,
        echo: boolean,
        mask: RegExp | undefined;

    if (options instanceof RegExp) {
      defaultValue = undefined;
      echo = true;
      mask = options;
    } else if (typeof options === 'string') {
      defaultValue = options;
      echo = true;
      mask = undefined;
    } else {
      defaultValue = options?.default;
      echo = options?.echo ?? true;
      mask = options?.mask;
    }

    const { answer } = await inquirer.prompt([
      {
        type: echo ? 'input' : 'password',
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
    ]) as { answer: string };

    resumeSpinner();

    return answer;
  }
  /* eslint-enable class-methods-use-this */

  /* eslint-disable class-methods-use-this */
  public async confirm (message: string, value = true): Promise<boolean> {
    const resumeSpinner = Buntstift.pauseSpinner();

    const { isConfirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message,
        default: value
      }
    ]) as { isConfirmed: boolean };

    resumeSpinner();

    return isConfirmed;
  }
  /* eslint-enable class-methods-use-this */

  /* eslint-disable class-methods-use-this */
  public async select (question: string, choices: string[]): Promise<string> {
    const resumeSpinner = Buntstift.pauseSpinner();

    const { selection } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selection',
        message: question,
        choices
      }
    ]) as { selection: string };

    resumeSpinner();

    return selection;
  }
  /* eslint-enable class-methods-use-this */
}

const buntstift = new Buntstift();

export { buntstift, ColorLevel };
