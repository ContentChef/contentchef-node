import ConfigurationManager from './services/ConfigurationManager';
import ISDKConfiguration from './services/ConfigurationManager/interfaces/SDKConfiguration';
import * as Repository from './services/Repository';

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
  const repository = configurationManager.configure(Repository);
  
  return {
    repository,
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
} from './services/Repository';

export default configure;
