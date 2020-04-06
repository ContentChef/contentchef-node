import { AxiosProxyConfig } from 'axios';

export interface ITargetDateResolver {
  getTargetDate(): Promise<string | undefined>;
}

export default interface ISDKConfiguration {
  /**
   * Your Content Chef API key
   * @type {string}
   * @memberof IContentChefConfiguration
   */
  apiKey: string;
  /**
   * Content Chef SpaceId to use
   * @type {string}
   * @memberof IContentChefConfiguration
   */
  spaceId: string;
  /**
   * Custom agent to perform HTTP requests.
   * Find further information in the
   * [axios request config documentation](https://github.com/mzabriskie/axios#request-config).
   * @type {any}
   * @memberof IConfig
   */
  httpAgent?: any;
  /**
   * Custom agent to perform HTTPS requests.
   * Find further information in the
   * [axios request config documentation](https://github.com/mzabriskie/axios#request-config).
   * @type {any}
   * @memberof IConfig
   */
  httpsAgent?: any;
  /**
   * Content Chef API Endpoint
   * @type {string}
   * @memberof IContentChefConfiguration
   */
  host?: string;
  /**
   * Axios proxy configuration.
   * See the [axios request config documentation](https://github.com/mzabriskie/axios#request-config)
   * for further information about the supported values.
   * @type {AxiosProxyConfig}
   * @memberof IConfig
   */
  proxy?: AxiosProxyConfig;
  /**
   * Sets a pending request timeout
   * @type {number}
   * @memberof IContentChefConfiguration
   */
  timeout?: number;
}
