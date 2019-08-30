<<<<<<< HEAD:test/unit/buntstiftTests.js
'use strict';

const { promisify } = require('util');

const assert = require('assertthat'),
      isAnsi = require('isansi'),
      record = require('record-stdstreams'),
      stripAnsi = require('strip-ansi');

const buntstift = require('../../lib/buntstift'),
      unicode = require('../../lib/unicode').utf8;
=======
import assert from 'assertthat';
import buntstift from '../../lib/buntstift';
import isAnsi from 'isansi';
import { promisify } from 'util';
import record from 'record-stdstreams';
import stripAnsi from 'strip-ansi';
import { utf8 as unicode } from '../../lib/unicode';
>>>>>>> Migrate to TypeScript.:test/units/buntstiftTests.ts

const sleep = promisify(setTimeout);

suite('buntstift', (): void => {
  test('is an object.', async (): Promise<void> => {
    assert.that(buntstift).is.ofType('object');
  });

  suite('newLine', (): void => {
    test('writes a blank line to stdout.', async (): Promise<void> => {
      const stop = record();

      buntstift.newLine();

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('\n');
    });

    test('does nothing when --quiet is set.', async (): Promise<void> => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.newLine();

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async (): Promise<void> => {
      assert.that(buntstift.newLine()).is.sameAs(buntstift);
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

      assert.that(stripAnsi(stdout)).is.equalTo(`${unicode.checkMark} foo\n`);
    });

    test('writes a message with an ASCII-compatible check mark if --no-utf is set.', async (): Promise<void> => {
      buntstift.noUtf();

      const stop = record();

      buntstift.success('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('+ foo\n');
      buntstift.forceUtf();
    });

    test('writes a stringified message if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.success(23);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${unicode.checkMark} 23\n`);
    });

    test('replaces the check mark if a prefix is explicitly given.', async (): Promise<void> => {
      const stop = record();

      buntstift.success('foo', { prefix: '-' });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('- foo\n');
    });

    test('does nothing when --quiet is set.', async (): Promise<void> => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.success('foo');

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async (): Promise<void> => {
      assert.that(buntstift.success('foo')).is.sameAs(buntstift);
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

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.crossMark} foo\n`);
    });

    test('writes a message with an ASCII-compatible cross if --no-utf is set.', async (): Promise<void> => {
      buntstift.noUtf();

      const stop = record();

      buntstift.error('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('! foo\n');
      buntstift.forceUtf();
    });

    test('writes a stringified message if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.error(23);

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.crossMark} 23\n`);
    });

    test('replaces the check mark if a prefix is explicitly given.', async (): Promise<void> => {
      const stop = record();

      buntstift.error('foo', { prefix: '-' });

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('- foo\n');
    });

    test('still works when --quiet is set.', async (): Promise<void> => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.error('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.crossMark} foo\n`);
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async (): Promise<void> => {
      assert.that(buntstift.error('foo')).is.sameAs(buntstift);
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

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.rightPointingPointer} foo\n`);
    });

    test('writes a message with an ASCII-compatible pointer if --no-utf is set.', async (): Promise<void> => {
      buntstift.noUtf();

      const stop = record();

      buntstift.warn('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('> foo\n');
      buntstift.forceUtf();
    });

    test('writes a stringified message if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.warn(23);

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.rightPointingPointer} 23\n`);
    });

    test('replaces the check mark if a prefix is explicitly given.', async (): Promise<void> => {
      const stop = record();

      buntstift.warn('foo', { prefix: '-' });

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('- foo\n');
    });

    test('still works when --quiet is set.', async (): Promise<void> => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.warn('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.rightPointingPointer} foo\n`);
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async (): Promise<void> => {
      assert.that(buntstift.warn('foo')).is.sameAs(buntstift);
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

    test('does nothing when --quiet is set.', async (): Promise<void> => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.info('foo');

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async (): Promise<void> => {
      assert.that(buntstift.info('foo')).is.sameAs(buntstift);
    });
  });

  suite('verbose', (): void => {
    test('returns a reference to buntstift.', async (): Promise<void> => {
      assert.that(buntstift.verbose('foo')).is.sameAs(buntstift);
    });

<<<<<<< HEAD:test/unit/buntstiftTests.js
    suite('with --verbose set', () => {
      setup(() => {
=======
    suite('with --verbose set', (): void => {
      setup((): void => {
>>>>>>> Migrate to TypeScript.:test/units/buntstiftTests.ts
        process.argv.push('--verbose');
      });

      teardown((): void => {
        process.argv.pop();
      });

      test('writes a message in gray to stdout.', async (): Promise<void> => {
        const stop = record();

        buntstift.verbose('foo');

        const { stdout } = stop();

        assert.that(isAnsi.gray(stdout)).is.true();
      });

      test('writes a message with indentation.', async (): Promise<void> => {
        const stop = record();

        buntstift.verbose('foo');

        const { stdout } = stop();

        assert.that(stripAnsi(stdout)).is.equalTo('  foo\n');
      });

      test('writes a stringified message if necessary.', async (): Promise<void> => {
        const stop = record();

        buntstift.verbose(23);

        const { stdout } = stop();

        assert.that(stripAnsi(stdout)).is.equalTo('  23\n');
      });

      test('prints the explicitly given prefix.', async (): Promise<void> => {
        const stop = record();

        buntstift.verbose('foo', { prefix: '-' });

        const { stdout } = stop();

        assert.that(stripAnsi(stdout)).is.equalTo('- foo\n');
      });

      test('does nothing when --quiet is set.', async (): Promise<void> => {
        process.argv.push('--quiet');

        const stop = record();

        buntstift.verbose('foo');

        const { stdout } = stop();

        assert.that(stdout).is.equalTo('');
        process.argv.pop();
      });
    });

<<<<<<< HEAD:test/unit/buntstiftTests.js
    suite('without --verbose set', () => {
      test('does not write a message to stdout.', async () => {
=======
    suite('without --verbose set', (): void => {
      test('does not write a message to stdout.', async (): Promise<void> => {
>>>>>>> Migrate to TypeScript.:test/units/buntstiftTests.ts
        const stop = record();

        buntstift.verbose('foo');

        const { stdout } = stop();

        assert.that(stdout).is.equalTo('');
      });
    });
  });

  suite('passThrough', (): void => {
    test('writes a message with indentation.', async (): Promise<void> => {
      const stop = record();

      buntstift.passThrough('foo\n');

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('  foo\n');
    });

    test('writes a stringified message if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.passThrough(23);

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('  23');
    });

    test('writes to stderr if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.passThrough('foo\n', { target: 'stderr' });

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.equalTo('  foo\n');
    });

    test('replaces the check mark if a prefix is explicitly given.', async (): Promise<void> => {
      const stop = record();

      buntstift.passThrough('foo\n', { prefix: '-' });

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('- foo\n');
    });

    test('does nothing when --quiet is set.', async (): Promise<void> => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.passThrough('foo\n');

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
      process.argv.pop();
    });

    test('ignores --quiet for stderr.', async (): Promise<void> => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.passThrough('foo\n', { target: 'stderr' });

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.equalTo('  foo\n');
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async (): Promise<void> => {
      assert.that(buntstift.passThrough('foo')).is.sameAs(buntstift);
    });
  });

  suite('header', (): void => {
    test('writes a headline with a right pointing arrow.', async (): Promise<void> => {
      const stop = record();

      buntstift.header('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${'\u2500'.repeat(process.stdout.columns || 80)}\n${unicode.rightPointingPointer} foo\n${'\u2500'.repeat(process.stdout.columns || 80)}\n`);
    });

    test('writes a headline with an ASCII-compatible right pointing arrow if --no-utf is set.', async (): Promise<void> => {
      buntstift.noUtf();

      const stop = record();

      buntstift.header('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${'\u2500'.repeat(process.stdout.columns || 80)}\n> foo\n${'\u2500'.repeat(process.stdout.columns || 80)}\n`);
      buntstift.forceUtf();
    });

    test('writes a stringified headline if necessary.', async (): Promise<void> => {
      const stop = record();

      buntstift.header(23);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${'\u2500'.repeat(process.stdout.columns || 80)}\n${unicode.rightPointingPointer} 23\n${'\u2500'.repeat(process.stdout.columns || 80)}\n`);
    });

    test('replaces the right pointing pointer if a prefix is explicitly given.', async (): Promise<void> => {
      const stop = record();

      buntstift.header('foo', { prefix: '-' });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${'\u2500'.repeat(process.stdout.columns || 80)}\n- foo\n${'\u2500'.repeat(process.stdout.columns || 80)}\n`);
    });

    test('does nothing when --quiet is set.', async (): Promise<void> => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.header('foo');

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async (): Promise<void> => {
      assert.that(buntstift.header('foo')).is.sameAs(buntstift);
    });
  });

  suite('list', (): void => {
    test('writes a message with a leading dash.', async (): Promise<void> => {
      const stop = record();

      buntstift.list('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${unicode.multiplicationDot} foo\n`);
    });

    test('writes a message with an ASCII-compatible dash if --no-utf is set.', async (): Promise<void> => {
      buntstift.noUtf();

      const stop = record();

      buntstift.list('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('- foo\n');
      buntstift.forceUtf();
    });

    test('writes an indented message.', async (): Promise<void> => {
      const stop = record();

      buntstift.list('foo', { indent: 1 });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`  ${unicode.multiplicationDot} foo\n`);
    });

    test('writes an indented message with level 2.', async (): Promise<void> => {
      const stop = record();

      buntstift.list('foo', { indent: 2 });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`    ${unicode.multiplicationDot} foo\n`);
    });

    test('correctly indents even for multiple prefix characters.', async (): Promise<void> => {
      const stop = record();

      buntstift.list('foo', { prefix: '--', indent: 1 });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('   -- foo\n');
    });

    test('returns a reference to buntstift.', async (): Promise<void> => {
      assert.that(buntstift.list('foo')).is.sameAs(buntstift);
    });
  });

  suite('line', (): void => {
    test('returns a reference to buntstift.', async (): Promise<void> => {
      assert.that(buntstift.line()).is.sameAs(buntstift);
    });

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

      const line = '\u2500'.repeat(process.stdout.columns || 80);

      assert.that(stripAnsi(stdout)).is.equalTo(`${line}\n`);
    });

    test('shows nothing when --quiet is set.', async (): Promise<void> => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.line();

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.equalTo('');
      process.argv.pop();
    });
  });

  suite('table', (): void => {
    test('writes a single row.', async (): Promise<void> => {
      const stop = record();

      buntstift.table([
        [ 'foo', 'bar', 'baz' ]
      ]);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  foo  bar  baz\n');
    });

    test('writes multiple rows.', async (): Promise<void> => {
      const stop = record();

      buntstift.table([
        [ 'foo', 'bar', 'baz' ],
        [ 'bar', 'baz', 'foo' ]
      ]);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  foo  bar  baz\n  bar  baz  foo\n');
    });

    test('pads cells.', async (): Promise<void> => {
      const stop = record();

      buntstift.table([
        [ 'fooA', 'bar', 'baz' ],
        [ 'bar', 'baz', 'fooB' ]
      ]);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  fooA  bar  baz \n  bar   baz  fooB\n');
    });

    test('inserts a separator line.', async (): Promise<void> => {
      const stop = record();

      buntstift.table([
        [ 'A', 'B', 'C' ],
        [],
        [ 'fooA', 'bar', 'baz' ],
        [ 'bar', 'baz', 'fooB' ]
      ]);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo([
        '  A     B    C   \n',
        '  \u2500\u2500\u2500\u2500  \u2500\u2500\u2500  \u2500\u2500\u2500\u2500\n',
        '  fooA  bar  baz \n',
        '  bar   baz  fooB\n'
      ].join(''));
    });

    test('inserts a separator line with ASCII-compatible dashes if --no-utf is set.', async (): Promise<void> => {
      buntstift.noUtf();

      const stop = record();

      buntstift.table([
        [ 'A', 'B', 'C' ],
        [],
        [ 'fooA', 'bar', 'baz' ],
        [ 'bar', 'baz', 'fooB' ]
      ]);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo([
        '  A     B    C   \n',
        '  ----  ---  ----\n',
        '  fooA  bar  baz \n',
        '  bar   baz  fooB\n'
      ].join(''));
      buntstift.forceUtf();
    });

    test('returns a reference to buntstift.', async (): Promise<void> => {
      assert.that(buntstift.table([[ 'foo' ]])).is.sameAs(buntstift);
    });
  });

  suite('wait', (): void => {
    test('shows a waiting indicator on stderr.', async (): Promise<void> => {
      const oldIsTTY = process.stdout.isTTY;

      process.stdout.isTTY = true;

      const stop = record();
      const stopWaiting = buntstift.wait();

      await sleep(0.2 * 1000);
      stopWaiting();

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.not.equalTo('');

      process.stdout.isTTY = oldIsTTY;
    });

    test('shows nothing when the application is not in interactive mode.', async (): Promise<void> => {
      const stop = record();
      const stopWaiting = buntstift.wait();

      await sleep(0.2 * 1000);
      stopWaiting();

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.equalTo('');
      process.argv.pop();
    });

    test('shows nothing when --quiet is set.', async (): Promise<void> => {
      process.argv.push('--quiet');

      const stop = record();
      const stopWaiting = buntstift.wait();

      await sleep(0.2 * 1000);
      stopWaiting();

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.equalTo('');
      process.argv.pop();
    });
  });

  suite('option aliases', (): void => {
    suite('-v', (): void => {
      setup((): void => {
        process.argv.push('-v');
      });

      teardown((): void => {
        process.argv.pop();
      });

<<<<<<< HEAD:test/unit/buntstiftTests.js
      test('is same as --verbose.', async () => {
=======
      test('is same as --verbose.', async (): Promise<void> => {
>>>>>>> Migrate to TypeScript.:test/units/buntstiftTests.ts
        const stop = record();

        buntstift.verbose('foo');

        const { stdout } = stop();

        assert.that(stripAnsi(stdout)).is.equalTo('  foo\n');
      });
    });

    suite('-q', (): void => {
      setup((): void => {
        process.argv.push('-q');
      });

      teardown((): void => {
        process.argv.pop();
      });

<<<<<<< HEAD:test/unit/buntstiftTests.js
      test('is same as --quiet.', async () => {
=======
      test('is same as --quiet.', async (): Promise<void> => {
>>>>>>> Migrate to TypeScript.:test/units/buntstiftTests.ts
        const stop = record();

        buntstift.info('foo');

        const { stdout, stderr } = stop();

        assert.that(stdout).is.equalTo('');
        assert.that(stderr).is.equalTo('');
      });
    });
  });
});
