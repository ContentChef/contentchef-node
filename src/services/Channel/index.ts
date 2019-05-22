import axios, { AxiosInstance, AxiosResponse } from 'axios';
import qs from 'qs';
import ISDKConfiguration from '../ConfigurationManager/interfaces/SDKConfiguration';
import * as interfaces from './interfaces';

const defaultConfig: ISDKConfiguration = <ISDKConfiguration> {

};

export enum PublishingStatus {
  Live = 'live',
  Staging = 'staging',
}

/**
 * @export
 * @param {ISDKConfiguration} config
 * @returns
 */
export function configure(config: ISDKConfiguration): interfaces.GetChannelMethods {
  return (channel: string, state: PublishingStatus = PublishingStatus.Live) => {
    return getChannelMethods(config.spaceId, channel, state, { ... defaultConfig, ... config });
  };
}

/**
 * @param {string} spaceId
 * @param {string} channel
 * @param {PublishingStatus} state
 * @returns
 */
export function createContentRequest(spaceId: string, channel: string, state: PublishingStatus, config: ISDKConfiguration) {
  const url = getEndpoint(spaceId, 'content', state, channel);

  return async <T extends object>(params: interfaces.IGetContentConfig): Promise<AxiosResponse<interfaces.IGetContentResponse<T>>> => {
    
    return getAxiosInstance(config)(url, { params });
  };
}

/**
 * @param {string} spaceId
 * @param {string} channel
 * @param {PublishingStatus} state
 * @returns
 */
export function createSearchRequest(spaceId: string, channel: string, state: PublishingStatus, config: ISDKConfiguration) {
  const url = getEndpoint(spaceId, 'search/v2', state, channel);

  return async <T extends object>(params: interfaces.ISearchConfig): Promise<AxiosResponse<interfaces.IPaginatedResponse<interfaces.ISearchResponse<T>>>> => {

    return getAxiosInstance(config)(url, { params: {
      ...params,
      propFilters: params.propFilters ? JSON.stringify(params.propFilters) : undefined,
    } });
  };
}

/**
 * Will get a configured axios instance
 * @export
 * @returns {AxiosInstance}
 */
export function getAxiosInstance(config: ISDKConfiguration): AxiosInstance {
  const instance = axios.create({
    baseURL: config.host,
    httpAgent: config.httpAgent,
    httpsAgent: config.httpsAgent,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
    proxy: config.proxy,
    timeout: config.timeout,
  });

  return instance;
}

/**
 * @param {string} spaceId
 * @param {string} channel
 * @param {interfaces.ContentState} state
 * @returns
 */
export function getChannelMethods(spaceId: string, channel: string, state: PublishingStatus, config: ISDKConfiguration): interfaces.IChannelMethods {
  if (typeof spaceId !== 'string' || spaceId.length === 0) {
    throw new TypeError('SpaceId is mandatory');
  }

  if (typeof channel !== 'string' || channel.length === 0) {
    throw new TypeError('Channel is mandatory');
  }

  if (state !== PublishingStatus.Live && state !== PublishingStatus.Staging) {
    throw new TypeError(`State must be either 'live' or 'staging'`);
  }

  const content = createContentRequest(spaceId, channel, state, config);
  const search = createSearchRequest(spaceId, channel, state, config);

  return { content, search };
}

/**
 * @param {string} spaceId
 * @param {interfaces.ContentRequestMethod} method
 * @param {interfaces.ContentState} state
 * @param {string} channel
 * @returns
 */
export function getEndpoint(spaceId: string, method: interfaces.ContentRequestMethod, state: PublishingStatus, channel: string) {
  return `/space/${spaceId}/${state}/${method}/${channel}`;
}

export * from './interfaces';

export default configure;
