import { IConfigurable } from './interfaces/IConfigurable';
import ISDKConfiguration from './interfaces/SDKConfiguration';

/**
 * @export
 * @class ConfigurationManager
 */
export default class ConfigurationManager {
  /**
   * @protected
   * @type {ISDKConfiguration}
   * @memberof ConfigurationManager
   */
  protected configuration: ISDKConfiguration;

  /**
   * Creates an instance of ConfigurationManager.
   * @param {ISDKConfiguration} configuration
   * @memberof ConfigurationManager
   */
  public constructor(configuration: ISDKConfiguration) {
    if (configuration === undefined) {
      throw new TypeError('Configuration cannot be undefined');
    }

    if (typeof configuration.apiKey !== 'string') {
      throw new TypeError('apiKey must be a string');
    }

    if (String(configuration.apiKey).length === 0) {
      throw new TypeError('apiKey seems to be an empty string');
    }

    if (configuration.timeout && typeof configuration.timeout !== 'number') {
      throw new TypeError('callTimeout must be a number');
    }

    if (configuration.timeout < 0) {
      throw new TypeError('callTimeout cannot be less than 0');
    }

    if (typeof configuration.host !== 'string') {
      throw new TypeError('serviceRoot must be a string');
    }

    if (String(configuration.host).trim().length === 0) {
      throw new TypeError('serviceRoot seems to be an empty string');
    }

    this.configuration = configuration;
  }

  /**
   * @param {IConfigurable} configurable
   * @returns
   * @memberof ConfigurationManager
   */
  public configure(configurable: IConfigurable) {
    return {
      onlineChannel: configurable.configureOnlineMethods(this.configuration),
      previewChannel: configurable.configurePreviewMethods(this.configuration),
    };
  }
}
