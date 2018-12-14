import Repository, { IConfig } from './services/Repository';

/**
 * Content Chef configuration object
 * @export
 * @interface IContentChefConfiguration
 */
export interface IContentChefConfiguration extends IConfig { }

/**
 * Configures and returns the Content Chef SDK
 * @export
 * @param {IContentChefConfiguration} configuration
 * @returns
 */
export function configure(configuration: IContentChefConfiguration) {
  if (configuration === undefined) {
    throw new TypeError('Configuration cannot be undefined');
  }

  if (typeof configuration.apiKey !== 'string') {
    throw new TypeError('apiKey must be a string');
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

  const repository = Repository(configuration);
  
  return {
    repository,
  };
}

export { 
  ContentRequestMethod,
  ContentState,
  IConfig,
  IGetContentConfig,
  IGetContentResponse,
  IRequest,
  ISearchConfig,
  ISearchResponse,
} from './services/Repository';

export default configure;
