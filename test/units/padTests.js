'use strict';

const assert = require('assertthat');

const pad = require('../../lib/pad');

suite('pad', () => {
  test('is a function.', done => {
    assert.that(pad).is.ofType('function');
    done();
  });

  suite('string', () => {
    test('returns a right-padded string.', done => {
      assert.that(pad('foo', 5)).is.equalTo('foo  ');
      done();
    });

    test('returns the string if it already has the desired length.', done => {
      assert.that(pad('foo', 3)).is.equalTo('foo');
      done();
    });

    test('returns a shortened string if it is too long.', done => {
      assert.that(pad('foobar', 3)).is.equalTo('fo…');
      done();
    });
  });

  suite('number', () => {
    test('returns a left-padded string.', done => {
      assert.that(pad(23, 5)).is.equalTo('   23');
      done();
    });

    test('returns the stringified number if it already has the desired length.', done => {
      assert.that(pad(23, 2)).is.equalTo('23');
      done();
    });

    test('returns a shortened number if it is too long.', done => {
      assert.that(pad(256, 2)).is.equalTo('2…');
      done();
    });
  });

  suite('boolean', () => {
    test('returns a right-padded string.', done => {
      assert.that(pad(true, 5)).is.equalTo('true ');
      done();
    });

    test('returns the stringified boolean if it already has the desired length.', done => {
      assert.that(pad(true, 4)).is.equalTo('true');
      done();
    });

    test('returns a shortened boolean if it is too long.', done => {
      assert.that(pad(true, 3)).is.equalTo('tr…');
      done();
    });
  });

  suite('undefined', () => {
    test('returns a right-padded string.', done => {
      assert.that(pad(undefined, 10)).is.equalTo('undefined ');
      done();
    });

    test('returns the \'undefined\' if it already has the desired length.', done => {
      assert.that(pad(undefined, 9)).is.equalTo('undefined');
      done();
    });

    test('returns a shortened value if it is too long.', done => {
      assert.that(pad(undefined, 6)).is.equalTo('undef…');
      done();
    });
  });
});
