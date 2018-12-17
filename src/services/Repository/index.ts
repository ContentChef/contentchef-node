import axios, { AxiosInstance, AxiosResponse } from 'axios';
import ISDKConfiguration from '../ConfigurationManager/interfaces/SDKConfiguration';
import * as interfaces from './interfaces';

let defaultConfig: ISDKConfiguration = <ISDKConfiguration> {};

/**
 * @export
 * @param {ISDKConfiguration} config
 * @returns
 */
export function configure(config: ISDKConfiguration) {
  defaultConfig = { ... defaultConfig, ... config };

  return getRequestMethods;
}

/**
 * @param {string} channel
 * @param {interfaces.ContentState} state
 * @returns
 */
export function createContentRequest(channel: string, state: interfaces.ContentState) {
  const url = getEndpoint('content', state, channel);
  const axiosInstance = getAxiosInstance();

  return async <T extends object>(params: interfaces.IGetContentConfig): Promise<AxiosResponse<interfaces.IGetContentResponse<T>>> => {
    return axiosInstance(url, { params }).then(response => response);
  };
}

/**
 * @param {string} channel
 * @param {interfaces.ContentState} state
 * @returns
 */
export function createSearchRequest(channel: string, state: interfaces.ContentState) {
  const url = getEndpoint('search', state, channel);
  const axiosInstance = getAxiosInstance();

  return async <T extends object>(params: interfaces.ISearchConfig): Promise<AxiosResponse<Array<interfaces.ISearchResponse<T>>>> => {
    return axiosInstance(url, { params }).then(response => response);
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
export function getEndpoint(method: interfaces.ContentRequestMethod, state: interfaces.ContentState, channel: string) {
  return `/${state}/${method}/${channel}`;
}

/**
 * @param {string} channel
 * @param {interfaces.ContentState} state
 * @returns
 */
export function getRequestMethods(channel: string, state: interfaces.ContentState) {
  if (typeof channel !== 'string') {
    throw new TypeError('Channel cannot be undefined');
  }

  if (state !== 'live' && state !== 'staging') {
    throw new TypeError(`State must be either 'live' or 'staging'`);
  }
  
  const content = createContentRequest(channel, state);
  const search = createSearchRequest(channel, state);

  return { content, search };
}

export * from './interfaces';

export default configure;
