import { cloneDeep } from 'lodash';

class Configuration {
  public isColorEnabled: boolean;

  public isInteractiveSession: boolean;

  public isQuietModeEnabled: boolean;

  public isUtf8Enabled: boolean;

  public isVerboseModeEnabled: boolean;

  public constructor ({
    isColorEnabled,
    isInteractiveSession,
    isQuietModeEnabled,
    isUtf8Enabled,
    isVerboseModeEnabled
  }: {
    isColorEnabled: boolean;
    isInteractiveSession: boolean;
    isQuietModeEnabled: boolean;
    isUtf8Enabled: boolean;
    isVerboseModeEnabled: boolean;
  }) {
    this.isColorEnabled = isColorEnabled;
    this.isInteractiveSession = isInteractiveSession;
    this.isQuietModeEnabled = isQuietModeEnabled;
    this.isUtf8Enabled = isUtf8Enabled;
    this.isVerboseModeEnabled = isVerboseModeEnabled;
  }

  public withColor (isColorEnabled: boolean): Configuration {
    const newConfiguration = cloneDeep(this);

    newConfiguration.isColorEnabled = isColorEnabled;

    return newConfiguration;
  }

  public withInteractiveSession (isInteractiveSession: boolean): Configuration {
    const newConfiguration = cloneDeep(this);

    newConfiguration.isInteractiveSession = isInteractiveSession;

    return newConfiguration;
  }

  public withQuietMode (isQuietModeEnabled: boolean): Configuration {
    const newConfiguration = cloneDeep(this);

    newConfiguration.isQuietModeEnabled = isQuietModeEnabled;

    return newConfiguration;
  }

  public withUtf8 (isUtf8Enabled: boolean): Configuration {
    const newConfiguration = cloneDeep(this);

    newConfiguration.isUtf8Enabled = isUtf8Enabled;

    return newConfiguration;
  }

  public withVerboseMode (isVerboseModeEnabled: boolean): Configuration {
    const newConfiguration = cloneDeep(this);

    newConfiguration.isVerboseModeEnabled = isVerboseModeEnabled;

    return newConfiguration;
  }
}

export { Configuration };
