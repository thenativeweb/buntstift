'use strict';

const assert = require('assertthat'),
      isAnsi = require('isansi'),
      promisify = require('util.promisify'),
      record = require('record-stdstreams'),
      stripAnsi = require('strip-ansi');

const buntstift = require('../../lib/buntstift'),
      unicode = require('../../lib/unicode').utf8;

const sleep = promisify(setTimeout);

suite('buntstift', () => {
  test('is an object.', async () => {
    assert.that(buntstift).is.ofType('object');
  });

  suite('newLine', () => {
    test('is a function.', async () => {
      assert.that(buntstift.newLine).is.ofType('function');
    });

    test('writes a blank line to stdout.', async () => {
      const stop = record();

      buntstift.newLine();

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('\n');
    });

    test('does nothing when --quiet is set.', async () => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.newLine();

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async () => {
      assert.that(buntstift.newLine()).is.sameAs(buntstift);
    });
  });

  suite('success', () => {
    test('is a function.', async () => {
      assert.that(buntstift.success).is.ofType('function');
    });

    test('writes a message in green and bold to stdout.', async () => {
      const stop = record();

      buntstift.success('foo');

      const { stdout } = stop();

      assert.that(isAnsi.green(stdout)).is.true();
      assert.that(isAnsi.bold(stdout)).is.true();
    });

    test('writes a message with a check mark.', async () => {
      const stop = record();

      buntstift.success('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${unicode.checkMark} foo\n`);
    });

    test('writes a message with an ASCII-compatible check mark if --no-utf is set.', async () => {
      buntstift.noUtf();

      const stop = record();

      buntstift.success('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('+ foo\n');
      buntstift.forceUtf();
    });

    test('writes a stringified message if necessary.', async () => {
      const stop = record();

      buntstift.success(23);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${unicode.checkMark} 23\n`);
    });

    test('replaces the check mark if a prefix is explicitly given.', async () => {
      const stop = record();

      buntstift.success('foo', { prefix: '-' });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('- foo\n');
    });

    test('does nothing when --quiet is set.', async () => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.success('foo');

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async () => {
      assert.that(buntstift.success('foo')).is.sameAs(buntstift);
    });
  });

  suite('error', () => {
    test('is a function.', async () => {
      assert.that(buntstift.error).is.ofType('function');
    });

    test('writes a message in red and bold to stderr.', async () => {
      const stop = record();

      buntstift.error('foo');

      const { stderr } = stop();

      assert.that(isAnsi.red(stderr)).is.true();
      assert.that(isAnsi.bold(stderr)).is.true();
    });

    test('writes a message with a cross.', async () => {
      const stop = record();

      buntstift.error('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.crossMark} foo\n`);
    });

    test('writes a message with an ASCII-compatible cross if --no-utf is set.', async () => {
      buntstift.noUtf();

      const stop = record();

      buntstift.error('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('! foo\n');
      buntstift.forceUtf();
    });

    test('writes a stringified message if necessary.', async () => {
      const stop = record();

      buntstift.error(23);

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.crossMark} 23\n`);
    });

    test('replaces the check mark if a prefix is explicitly given.', async () => {
      const stop = record();

      buntstift.error('foo', { prefix: '-' });

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('- foo\n');
    });

    test('still works when --quiet is set.', async () => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.error('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.crossMark} foo\n`);
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async () => {
      assert.that(buntstift.error('foo')).is.sameAs(buntstift);
    });
  });

  suite('warn', () => {
    test('is a function.', async () => {
      assert.that(buntstift.warn).is.ofType('function');
    });

    test('writes a message in yellow and bold to stderr.', async () => {
      const stop = record();

      buntstift.warn('foo');

      const { stderr } = stop();

      assert.that(isAnsi.yellow(stderr)).is.true();
      assert.that(isAnsi.bold(stderr)).is.true();
    });

    test('writes a message with a pointer.', async () => {
      const stop = record();

      buntstift.warn('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.rightPointingPointer} foo\n`);
    });

    test('writes a message with an ASCII-compatible pointer if --no-utf is set.', async () => {
      buntstift.noUtf();

      const stop = record();

      buntstift.warn('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('? foo\n');
      buntstift.forceUtf();
    });

    test('writes a stringified message if necessary.', async () => {
      const stop = record();

      buntstift.warn(23);

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.rightPointingPointer} 23\n`);
    });

    test('replaces the check mark if a prefix is explicitly given.', async () => {
      const stop = record();

      buntstift.warn('foo', { prefix: '-' });

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo('- foo\n');
    });

    test('still works when --quiet is set.', async () => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.warn('foo');

      const { stderr } = stop();

      assert.that(stripAnsi(stderr)).is.equalTo(`${unicode.rightPointingPointer} foo\n`);
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async () => {
      assert.that(buntstift.warn('foo')).is.sameAs(buntstift);
    });
  });

  suite('info', () => {
    test('is a function.', async () => {
      assert.that(buntstift.info).is.ofType('function');
    });

    test('writes a message in white to stdout.', async () => {
      const stop = record();

      buntstift.info('foo');

      const { stdout } = stop();

      assert.that(isAnsi.white(stdout)).is.true();
    });

    test('writes a message with indentation.', async () => {
      const stop = record();

      buntstift.info('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  foo\n');
    });

    test('writes a stringified message if necessary.', async () => {
      const stop = record();

      buntstift.info(23);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  23\n');
    });

    test('replaces the check mark if a prefix is explicitly given.', async () => {
      const stop = record();

      buntstift.info('foo', { prefix: '-' });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('- foo\n');
    });

    test('does nothing when --quiet is set.', async () => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.info('foo');

      const { stdout } = stop();

      assert.that(stdout).is.equalTo('');
      process.argv.pop();
    });

    test('returns a reference to buntstift.', async () => {
      assert.that(buntstift.info('foo')).is.sameAs(buntstift);
    });
  });

  suite('verbose', () => {
    test('is a function.', async () => {
      assert.that(buntstift.verbose).is.ofType('function');
    });

    test('returns a reference to buntstift.', async () => {
      assert.that(buntstift.verbose('foo')).is.sameAs(buntstift);
    });

    suite('with --verbose set.', () => {
      setup(() => {
        process.argv.push('--verbose');
      });

      teardown(() => {
        process.argv.pop();
      });

      test('writes a message in gray to stdout.', async () => {
        const stop = record();

        buntstift.verbose('foo');

        const { stdout } = stop();

        assert.that(isAnsi.gray(stdout)).is.true();
      });

      test('writes a message with indentation.', async () => {
        const stop = record();

        buntstift.verbose('foo');

        const { stdout } = stop();

        assert.that(stripAnsi(stdout)).is.equalTo('  foo\n');
      });

      test('writes a stringified message if necessary.', async () => {
        const stop = record();

        buntstift.verbose(23);

        const { stdout } = stop();

        assert.that(stripAnsi(stdout)).is.equalTo('  23\n');
      });

      test('prints the explicitly given prefix.', async () => {
        const stop = record();

        buntstift.verbose('foo', { prefix: '-' });

        const { stdout } = stop();

        assert.that(stripAnsi(stdout)).is.equalTo('- foo\n');
      });

      test('does nothing when --quiet is set.', async () => {
        process.argv.push('--quiet');

        const stop = record();

        buntstift.verbose('foo');

        const { stdout } = stop();

        assert.that(stdout).is.equalTo('');
        process.argv.pop();
      });
    });

    suite('without --verbose set.', () => {
      test('does not write a message to stdout.', async () => {
        const stop = record();

        buntstift.verbose('foo');

        const { stdout } = stop();

        assert.that(stdout).is.equalTo('');
      });
    });
  });

  suite('list', () => {
    test('is a function.', async () => {
      assert.that(buntstift.list).is.ofType('function');
    });

    test('writes a message with a leading dash.', async () => {
      const stop = record();

      buntstift.list('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`${unicode.multiplicationDot} foo\n`);
    });

    test('writes a message with an ASCII-compatible dash if --no-utf is set.', async () => {
      buntstift.noUtf();

      const stop = record();

      buntstift.list('foo');

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('- foo\n');
      buntstift.forceUtf();
    });

    test('writes an indented message.', async () => {
      const stop = record();

      buntstift.list('foo', { indent: 1 });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`  ${unicode.multiplicationDot} foo\n`);
    });

    test('writes an indented message with level 2.', async () => {
      const stop = record();

      buntstift.list('foo', { indent: 2 });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo(`    ${unicode.multiplicationDot} foo\n`);
    });

    test('correctly indents even for multiple prefix characters.', async () => {
      const stop = record();

      buntstift.list('foo', { prefix: '--', indent: 1 });

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('   -- foo\n');
    });

    test('returns a reference to buntstift.', async () => {
      assert.that(buntstift.list('foo')).is.sameAs(buntstift);
    });
  });

  suite('line', () => {
    test('is a function.', async () => {
      assert.that(buntstift.line).is.ofType('function');
    });

    test('returns a reference to buntstift.', async () => {
      assert.that(buntstift.line()).is.sameAs(buntstift);
    });

    test('writes a line in gray to stdout.', async () => {
      const stop = record();

      buntstift.line();

      const { stdout } = stop();

      assert.that(isAnsi.gray(stdout)).is.true();
    });

    test('writes a line to stdout.', async () => {
      const stop = record();

      buntstift.line();

      const { stdout } = stop();

      const line = '\u2500'.repeat(process.stdout.columns || 80);

      assert.that(stripAnsi(stdout)).is.equalTo(`${line}\n`);
    });

    test('shows nothing when --quiet is set.', async () => {
      process.argv.push('--quiet');

      const stop = record();

      buntstift.line();

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.equalTo('');
      process.argv.pop();
    });
  });

  suite('table', () => {
    test('is a function.', async () => {
      assert.that(buntstift.table).is.ofType('function');
    });

    test('throws an error if now rows are given.', async () => {
      assert.that(() => {
        buntstift.table();
      }).is.throwing('Rows are missing.');
    });

    test('writes a single row.', async () => {
      const stop = record();

      buntstift.table([
        [ 'foo', 'bar', 'baz' ]
      ]);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  foo  bar  baz\n');
    });

    test('writes multiple rows.', async () => {
      const stop = record();

      buntstift.table([
        [ 'foo', 'bar', 'baz' ],
        [ 'bar', 'baz', 'foo' ]
      ]);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  foo  bar  baz\n  bar  baz  foo\n');
    });

    test('pads cells.', async () => {
      const stop = record();

      buntstift.table([
        [ 'fooA', 'bar', 'baz' ],
        [ 'bar', 'baz', 'fooB' ]
      ]);

      const { stdout } = stop();

      assert.that(stripAnsi(stdout)).is.equalTo('  fooA  bar  baz \n  bar   baz  fooB\n');
    });

    test('inserts a separator line.', async () => {
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

    test('inserts a separator line with ASCII-compatible dashes if --no-utf is set.', async () => {
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

    test('returns a reference to buntstift.', async () => {
      assert.that(buntstift.table([[ 'foo' ]])).is.sameAs(buntstift);
    });
  });

  suite('wait', () => {
    test('is a function.', async () => {
      assert.that(buntstift.wait).is.ofType('function');
    });

    test('shows a waiting indicator on stderr.', async () => {
      const stop = record();
      const stopWaiting = buntstift.wait();

      await sleep(0.2 * 1000);
      stopWaiting();

      const { stdout, stderr } = stop();

      assert.that(stdout).is.equalTo('');
      assert.that(stderr).is.not.equalTo('');
    });

    test('shows nothing when --quiet is set.', async () => {
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

  suite('option aliases', () => {
    suite('-v', () => {
      setup(() => {
        process.argv.push('-v');
      });

      teardown(() => {
        process.argv.pop();
      });

      test('is same as --verbose', async () => {
        const stop = record();

        buntstift.verbose('foo');

        const { stdout } = stop();

        assert.that(stripAnsi(stdout)).is.equalTo('  foo\n');
      });
    });

    suite('-q', () => {
      setup(() => {
        process.argv.push('-q');
      });

      teardown(() => {
        process.argv.pop();
      });

      test('is same as --quiet', async () => {
        const stop = record();

        buntstift.info('foo');

        const { stdout, stderr } = stop();

        assert.that(stdout).is.equalTo('');
        assert.that(stderr).is.equalTo('');
      });
    });
  });

  suite('exit', () => {
    test('is a function.', async () => {
      assert.that(buntstift.exit).is.ofType('function');
    });
  });
});
