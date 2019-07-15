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
 * @param {ISDKConfiguration} config
 */
export function createOnlineContentRequest(spaceId: string, channel: string, config: ISDKConfiguration) {
  const url = getOnlineEndpoint(spaceId, 'content', channel);

  return async <T extends object>(params: interfaces.GetContentOnlineConfig): Promise<AxiosResponse<interfaces.IGetContentResponse<T>>> => {

    return getAxiosInstance(config)(url, { params });
  };
}

/**
 * @param {string} spaceId
 * @param {string} channel
 * @param {PublishingStatus} state
 * @param {ISDKConfiguration} config
 */
export function createPreviewContentRequest(spaceId: string, channel: string, state: PublishingStatus, config: ISDKConfiguration) {
  const url = getPreviewEndpoint(spaceId, 'content', state, channel);

  return async <T extends object>(params: interfaces.GetContentPreviewConfig): Promise<AxiosResponse<interfaces.IGetContentResponse<T>>> => {
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
 * @param {string} spaceId
 * @param {string} channel
 * @param {ISDKConfiguration} config
 */
export function createOnlineSearchRequest(spaceId: string, channel: string, config: ISDKConfiguration) {
  const url = getOnlineEndpoint(spaceId, 'search/v2', channel);

  return async <T extends object>(params: interfaces.SearchOnlineConfig): Promise<AxiosResponse<interfaces.IPaginatedResponse<interfaces.ISearchResponse<T>>>> => {
    return getAxiosInstance(config)(url, { params: {
        ...params,
        propFilters: params.propFilters ? JSON.stringify(params.propFilters) : undefined,
      } });
  };
}

export function createPreviewSearchRequest(spaceId: string, channel: string, state: PublishingStatus, config: ISDKConfiguration) {
  const url = getPreviewEndpoint(spaceId, 'search/v2', state, channel);

  return async <T extends object>(params: interfaces.SearchPreviewConfig): Promise<AxiosResponse<interfaces.IPaginatedResponse<interfaces.ISearchResponse<T>>>> => {
    return getAxiosInstance(config)(url, { params : {
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
 * @param {PublishingStatus} state
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
  const contentOnline = createOnlineContentRequest(spaceId, channel, config);
  const contentPreview = createPreviewContentRequest(spaceId, channel, state, config);
  const search = createSearchRequest(spaceId, channel, state, config);
  const searchOnline = createOnlineSearchRequest(spaceId, channel, config);
  const searchPreview = createPreviewSearchRequest(spaceId, channel, state, config);

  return {
    content,
    contentOnline,
    contentPreview,
    search,
    searchOnline,
    searchPreview,
  };
}

/**
 * @param {string} spaceId
 * @param {interfaces.ContentRequestMethod} method
 * @param {PublishingStatus} state
 * @param {string} channel
 * @returns
 */
export function getEndpoint(spaceId: string, method: interfaces.ContentRequestMethod, state: PublishingStatus, channel: string) {
  return `/space/${spaceId}/${state}/${method}/${channel}`;
}

/**
 * @param {string} spaceId
 * @param {interfaces.ContentRequestMethod} method
 * @param {string} channel
 * @returns
 */
export function getOnlineEndpoint(spaceId: string, method: interfaces.ContentRequestMethod, channel: string) {
  return `/space/${spaceId}/online/${method}/${channel}`;
}

/**
 * @param {string} spaceId
 * @param {interfaces.ContentRequestMethod} method
 * @param {PublishingStatus} state
 * @param {string} channel
 * @returns
 */
export function getPreviewEndpoint(spaceId: string, method: interfaces.ContentRequestMethod, state: PublishingStatus, channel: string) {
  return `/space/${spaceId}/preview/${state}/${method}/${channel}`;
}

export * from './interfaces';

export default configure;
