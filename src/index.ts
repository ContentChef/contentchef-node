import ContentChef from './services/ContentChef';

/**
 * Content Chef configuration object
 * @export
 * @interface IContentChefConfiguration
 */
export interface IContentChefConfiguration {
  /**
   * Your Content Chef API key
   * @type {string}
   * @memberof IContentChefConfiguration
   */
  apiKey: string;
  /**
   * Sets a pending request timeout
   * @type {number}
   * @memberof IContentChefConfiguration
   */
  callTimeout?: number;
  /**
   * Content Chef API Endpoint
   * @type {string}
   * @memberof IContentChefConfiguration
   */
  serviceRoot: string;
}

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

  if (configuration.callTimeout && typeof configuration.callTimeout !== 'number') {
    throw new TypeError('callTimeout must be a number');
  }

  if (configuration.callTimeout < 0) {
    throw new TypeError('callTimeout cannot be less than 0');
  }

  if (typeof configuration.serviceRoot !== 'string') {
    throw new TypeError('serviceRoot must be a string');
  }

  const repository = ContentChef(configuration);
  
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
} from './services/ContentChef';

export default configure;
