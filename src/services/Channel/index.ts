import axios, { AxiosInstance, AxiosResponse } from 'axios';
import qs from 'qs';
import ISDKConfiguration from '../ConfigurationManager/interfaces/SDKConfiguration';
import * as interfaces from './interfaces';

let defaultConfig: ISDKConfiguration = <ISDKConfiguration> {};

export enum PublishingStatus {
  Live = 'live',
  Staging = 'staging',
}

/**
 * @export
 * @param {ISDKConfiguration} config
 * @returns
 */
export function configure(config: ISDKConfiguration): interfaces.GetRequestMethods {
  defaultConfig = { ... defaultConfig, ... config };

  return getRequestMethods;
}

/**
 * @param {string} channel
 * @param {PublishingStatus} state
 * @returns
 */
export function createContentRequest(channel: string, state: PublishingStatus) {
  const url = getEndpoint('content', state, channel);

  return async <T extends object>(params: interfaces.IGetContentConfig): Promise<AxiosResponse<interfaces.IGetContentResponse<T>>> => {
    return getAxiosInstance()(url, { params });
  };
}

/**
 * @param {string} channel
 * @param {PublishingStatus} state
 * @returns
 */
export function createSearchRequest(channel: string, state: PublishingStatus) {
  const url = getEndpoint('search', state, channel);

  return async <T extends object>(params: interfaces.ISearchConfig): Promise<AxiosResponse<Array<interfaces.ISearchResponse<T>>>> => {
    return getAxiosInstance()(url, { params });
  };
}

/**
 * Will get a configured axios instance
 * @export
 * @returns {AxiosInstance}
 */
export function getAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: defaultConfig.host,
    httpAgent: defaultConfig.httpAgent,
    httpsAgent: defaultConfig.httpsAgent,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
    proxy: defaultConfig.proxy,
    timeout: defaultConfig.timeout,
  });

  return instance;
}

/**
 * @param {interfaces.ContentRequestMethod} method
 * @param {interfaces.ContentState} state
 * @param {string} channel
 * @returns
 */
export function getEndpoint(method: interfaces.ContentRequestMethod, state: PublishingStatus, channel: string) {
  return `/${state}/${method}/${channel}`;
}

/**
 * @param {string} channel
 * @param {interfaces.ContentState} state
 * @returns
 */
export function getRequestMethods(channel: string, state: PublishingStatus = PublishingStatus.Live): interfaces.IGetRequestMethodsList {
  if (typeof channel !== 'string') {
    throw new TypeError('Channel cannot be undefined');
  }

  if (state !== PublishingStatus.Live && state !== PublishingStatus.Staging) {
    throw new TypeError(`State must be either 'live' or 'staging'`);
  }
  
  const content = createContentRequest(channel, state);
  const search = createSearchRequest(channel, state);

  return { content, search };
}

export * from './interfaces';

export default configure;
