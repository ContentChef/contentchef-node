import axios, { AxiosInstance, AxiosResponse } from 'axios';
import qs from 'qs';
import ISDKConfiguration, { ITargetDateResolver } from '../ConfigurationManager/interfaces/SDKConfiguration';
import * as interfaces from './interfaces';
import serializeSorting from './serializeSorting';

const defaultConfig: ISDKConfiguration = <ISDKConfiguration> {
  host: 'https://api.contentchef.io',
};

export enum PublishingStatus {
  Live = 'live',
  Staging = 'staging',
}

/**
 * @export
 * @param {ISDKConfiguration} config
 * @param {ITargetDateResolver} targetDateResolver
 * @returns
 */
export function configurePreviewMethods(config: ISDKConfiguration, targetDateResolver: ITargetDateResolver): interfaces.GetPreviewChannelMethods {
  return (channel: string, state: PublishingStatus = PublishingStatus.Live) => {
    return getPreviewChannelMethods(config.spaceId, channel, state, { ... defaultConfig, ... config }, targetDateResolver);
  };
}

/**
 * @export
 * @param {ISDKConfiguration} config
 * @returns
 */
export function configureOnlineMethods(config: ISDKConfiguration): interfaces.GetOnlineChannelMethods {
  return (channel: string) => {
    return getOnlineChannelMethods(config.spaceId, channel, { ...defaultConfig, ... config });
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
 * @param {ITargetDateResolver} targetDateResolver
 * @param {ISDKConfiguration} config
 */
export function createPreviewContentRequest(spaceId: string, channel: string, state: PublishingStatus, config: ISDKConfiguration, targetDateResolver: ITargetDateResolver) {
  const url = getPreviewEndpoint(spaceId, 'content', state, channel);

  return async <T extends object>(params: interfaces.GetContentPreviewConfig): Promise<AxiosResponse<interfaces.IGetContentResponse<T>>> => {
    const targetDate = await targetDateResolver.getTargetDate();
    return getAxiosInstance(config)(url, {
      params: {
        ...params,
        targetDate,
      },
    });
  };
}

/**
 * @param {string} spaceId
 * @param {string} channel
 * @param {ISDKConfiguration} config
 */
export function createOnlineSearchRequest(spaceId: string, channel: string, config: ISDKConfiguration) {
  const url = getOnlineEndpoint(spaceId, 'search/v2', channel);

  return async <T extends object>(params: interfaces.SearchOnlineConfig): Promise<AxiosResponse<interfaces.IPaginatedResponse<interfaces.IResponse<T>>>> => {
    return getAxiosInstance(config)(url, { params: {
        ...params,
        propFilters: params.propFilters ? JSON.stringify(params.propFilters) : undefined,
        sorting: serializeSorting(params.sorting),
      } });
  };
}

export function createPreviewSearchRequest(spaceId: string, channel: string, state: PublishingStatus, config: ISDKConfiguration, targetDateResolver: ITargetDateResolver) {
  const url = getPreviewEndpoint(spaceId, 'search/v2', state, channel);

  return async <T extends object>(params: interfaces.SearchPreviewConfig): Promise<AxiosResponse<interfaces.IPaginatedResponse<interfaces.IResponse<T>>>> => {
    const targetDate = await targetDateResolver.getTargetDate();
    return getAxiosInstance(config)(url, { params : {
        ...params,
        propFilters: params.propFilters ? JSON.stringify(params.propFilters) : undefined,
        sorting: serializeSorting(params.sorting),
        targetDate,
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
 * @param {ISDKConfiguration} config
 * @param {ITargetDateResolver} targetDateResolver
 * @returns
 */
export function getPreviewChannelMethods(
    spaceId: string,
    channel: string,
    state: PublishingStatus,
    config: ISDKConfiguration,
    targetDateResolver: ITargetDateResolver,
): interfaces.IPreviewChannelMethods {
  if (typeof spaceId !== 'string' || spaceId.length === 0) {
    throw new TypeError('SpaceId is mandatory');
  }

  if (typeof channel !== 'string' || channel.length === 0) {
    throw new TypeError('Channel is mandatory');
  }

  if (state !== PublishingStatus.Live && state !== PublishingStatus.Staging) {
    throw new TypeError(`State must be either 'live' or 'staging'`);
  }

  const content = createPreviewContentRequest(spaceId, channel, state, config, targetDateResolver);
  const search = createPreviewSearchRequest(spaceId, channel, state, config, targetDateResolver);

  return {
    content,
    search,
  };
}

/**
 * @param {string} spaceId
 * @param {string} channel
 * @param {ISDKConfiguration} config
 * @returns
 */
export function getOnlineChannelMethods(spaceId: string, channel: string, config: ISDKConfiguration): interfaces.IOnlineChannelMethods {
  if (typeof spaceId !== 'string' || spaceId.length === 0) {
    throw new TypeError('SpaceId is mandatory');
  }

  if (typeof channel !== 'string' || channel.length === 0) {
    throw new TypeError('Channel is mandatory');
  }

  const content = createOnlineContentRequest(spaceId, channel, config);
  const search = createOnlineSearchRequest(spaceId, channel, config);

  return {
    content,
    search,
  };
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
