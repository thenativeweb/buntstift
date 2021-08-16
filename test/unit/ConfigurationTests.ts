import { assert } from 'assertthat';
import { ColorLevel } from '../../lib/ColorLevel';
import { Configuration } from '../../lib/Configuration';

suite('Configuration', (): void => {
  test('uses the given values.', async (): Promise<void> => {
    const configuration = new Configuration({
      colorLevel: ColorLevel.Ansi,
      isInteractiveSession: false,
      isQuietModeEnabled: true,
      isUtf8Enabled: false,
      isVerboseModeEnabled: true
    });

    assert.that(configuration.colorLevel).is.equalTo(ColorLevel.Ansi);
    assert.that(configuration.isInteractiveSession).is.false();
    assert.that(configuration.isQuietModeEnabled).is.true();
    assert.that(configuration.isUtf8Enabled).is.false();
    assert.that(configuration.isVerboseModeEnabled).is.true();
  });

  suite('clone', (): void => {
    test('returns a cloned configuration.', async (): Promise<void> => {
      const configuration = new Configuration({
        colorLevel: ColorLevel.Ansi,
        isInteractiveSession: false,
        isQuietModeEnabled: true,
        isUtf8Enabled: false,
        isVerboseModeEnabled: true
      });

      const clonedConfiguration = configuration.clone();

      assert.that(clonedConfiguration).is.equalTo(configuration);
      assert.that(clonedConfiguration).is.not.identicalTo(configuration);
    });
  });

  suite('withColorLevel', (): void => {
    test('sets the color level.', async (): Promise<void> => {
      const configuration = new Configuration({
        colorLevel: ColorLevel.Ansi,
        isInteractiveSession: true,
        isQuietModeEnabled: true,
        isUtf8Enabled: true,
        isVerboseModeEnabled: true
      }).withColorLevel(ColorLevel.Truecolor);

      assert.that(configuration.colorLevel).is.equalTo(ColorLevel.Truecolor);
    });
  });

  suite('withInteractiveSession', (): void => {
    test('enables interactive session mode if set to true.', async (): Promise<void> => {
      const configuration = new Configuration({
        colorLevel: ColorLevel.Ansi,
        isInteractiveSession: false,
        isQuietModeEnabled: true,
        isUtf8Enabled: true,
        isVerboseModeEnabled: true
      }).withInteractiveSession(true);

      assert.that(configuration.isInteractiveSession).is.true();
    });

    test('disables interactive session mode if set to false.', async (): Promise<void> => {
      const configuration = new Configuration({
        colorLevel: ColorLevel.Ansi,
        isInteractiveSession: true,
        isQuietModeEnabled: true,
        isUtf8Enabled: true,
        isVerboseModeEnabled: true
      }).withInteractiveSession(false);

      assert.that(configuration.isInteractiveSession).is.false();
    });
  });

  suite('withQuietMode', (): void => {
    test('enables quiet mode if set to true.', async (): Promise<void> => {
      const configuration = new Configuration({
        colorLevel: ColorLevel.Ansi,
        isInteractiveSession: true,
        isQuietModeEnabled: false,
        isUtf8Enabled: true,
        isVerboseModeEnabled: true
      }).withQuietMode(true);

      assert.that(configuration.isQuietModeEnabled).is.true();
    });

    test('disables quiet mode if set to false.', async (): Promise<void> => {
      const configuration = new Configuration({
        colorLevel: ColorLevel.Ansi,
        isInteractiveSession: true,
        isQuietModeEnabled: true,
        isUtf8Enabled: true,
        isVerboseModeEnabled: true
      }).withQuietMode(false);

      assert.that(configuration.isQuietModeEnabled).is.false();
    });
  });

  suite('withUtf8', (): void => {
    test('enables UTF8 mode if set to true.', async (): Promise<void> => {
      const configuration = new Configuration({
        colorLevel: ColorLevel.Ansi,
        isInteractiveSession: true,
        isQuietModeEnabled: true,
        isUtf8Enabled: false,
        isVerboseModeEnabled: true
      }).withUtf8(true);

      assert.that(configuration.isUtf8Enabled).is.true();
    });

    test('disables UTF8 mode if set to false.', async (): Promise<void> => {
      const configuration = new Configuration({
        colorLevel: ColorLevel.Ansi,
        isInteractiveSession: true,
        isQuietModeEnabled: true,
        isUtf8Enabled: true,
        isVerboseModeEnabled: true
      }).withUtf8(false);

      assert.that(configuration.isUtf8Enabled).is.false();
    });
  });

  suite('withVerboseMode', (): void => {
    test('enables verbose mode if set to true.', async (): Promise<void> => {
      const configuration = new Configuration({
        colorLevel: ColorLevel.Ansi,
        isInteractiveSession: true,
        isQuietModeEnabled: true,
        isUtf8Enabled: true,
        isVerboseModeEnabled: false
      }).withVerboseMode(true);

      assert.that(configuration.isVerboseModeEnabled).is.true();
    });

    test('disables verbose mode if set to false.', async (): Promise<void> => {
      const configuration = new Configuration({
        colorLevel: ColorLevel.Ansi,
        isInteractiveSession: true,
        isQuietModeEnabled: true,
        isUtf8Enabled: true,
        isVerboseModeEnabled: true
      }).withVerboseMode(false);

      assert.that(configuration.isVerboseModeEnabled).is.false();
    });
  });
});
