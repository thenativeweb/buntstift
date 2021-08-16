import { ColorLevel } from './ColorLevel';
import { Level } from 'chalk';

class Configuration {
  public colorLevel: ColorLevel;

  public isInteractiveSession: boolean;

  public isQuietModeEnabled: boolean;

  public isUtf8Enabled: boolean;

  public isVerboseModeEnabled: boolean;

  public constructor ({
    colorLevel,
    isInteractiveSession,
    isQuietModeEnabled,
    isUtf8Enabled,
    isVerboseModeEnabled
  }: {
    colorLevel: ColorLevel;
    isInteractiveSession: boolean;
    isQuietModeEnabled: boolean;
    isUtf8Enabled: boolean;
    isVerboseModeEnabled: boolean;
  }) {
    this.colorLevel = colorLevel;
    this.isInteractiveSession = isInteractiveSession;
    this.isQuietModeEnabled = isQuietModeEnabled;
    this.isUtf8Enabled = isUtf8Enabled;
    this.isVerboseModeEnabled = isVerboseModeEnabled;
  }

  public clone (): Configuration {
    const clonedConfiguration = new Configuration({
      colorLevel: this.colorLevel,
      isInteractiveSession: this.isInteractiveSession,
      isQuietModeEnabled: this.isQuietModeEnabled,
      isUtf8Enabled: this.isUtf8Enabled,
      isVerboseModeEnabled: this.isVerboseModeEnabled
    });

    return clonedConfiguration;
  }

  public withColorLevel (colorLevel: Level): Configuration {
    const newConfiguration = this.clone();

    newConfiguration.colorLevel = colorLevel;

    return newConfiguration;
  }

  public withInteractiveSession (isInteractiveSession: boolean): Configuration {
    const newConfiguration = this.clone();

    newConfiguration.isInteractiveSession = isInteractiveSession;

    return newConfiguration;
  }

  public withQuietMode (isQuietModeEnabled: boolean): Configuration {
    const newConfiguration = this.clone();

    newConfiguration.isQuietModeEnabled = isQuietModeEnabled;

    return newConfiguration;
  }

  public withUtf8 (isUtf8Enabled: boolean): Configuration {
    const newConfiguration = this.clone();

    newConfiguration.isUtf8Enabled = isUtf8Enabled;

    return newConfiguration;
  }

  public withVerboseMode (isVerboseModeEnabled: boolean): Configuration {
    const newConfiguration = this.clone();

    newConfiguration.isVerboseModeEnabled = isVerboseModeEnabled;

    return newConfiguration;
  }
}

export { Configuration };
