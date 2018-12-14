import { AxiosProxyConfig } from 'axios';

export type ContentRequestMethod = 'content' | 'search';

export type ContentState = 'staging' | 'live';

/**
 * Content Chef repository configuration object
 * @export
 * @interface IContentChefConfiguration
 */
export interface IConfig {
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
  timeout?: number;
  /**
   * Custom agent to perform HTTP requests. 
   * Find further information in the 
   * [axios request config documentation](https://github.com/mzabriskie/axios#request-config).
   * @type {string}
   * @memberof IConfig
   */
  httpAgent?: string;
  /**
   * Custom agent to perform HTTPS requests.
   * Find further information in the 
   * [axios request config documentation](https://github.com/mzabriskie/axios#request-config).
   * @type {string}
   * @memberof IConfig
   */
  httpsAgent?: string;
  /**
   * Content Chef API Endpoint
   * @type {string}
   * @memberof IContentChefConfiguration
   */
  host: string;
  /**
   * Axios proxy configuration. 
   * See the [axios request config documentation](https://github.com/mzabriskie/axios#request-config) 
   * for further information about the supported values.
   * @type {AxiosProxyConfig}
   * @memberof IConfig
   */
  proxy?: AxiosProxyConfig;
}

export interface IGetContentConfig {
  legacyMetadata?: any;
  publicId?: any;
  targetDate?: any;
}

export interface IGetContentResponse<T = any> extends IResponse<T> {
  definition: string;
  publicId: string;
}

export interface IResponse<T> {
  metadata: IRequestMetadata;
  offlineDate: string | null;
  onlineDate: string | null;
  payload: T;
}

export interface IRequestMetadata {
  authoringContentId: number;
  contentLastModifiedDate: string;
  contentVersion: number;
  id: number;
  publishedOn: string;
}

export interface ISearchConfig {
  contentDefinition?: any;
  legacyMetadata?: any;
  limit?: any;
  tags?: any;
  targetDate?: any;
}

export interface ISearchResponse<T = any> extends IResponse<T> {
  requestData: ISearchResponseRequestData;
}

export interface ISearchResponseRequestData {
  publishingChannel: string;
}
