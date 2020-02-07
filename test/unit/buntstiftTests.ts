import { assert } from 'assertthat';
import { buntstift } from '../../lib/buntstift';
import { isAnsi } from 'isansi';
import { promisify } from 'util';
import { record } from 'record-stdstreams';
import stripAnsi from 'strip-ansi';

const sleep = promisify(setTimeout);

suite('buntstift', (): void => {
  suite('wait', (): void => {
    test('shows a waiting indicator on stderr in interactive mode.', async (): Promise<void> => {
      const stop = record();
      const stopWaiting = buntstift.wait({ isInteractiveSession: true });

      await sleep(0.2 * 1000);
      stopWaiting();

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.not.equalTo('');
    });

    test('shows nothing when the application is not in interactive mode.', async (): Promise<void> => {
      const stop = record();
      const stopWaiting = buntstift.wait({ isInteractiveSession: false });

      await sleep(0.2 * 1000);
      stopWaiting();

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.equalTo('');
    });

    test('shows nothing in quiet mode.', async (): Promise<void> => {
      const stop = record();
      const stopWaiting = buntstift.wait({ isQuietModeEnabled: true });

      await sleep(0.2 * 1000);
      stopWaiting();

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.equalTo('');
      process.argv.pop();
    });
  });

  suite('error', (): void => {
    test('writes a message in red and bold to stderr.', async (): Promise<void> => {
      const stop = record();

      buntstift.error('foo');

      const { stderr } = stop();

      assert.that(isAnsi.red(stderr)).is.true();
      assert.that(isAnsi.bold(stderr)).is.true();
    });

    test('writes a message with a cross.', async (): Promise<void> => {
      const stop = record();

      buntstift.error('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`✗ foo\n`);
    });

    test('writes a message with an ASCII-compatible cross if UTF8 is not available.', async (): Promise<void> => {
      const stop = record();

      buntstift.error('foo', { isUtf8Enabled: false });

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('! foo\n');
    });

    test('writes a stringified message if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.error(23);

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`✗ 23\n`);
    });

    test('replaces the check mark if a prefix is explicitly given.', async (): Promise<void> => {
      const stop = record();

      buntstift.error('foo', { prefix: '-' });

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('- foo\n');
    });

    test('still works in quiet mode.', async (): Promise<void> => {
      const stop = record();

      buntstift.error('foo', { isQuietModeEnabled: true });

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`✗ foo\n`);
    });
  });

  suite('warn', (): void => {
    test('writes a message in yellow and bold to stderr.', async (): Promise<void> => {
      const stop = record();

      buntstift.warn('foo');

      const { stderr } = stop();

      assert.that(isAnsi.yellow(stderr)).is.true();
      assert.that(isAnsi.bold(stderr)).is.true();
    });

    test('writes a message with a pointer.', async (): Promise<void> => {
      const stop = record();

      buntstift.warn('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`▻ foo\n`);
    });

    test('writes a message with an ASCII-compatible pointer if UTF8 is not available.', async (): Promise<void> => {
      const stop = record();

      buntstift.warn('foo', { isUtf8Enabled: false });

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('> foo\n');
    });

    test('writes a stringified message if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.warn(23);

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`▻ 23\n`);
    });

    test('replaces the check mark if a prefix is explicitly given.', async (): Promise<void> => {
      const stop = record();

      buntstift.warn('foo', { prefix: '-' });

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('- foo\n');
    });

    test('still works in quiet mode.', async (): Promise<void> => {
      const stop = record();

      buntstift.warn('foo', { isQuietModeEnabled: true });

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`▻ foo\n`);
    });
  });

  suite('success', (): void => {
    test('writes a message in green and bold to stdout.', async (): Promise<void> => {
      const stop = record();

      buntstift.success('foo');

      const { stdout } = stop();

      assert.that(isAnsi.green(stdout)).is.true();
      assert.that(isAnsi.bold(stdout)).is.true();
    });

    test('writes a message with a check mark.', async (): Promise<void> => {
      const stop = record();

      buntstift.success('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`✓ foo\n`);
    });

    test('writes a message with an ASCII-compatible check mark if UTF8 is not available.', async (): Promise<void> => {
      const stop = record();

      buntstift.success('foo', { isUtf8Enabled: false });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('+ foo\n');
    });

    test('writes a stringified message if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.success(23);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`✓ 23\n`);
    });

    test('replaces the check mark if a prefix is explicitly given.', async (): Promise<void> => {
      const stop = record();

      buntstift.success('foo', { prefix: '-' });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('- foo\n');
    });

    test('does nothing in quiet mode.', async (): Promise<void> => {
      const stop = record();

      buntstift.success('foo', { isQuietModeEnabled: true });

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
    });
  });

  suite('info', (): void => {
    test('writes a message in white to stdout.', async (): Promise<void> => {
      const stop = record();

      buntstift.info('foo');

      const { stdout } = stop();

      assert.that(isAnsi.white(stdout)).is.true();
    });

    test('writes a message with indentation.', async (): Promise<void> => {
      const stop = record();

      buntstift.info('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  foo\n');
    });

    test('writes a stringified message if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.info(23);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  23\n');
    });

    test('replaces the check mark if a prefix is explicitly given.', async (): Promise<void> => {
      const stop = record();

      buntstift.info('foo', { prefix: '-' });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('- foo\n');
    });

    test('does nothing in quiet mode.', async (): Promise<void> => {
      const stop = record();

      buntstift.info('foo', { isQuietModeEnabled: true });

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
    });
  });

  suite('verbose', (): void => {
    suite('in verbose mode', (): void => {
      test('writes a message in gray to stdout.', async (): Promise<void> => {
        const stop = record();

        buntstift.verbose('foo', { isVerboseModeEnabled: true });

        const { stdout } = stop();

        assert.that(isAnsi.gray(stdout)).is.true();
      });

      test('writes a message with indentation.', async (): Promise<void> => {
        const stop = record();

        buntstift.verbose('foo', { isVerboseModeEnabled: true });

        const { stdout } = stop();

        assert.that(stripAnsi(stdout)).is.equalTo('  foo\n');
      });

      test('writes a stringified message if necessary.', async (): Promise<void> => {
        const stop = record();

        buntstift.verbose(23, { isVerboseModeEnabled: true });

        const { stdout } = stop();

        assert.that(stripAnsi(stdout)).is.equalTo('  23\n');
      });

      test('prints the explicitly given prefix.', async (): Promise<void> => {
        const stop = record();

        buntstift.verbose('foo', { prefix: '-', isVerboseModeEnabled: true });

        const { stdout } = stop();

        assert.that(stripAnsi(stdout)).is.equalTo('- foo\n');
      });

      test('does nothing in quiet mode.', async (): Promise<void> => {
        const stop = record();

        buntstift.verbose('foo', { isVerboseModeEnabled: true, isQuietModeEnabled: true });

        const { stdout } = stop();

        assert.that(stdout).is.equalTo('');
      });
    });

    suite('in non-verbose mode', (): void => {
      test('does not write a message to stdout.', async (): Promise<void> => {
        const stop = record();

        buntstift.verbose('foo');

        const { stdout } = stop();

        assert.that(stdout).is.equalTo('');
      });
    });
  });

  suite('line', (): void => {
    test('writes a line in gray to stdout.', async (): Promise<void> => {
      const stop = record();

      buntstift.line();

      const { stdout } = stop();

      assert.that(isAnsi.gray(stdout)).is.true();
    });

    test('writes a line to stdout.', async (): Promise<void> => {
      const stop = record();

      buntstift.line();

      const { stdout } = stop();

      const line = '─'.repeat(process.stdout.columns || 80);

      assert.that(stripAnsi(stdout)).is.equalTo(`${line}\n`);
    });

    test('shows nothing in quiet mode.', async (): Promise<void> => {
      const stop = record();

      buntstift.line({ isQuietModeEnabled: true });

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.equalTo('');
    });
  });

  suite('header', (): void => {
    test('writes a headline with a right pointing arrow.', async (): Promise<void> => {
      const stop = record();

      buntstift.header('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${'─'.repeat(process.stdout.columns || 80)}\n▻ foo\n${'─'.repeat(process.stdout.columns || 80)}\n`);
    });

    test('writes a headline with an ASCII-compatible right pointing arrow if UTF8 is not available.', async (): Promise<void> => {
      const stop = record();

      buntstift.header('foo', { isUtf8Enabled: false });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${'─'.repeat(process.stdout.columns || 80)}\n> foo\n${'─'.repeat(process.stdout.columns || 80)}\n`);
    });

    test('writes a stringified headline if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.header(23);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${'─'.repeat(process.stdout.columns || 80)}\n▻ 23\n${'─'.repeat(process.stdout.columns || 80)}\n`);
    });

    test('replaces the right pointing pointer if a prefix is explicitly given.', async (): Promise<void> => {
      const stop = record();

      buntstift.header('foo', { prefix: '-' });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${'─'.repeat(process.stdout.columns || 80)}\n- foo\n${'─'.repeat(process.stdout.columns || 80)}\n`);
    });

    test('does nothing in quiet mode.', async (): Promise<void> => {
      const stop = record();

      buntstift.header('foo', { isQuietModeEnabled: true });

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
    });
  });

  suite('newLine', (): void => {
    test('writes a blank line to stdout.', async (): Promise<void> => {
      const stop = record();

      buntstift.newLine();

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('\n');
    });

    test('does nothing in quiet mode.', async (): Promise<void> => {
      const stop = record();

      buntstift.newLine({ isQuietModeEnabled: true });

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
    });
  });

  suite('list', (): void => {
    test('writes a message with a leading dash.', async (): Promise<void> => {
      const stop = record();

      buntstift.list('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`∙ foo\n`);
    });

    test('writes a message with an ASCII-compatible dash if UTF8 is not available.', async (): Promise<void> => {
      const stop = record();

      buntstift.list('foo', { isUtf8Enabled: false });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('- foo\n');
    });

    test('writes an indented message.', async (): Promise<void> => {
      const stop = record();

      buntstift.list('foo', { level: 1 });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`  ∙ foo\n`);
    });

    test('writes an indented message with level 2.', async (): Promise<void> => {
      const stop = record();

      buntstift.list('foo', { level: 2 });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`    ∙ foo\n`);
    });

    test('correctly indents even for multiple prefix characters.', async (): Promise<void> => {
      const stop = record();

      buntstift.list('foo', { prefix: '--', level: 1 });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('   -- foo\n');
    });
  });

  suite('table', (): void => {
    test('writes a single row.', async (): Promise<void> => {
      const stop = record();

      buntstift.table([
        { first: 'foo', second: 'bar', third: 'baz' }
      ], { showHeader: false });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  foo  bar  baz\n');
    });

    test('writes multiple rows.', async (): Promise<void> => {
      const stop = record();

      buntstift.table([
        { first: 'foo', second: 'bar', third: 'baz' },
        { first: 'bar', second: 'baz', third: 'foo' }
      ], { showHeader: false });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  foo  bar  baz\n  bar  baz  foo\n');
    });

    test('pads cells.', async (): Promise<void> => {
      const stop = record();

      buntstift.table([
        { first: 'fooA', second: 'bar', third: 'baz' },
        { first: 'bar', second: 'baz', third: 'fooB' }
      ], { showHeader: false });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  fooA  bar  baz \n  bar   baz  fooB\n');
    });

    test('inserts a separator line.', async (): Promise<void> => {
      const stop = record();

      buntstift.table([
        { first: 'fooA', second: 'bar', third: 'baz' },
        { first: 'bar', second: 'baz', third: 'fooB' }
      ]);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo([
        '  First  Second  Third\n',
        '  ─────  ──────  ─────\n',
        '  fooA   bar     baz  \n',
        '  bar    baz     fooB \n'
      ].join(''));
    });

    test('inserts a separator line with ASCII-compatible dashes if UTF8 is not available.', async (): Promise<void> => {
      const stop = record();

      buntstift.table([
        { first: 'fooA', second: 'bar', third: 'baz' },
        { first: 'bar', second: 'baz', third: 'fooB' }
      ], { isUtf8Enabled: false });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo([
        '  First  Second  Third\n',
        '  -----  ------  -----\n',
        '  fooA   bar     baz  \n',
        '  bar    baz     fooB \n'
      ].join(''));
    });
  });

  suite('raw', (): void => {
    test('writes the given message as is.', async (): Promise<void> => {
      const stop = record();

      buntstift.raw('foo\n');

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('foo\n');
    });

    test('writes a stringified message if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.raw(23);

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('23');
    });

    test('writes to stderr if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.raw('foo\n', { target: 'stderr' });

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.equalTo('foo\n');
    });
  });
});
