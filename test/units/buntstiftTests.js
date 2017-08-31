'use strict';

const assert = require('assertthat'),
      isAnsi = require('isansi'),
      record = require('record-stdstreams'),
      stripAnsi = require('strip-ansi');

const buntstift = require('../../lib/buntstift'),
      unicode = require('../../lib/unicode').utf8;

suite('buntstift', () => {
  test('is an object.', done => {
    assert.that(buntstift).is.ofType('object');
    done();
  });

  suite('newLine', () => {
    test('is a function.', done => {
      assert.that(buntstift.newLine).is.ofType('function');
      done();
    });

    test('writes a blank line to stdout.', done => {
      record(stop => {
        buntstift.newLine();
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stdoutText).is.equalTo('\n');
        done();
      });
    });

    test('does nothing when --quiet is set.', done => {
      process.argv.push('--quiet');
      record(stop => {
        buntstift.newLine();
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stdoutText).is.equalTo('');
        process.argv.pop();
        done();
      });
    });

    test('returns a reference to buntstift.', done => {
      assert.that(buntstift.newLine()).is.sameAs(buntstift);
      done();
    });
  });

  suite('success', () => {
    test('is a function.', done => {
      assert.that(buntstift.success).is.ofType('function');
      done();
    });

    test('writes a message in green and bold to stdout.', done => {
      record(stop => {
        buntstift.success('foo');
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(isAnsi.green(stdoutText)).is.true();
        assert.that(isAnsi.bold(stdoutText)).is.true();
        done();
      });
    });

    test('writes a message with a check mark.', done => {
      record(stop => {
        buntstift.success('foo');
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo(`${unicode.checkMark} foo\n`);
        done();
      });
    });

    test('writes a message with an ASCII-compatible check mark if --no-utf is set.', done => {
      buntstift.noUtf();
      record(stop => {
        buntstift.success('foo');
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo('+ foo\n');
        buntstift.forceUtf();
        done();
      });
    });

    test('writes a stringified message if necessary.', done => {
      record(stop => {
        buntstift.success(23);
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo(`${unicode.checkMark} 23\n`);
        done();
      });
    });

    test('replaces the check mark if a prefix is explicitly given.', done => {
      record(stop => {
        buntstift.success('foo', { prefix: '-' });
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo('- foo\n');
        done();
      });
    });

    test('does nothing when --quiet is set.', done => {
      process.argv.push('--quiet');
      record(stop => {
        buntstift.success('foo');
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stdoutText).is.equalTo('');
        process.argv.pop();
        done();
      });
    });

    test('returns a reference to buntstift.', done => {
      assert.that(buntstift.success('foo')).is.sameAs(buntstift);
      done();
    });
  });

  suite('error', () => {
    test('is a function.', done => {
      assert.that(buntstift.error).is.ofType('function');
      done();
    });

    test('writes a message in red and bold to stderr.', done => {
      record(stop => {
        buntstift.error('foo');
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(isAnsi.red(stderrText)).is.true();
        assert.that(isAnsi.bold(stderrText)).is.true();
        done();
      });
    });

    test('writes a message with a cross.', done => {
      record(stop => {
        buntstift.error('foo');
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stderrText)).is.equalTo(`${unicode.crossMark} foo\n`);
        done();
      });
    });

    test('writes a message with an ASCII-compatible cross if --no-utf is set.', done => {
      buntstift.noUtf();
      record(stop => {
        buntstift.error('foo');
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stderrText)).is.equalTo('! foo\n');
        buntstift.forceUtf();
        done();
      });
    });

    test('writes a stringified message if necessary.', done => {
      record(stop => {
        buntstift.error(23);
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stderrText)).is.equalTo(`${unicode.crossMark} 23\n`);
        done();
      });
    });

    test('replaces the check mark if a prefix is explicitly given.', done => {
      record(stop => {
        buntstift.error('foo', { prefix: '-' });
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stderrText)).is.equalTo('- foo\n');
        done();
      });
    });

    test('still works when --quiet is set.', done => {
      process.argv.push('--quiet');
      record(stop => {
        buntstift.error('foo');
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stderrText)).is.equalTo(`${unicode.crossMark} foo\n`);
        process.argv.pop();
        done();
      });
    });

    test('returns a reference to buntstift.', done => {
      assert.that(buntstift.error('foo')).is.sameAs(buntstift);
      done();
    });
  });

  suite('warn', () => {
    test('is a function.', done => {
      assert.that(buntstift.warn).is.ofType('function');
      done();
    });

    test('writes a message in yellow and bold to stderr.', done => {
      record(stop => {
        buntstift.warn('foo');
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(isAnsi.yellow(stderrText)).is.true();
        assert.that(isAnsi.bold(stderrText)).is.true();
        done();
      });
    });

    test('writes a message with a pointer.', done => {
      record(stop => {
        buntstift.warn('foo');
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stderrText)).is.equalTo(`${unicode.rightPointingPointer} foo\n`);
        done();
      });
    });

    test('writes a message with an ASCII-compatible pointer if --no-utf is set.', done => {
      buntstift.noUtf();
      record(stop => {
        buntstift.warn('foo');
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stderrText)).is.equalTo('? foo\n');
        buntstift.forceUtf();
        done();
      });
    });

    test('writes a stringified message if necessary.', done => {
      record(stop => {
        buntstift.warn(23);
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stderrText)).is.equalTo(`${unicode.rightPointingPointer} 23\n`);
        done();
      });
    });

    test('replaces the check mark if a prefix is explicitly given.', done => {
      record(stop => {
        buntstift.warn('foo', { prefix: '-' });
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stderrText)).is.equalTo('- foo\n');
        done();
      });
    });

    test('still works when --quiet is set.', done => {
      process.argv.push('--quiet');
      record(stop => {
        buntstift.warn('foo');
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stderrText)).is.equalTo(`${unicode.rightPointingPointer} foo\n`);
        process.argv.pop();
        done();
      });
    });

    test('returns a reference to buntstift.', done => {
      assert.that(buntstift.warn('foo')).is.sameAs(buntstift);
      done();
    });
  });

  suite('info', () => {
    test('is a function.', done => {
      assert.that(buntstift.info).is.ofType('function');
      done();
    });

    test('writes a message in white to stdout.', done => {
      record(stop => {
        buntstift.info('foo');
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(isAnsi.white(stdoutText)).is.true();
        done();
      });
    });

    test('writes a message with indentation.', done => {
      record(stop => {
        buntstift.info('foo');
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo('  foo\n');
        done();
      });
    });

    test('writes a stringified message if necessary.', done => {
      record(stop => {
        buntstift.info(23);
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo('  23\n');
        done();
      });
    });

    test('replaces the check mark if a prefix is explicitly given.', done => {
      record(stop => {
        buntstift.info('foo', { prefix: '-' });
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo('- foo\n');
        done();
      });
    });

    test('does nothing when --quiet is set.', done => {
      process.argv.push('--quiet');
      record(stop => {
        buntstift.info('foo');
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stdoutText).is.equalTo('');
        process.argv.pop();
        done();
      });
    });

    test('returns a reference to buntstift.', done => {
      assert.that(buntstift.info('foo')).is.sameAs(buntstift);
      done();
    });
  });

  suite('verbose', () => {
    test('is a function.', done => {
      assert.that(buntstift.verbose).is.ofType('function');
      done();
    });

    test('returns a reference to buntstift.', done => {
      assert.that(buntstift.verbose('foo')).is.sameAs(buntstift);
      done();
    });

    suite('with --verbose set.', () => {
      setup(() => {
        process.argv.push('--verbose');
      });

      teardown(() => {
        process.argv.pop();
      });

      test('writes a message in gray to stdout.', done => {
        record(stop => {
          buntstift.verbose('foo');
          stop();
        }, (err, stdoutText) => {
          assert.that(err).is.null();
          assert.that(isAnsi.gray(stdoutText)).is.true();
          done();
        });
      });

      test('writes a message with indentation.', done => {
        record(stop => {
          buntstift.verbose('foo');
          stop();
        }, (err, stdoutText) => {
          assert.that(err).is.null();
          assert.that(stripAnsi(stdoutText)).is.equalTo('  foo\n');
          done();
        });
      });

      test('writes a stringified message if necessary.', done => {
        record(stop => {
          buntstift.verbose(23);
          stop();
        }, (err, stdoutText) => {
          assert.that(err).is.null();
          assert.that(stripAnsi(stdoutText)).is.equalTo('  23\n');
          done();
        });
      });

      test('prints the explicitly given prefix.', done => {
        record(stop => {
          buntstift.verbose('foo', { prefix: '-' });
          stop();
        }, (err, stdoutText) => {
          assert.that(err).is.null();
          assert.that(stripAnsi(stdoutText)).is.equalTo('- foo\n');
          done();
        });
      });

      test('does nothing when --quiet is set.', done => {
        process.argv.push('--quiet');
        record(stop => {
          buntstift.verbose('foo');
          stop();
        }, (err, stdoutText) => {
          assert.that(err).is.null();
          assert.that(stdoutText).is.equalTo('');
          process.argv.pop();
          done();
        });
      });
    });

    suite('without --verbose set.', () => {
      test('does not write a message to stdout.', done => {
        record(stop => {
          buntstift.verbose('foo');
          stop();
        }, (err, stdoutText) => {
          assert.that(err).is.null();
          assert.that(stdoutText).is.equalTo('');
          done();
        });
      });
    });
  });

  suite('list', () => {
    test('is a function.', done => {
      assert.that(buntstift.list).is.ofType('function');
      done();
    });

    test('writes a message with a leading dash.', done => {
      record(stop => {
        buntstift.list('foo');
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo(`${unicode.multiplicationDot} foo\n`);
        done();
      });
    });

    test('writes a message with an ASCII-compatible dash if --no-utf is set.', done => {
      buntstift.noUtf();
      record(stop => {
        buntstift.list('foo');
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo('- foo\n');
        buntstift.forceUtf();
        done();
      });
    });

    test('writes an indented message.', done => {
      record(stop => {
        buntstift.list('foo', { indent: 1 });
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo(`  ${unicode.multiplicationDot} foo\n`);
        done();
      });
    });

    test('writes an indented message with level 2.', done => {
      record(stop => {
        buntstift.list('foo', { indent: 2 });
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo(`    ${unicode.multiplicationDot} foo\n`);
        done();
      });
    });

    test('correctly indents even for multiple prefix characters.', done => {
      record(stop => {
        buntstift.list('foo', { prefix: '--', indent: 1 });
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo('   -- foo\n');
        done();
      });
    });

    test('returns a reference to buntstift.', done => {
      assert.that(buntstift.list('foo')).is.sameAs(buntstift);
      done();
    });
  });

  suite('line', () => {
    test('is a function.', done => {
      assert.that(buntstift.line).is.ofType('function');
      done();
    });

    test('returns a reference to buntstift.', done => {
      assert.that(buntstift.line()).is.sameAs(buntstift);
      done();
    });

    test('writes a line in gray to stdout.', done => {
      record(stop => {
        buntstift.line();
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(isAnsi.gray(stdoutText)).is.true();
        done();
      });
    });

    test('writes a line to stdout.', done => {
      record(stop => {
        buntstift.line();
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        const line = '\u2500'.repeat(process.stdout.columns || 80);

        assert.that(stripAnsi(stdoutText)).is.equalTo(`${line}\n`);
        done();
      });
    });

    test('shows nothing when --quiet is set.', done => {
      process.argv.push('--quiet');
      record(stop => {
        buntstift.line();
        stop();
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stdoutText).is.equalTo('');
        assert.that(stderrText).is.equalTo('');
        process.argv.pop();
        done();
      });
    });
  });

  suite('table', () => {
    test('is a function.', done => {
      assert.that(buntstift.table).is.ofType('function');
      done();
    });

    test('throws an error if now rows are given.', done => {
      assert.that(() => {
        buntstift.table();
      }).is.throwing('Rows are missing.');
      done();
    });

    test('writes a single row.', done => {
      record(stop => {
        buntstift.table([
          [ 'foo', 'bar', 'baz' ]
        ]);
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo('  foo  bar  baz\n');
        done();
      });
    });

    test('writes multiple rows.', done => {
      record(stop => {
        buntstift.table([
          [ 'foo', 'bar', 'baz' ],
          [ 'bar', 'baz', 'foo' ]
        ]);
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo('  foo  bar  baz\n  bar  baz  foo\n');
        done();
      });
    });

    test('pads cells.', done => {
      record(stop => {
        buntstift.table([
          [ 'fooA', 'bar', 'baz' ],
          [ 'bar', 'baz', 'fooB' ]
        ]);
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo('  fooA  bar  baz \n  bar   baz  fooB\n');
        done();
      });
    });

    test('inserts a separator line.', done => {
      record(stop => {
        buntstift.table([
          [ 'A', 'B', 'C' ],
          [],
          [ 'fooA', 'bar', 'baz' ],
          [ 'bar', 'baz', 'fooB' ]
        ]);
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo([
          '  A     B    C   \n',
          '  \u2500\u2500\u2500\u2500  \u2500\u2500\u2500  \u2500\u2500\u2500\u2500\n',
          '  fooA  bar  baz \n',
          '  bar   baz  fooB\n'
        ].join(''));
        done();
      });
    });

    test('inserts a separator line with ASCII-compatible dashes if --no-utf is set.', done => {
      buntstift.noUtf();
      record(stop => {
        buntstift.table([
          [ 'A', 'B', 'C' ],
          [],
          [ 'fooA', 'bar', 'baz' ],
          [ 'bar', 'baz', 'fooB' ]
        ]);
        stop();
      }, (err, stdoutText) => {
        assert.that(err).is.null();
        assert.that(stripAnsi(stdoutText)).is.equalTo([
          '  A     B    C   \n',
          '  ----  ---  ----\n',
          '  fooA  bar  baz \n',
          '  bar   baz  fooB\n'
        ].join(''));
        buntstift.forceUtf();
        done();
      });
    });

    test('returns a reference to buntstift.', done => {
      assert.that(buntstift.table([[ 'foo' ]])).is.sameAs(buntstift);
      done();
    });
  });

  suite('waitFor', () => {
    test('is a function.', done => {
      assert.that(buntstift.waitFor).is.ofType('function');
      done();
    });

    test('throws an error if worker is missing.', done => {
      assert.that(() => {
        buntstift.waitFor();
      }).is.throwing('Worker is missing.');
      done();
    });

    test('shows a waiting indicator on stderr.', done => {
      record(stopRecording => {
        buntstift.waitFor(stopWaiting => {
          setTimeout(() => {
            stopWaiting();
            stopRecording();
          }, 0.2 * 1000);
        });
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stdoutText).is.equalTo('');
        assert.that(stderrText).is.not.equalTo('');
        done();
      });
    });

    test('shows nothing when --quiet is set.', done => {
      process.argv.push('--quiet');
      record(stopRecording => {
        buntstift.waitFor(stopWaiting => {
          setTimeout(() => {
            stopWaiting();
            stopRecording();
          }, 0.2 * 1000);
        });
      }, (err, stdoutText, stderrText) => {
        assert.that(err).is.null();
        assert.that(stdoutText).is.equalTo('');
        assert.that(stderrText).is.equalTo('');
        process.argv.pop();
        done();
      });
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

      test('is same as --verbose', done => {
        record(stop => {
          buntstift.verbose('foo');
          stop();
        }, (err, stdoutText) => {
          assert.that(err).is.null();
          assert.that(stripAnsi(stdoutText)).is.equalTo('  foo\n');
          done();
        });
      });
    });

    suite('-q', () => {
      setup(() => {
        process.argv.push('-q');
      });

      teardown(() => {
        process.argv.pop();
      });

      test('is same as --quiet', done => {
        record(stop => {
          buntstift.info('foo');
          stop();
        }, (err, stdoutText, stderrText) => {
          assert.that(err).is.null();
          assert.that(stdoutText).is.equalTo('');
          assert.that(stderrText).is.equalTo('');
          done();
        });
      });
    });
  });

  suite('exit', () => {
    test('is a function.', done => {
      assert.that(buntstift.exit).is.ofType('function');
      done();
    });
  });
});
