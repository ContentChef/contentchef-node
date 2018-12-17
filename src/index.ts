import * as Channel from './services/Channel';
import ConfigurationManager from './services/ConfigurationManager';
import ISDKConfiguration from './services/ConfigurationManager/interfaces/SDKConfiguration';

/**
 * Content Chef configuration object
 * @export
 * @interface IContentChefConfiguration
 */
export interface IContentChefConfiguration extends ISDKConfiguration { }

/**
 * Configures and returns the Content Chef SDK
 * @export
 * @param {IContentChefConfiguration} configuration
 * @returns
 */
export function configure(configuration: IContentChefConfiguration) {
  const configurationManager = new ConfigurationManager(configuration);
  const channel = configurationManager.configure(Channel);
  
  return {
    channel,
  };
}

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
