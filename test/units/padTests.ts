import assert from 'assertthat';
import pad from '../../lib/pad';

<<<<<<< HEAD:test/unit/padTests.js
const assert = require('assertthat');

const pad = require('../../lib/pad');

suite('pad', () => {
  test('is a function.', async () => {
=======
suite('pad', (): void => {
  test('is a function.', async (): Promise<void> => {
>>>>>>> Migrate to TypeScript.:test/units/padTests.ts
    assert.that(pad).is.ofType('function');
  });

  suite('string', (): void => {
    test('returns a right-padded string.', async (): Promise<void> => {
      assert.that(pad('foo', 5)).is.equalTo('foo  ');
    });

    test('returns the string if it already has the desired length.', async (): Promise<void> => {
      assert.that(pad('foo', 3)).is.equalTo('foo');
    });

    test('returns a shortened string if it is too long.', async (): Promise<void> => {
      assert.that(pad('foobar', 3)).is.equalTo('fo…');
    });
  });

  suite('number', (): void => {
    test('returns a left-padded string.', async (): Promise<void> => {
      assert.that(pad(23, 5)).is.equalTo('   23');
    });

    test('returns the stringified number if it already has the desired length.', async (): Promise<void> => {
      assert.that(pad(23, 2)).is.equalTo('23');
    });

    test('returns a shortened number if it is too long.', async (): Promise<void> => {
      assert.that(pad(256, 2)).is.equalTo('2…');
    });
  });

  suite('boolean', (): void => {
    test('returns a right-padded string.', async (): Promise<void> => {
      assert.that(pad(true, 5)).is.equalTo('true ');
    });

    test('returns the stringified boolean if it already has the desired length.', async (): Promise<void> => {
      assert.that(pad(true, 4)).is.equalTo('true');
    });

    test('returns a shortened boolean if it is too long.', async (): Promise<void> => {
      assert.that(pad(true, 3)).is.equalTo('tr…');
    });
  });

  suite('undefined', (): void => {
    test('returns a right-padded string.', async (): Promise<void> => {
      assert.that(pad(undefined, 10)).is.equalTo('undefined ');
    });

    test('returns the \'undefined\' if it already has the desired length.', async (): Promise<void> => {
      assert.that(pad(undefined, 9)).is.equalTo('undefined');
    });

    test('returns a shortened value if it is too long.', async (): Promise<void> => {
      assert.that(pad(undefined, 6)).is.equalTo('undef…');
    });
  });
});
