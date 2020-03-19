import * as Channel from './services/Channel';
import { GetOnlineChannelMethods, GetPreviewChannelMethods } from './services/Channel';
import ConfigurationManager from './services/ConfigurationManager';
import ISDKConfiguration, {ITargetDateResolver} from './services/ConfigurationManager/interfaces/SDKConfiguration';
export * from './services/Channel/interfaces';

/**
 * Content Chef configuration object
 * @export
 * @interface IContentChefConfiguration
 */
export interface IContentChefConfiguration extends ISDKConfiguration { }

export interface IConfiguredSDK {
  onlineChannel: GetOnlineChannelMethods;
  previewChannel: GetPreviewChannelMethods;
}

/**
 * Configures and returns the Content Chef SDK
 * @export
 * @param {IContentChefConfiguration} configuration
 * * @param {string | ITargetDateResolver} targetDateResolver
 * @returns
 */
export function configure(configuration: IContentChefConfiguration, targetDateResolver?: string | ITargetDateResolver): IConfiguredSDK {
  const configurationManager = new ConfigurationManager(configuration, targetDateResolver);
  const { onlineChannel, previewChannel } = configurationManager.configure(Channel);
  
  return {
    onlineChannel,
    previewChannel,
  };
}

export { ITargetDateResolver } from './services/ConfigurationManager/interfaces/SDKConfiguration';

export { 
  ContentRequestMethod,
  ContentState,
  IGetContentConfig,
  IGetContentResponse,
  IResponse,
  ISearchConfig,
  ISearchResponse,
  PublishingStatus,
} from './services/Channel';

export default configure;
