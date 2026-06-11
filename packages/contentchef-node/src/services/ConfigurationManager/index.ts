import { IConfiguredSDK } from '../..';
import { IConfigurable } from './interfaces/IConfigurable';
import ISDKConfiguration, {
  ITargetDateResolver,
} from './interfaces/SDKConfiguration';

/**
 * @export
 * @class ConfigurationManager
 */
export default class ConfigurationManager {
  /**
   * @private
   * @readonly
   * @type {ITargetDateResolver}
   * @memberof ConfigurationManager
   */
  private readonly targetDateResolver: ITargetDateResolver;

  /**
   * @private
   * @readonly
   * @type {ISDKConfiguration}
   * @memberof ConfigurationManager
   */
  private readonly configuration: ISDKConfiguration;

  /**
   * Creates an instance of ConfigurationManager.
   * @param {ISDKConfiguration} configuration
   * @param {ITargetDateResolver | string} targetDateSource
   * @memberof ConfigurationManager
   */
  public constructor(
    configuration: ISDKConfiguration,
    targetDateSource?: ITargetDateResolver | string,
  ) {
    if (configuration === undefined) {
      throw new TypeError('Configuration cannot be undefined');
    }

    if (configuration.timeout && typeof configuration.timeout !== 'number') {
      throw new TypeError('callTimeout must be a number');
    }

    if (configuration.timeout < 0) {
      throw new TypeError('callTimeout cannot be less than 0');
    }

    if (
      configuration.host !== undefined &&
      typeof configuration.host !== 'string'
    ) {
      throw new TypeError('host must be a string');
    }

    if (
      typeof configuration.spaceId !== 'string' ||
      configuration.spaceId.trim().length === 0
    ) {
      throw new TypeError('spaceId must be a string');
    }

    const isBlankHost =
      typeof configuration.host === 'string' &&
      configuration.host.trim().length === 0;

    if (isBlankHost) {
      console.warn(
        '[contentchef-node] "host" was provided as an empty string; ' +
          'falling back to the default host. Pass `undefined` or omit it ' +
          'to silence this warning.',
      );
    }

    if (configuration.host === undefined || isBlankHost) {
      delete configuration.host;
    }

    const createFixedTargetDateResolver = (
      fixedTargetDate: string | undefined,
    ): ITargetDateResolver => ({
      getTargetDate: async () => fixedTargetDate,
    });

    if (
      typeof targetDateSource === 'string' ||
      typeof targetDateSource === 'undefined'
    ) {
      this.targetDateResolver = createFixedTargetDateResolver(targetDateSource);
    } else if (
      typeof targetDateSource === 'object' &&
      typeof targetDateSource.getTargetDate === 'function'
    ) {
      this.targetDateResolver = targetDateSource;
    } else {
      throw new TypeError(
        'TargetDateResolver is mandatory and must be a string or a ITargetDateResolver type',
      );
    }
    this.configuration = configuration;
  }

  /**
   * @param {IConfigurable} configurable
   * @returns
   * @memberof ConfigurationManager
   */
  public configure(configurable: IConfigurable) {
    const channels: IConfiguredSDK = {
      onlineChannel: configurable.configureOnlineMethods(this.configuration),
      previewChannel: configurable.configurePreviewMethods(
        this.configuration,
        this.targetDateResolver,
      ),
    };

    return channels;
  }
}
