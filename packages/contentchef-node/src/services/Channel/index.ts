import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { stringify } from 'qs';
import ISDKConfiguration, { IChannelConfiguration, ITargetDateResolver } from '../ConfigurationManager/interfaces/SDKConfiguration';
import * as interfaces from './interfaces';
import serializeSorting from './serializeSorting';

const defaultConfig: ISDKConfiguration = <ISDKConfiguration>{
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
  return (apiKey: string, channel: string, state: PublishingStatus = PublishingStatus.Live, locale?: string) => {
    return getPreviewChannelMethods(config.spaceId, channel, state, { ...defaultConfig, ...config, apiKey, locale }, targetDateResolver);
  };
}

/**
 * @export
 * @param {ISDKConfiguration} config
 * @returns
 */
export function configureOnlineMethods(config: ISDKConfiguration): interfaces.GetOnlineChannelMethods {
  return (apiKey: string, channel: string, locale?: string) => {
    return getOnlineChannelMethods(config.spaceId, channel, { ...defaultConfig, ...config, apiKey, locale });
  };
}

/**
 * @param {string} spaceId
 * @param {string} channel
 * @param {ISDKConfiguration} config
 */
export function createOnlineContentRequest(spaceId: string, channel: string, config: IChannelConfiguration, locale?: string) {
  const url = getOnlineEndpoint(spaceId, 'content', channel, locale);

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
export function createPreviewContentRequest(spaceId: string, channel: string, state: PublishingStatus, config: IChannelConfiguration, targetDateResolver: ITargetDateResolver, locale?: string) {
  const url = getPreviewEndpoint(spaceId, 'content', state, channel, locale);

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
export function createOnlineSearchRequest(spaceId: string, channel: string, config: IChannelConfiguration, locale?: string) {
  const url = getOnlineEndpoint(spaceId, 'search/v2', channel, locale);

  return async <T extends object>(params: interfaces.SearchOnlineConfig): Promise<AxiosResponse<interfaces.IPaginatedResponse<interfaces.IResponse<T>>>> => {
    return getAxiosInstance(config)(url, {
      params: {
        ...params,
        propFilters: params.propFilters ? JSON.stringify(params.propFilters) : undefined,
        sorting: serializeSorting(params.sorting),
      },
    });
  };
}

export function createPreviewSearchRequest(spaceId: string, channel: string, state: PublishingStatus, config: IChannelConfiguration, targetDateResolver: ITargetDateResolver, locale?: string) {
  const url = getPreviewEndpoint(spaceId, 'search/v2', state, channel, locale);

  return async <T extends object>(params: interfaces.SearchPreviewConfig): Promise<AxiosResponse<interfaces.IPaginatedResponse<interfaces.IResponse<T>>>> => {
    const targetDate = await targetDateResolver.getTargetDate();
    return getAxiosInstance(config)(url, {
      params: {
        ...params,
        propFilters: params.propFilters ? JSON.stringify(params.propFilters) : undefined,
        sorting: serializeSorting(params.sorting),
        targetDate,
      },
    });
  };
}

/**
 * Will get a configured axios instance
 * @export
 * @returns {AxiosInstance}
 */
export function getAxiosInstance(config: IChannelConfiguration): AxiosInstance {
  const instance = axios.create({
    baseURL: config.host,
    headers: {
      'X-Chef-Key': config.apiKey,
    },
    httpAgent: config.httpAgent,
    httpsAgent: config.httpsAgent,
    paramsSerializer: params => stringify(params, { arrayFormat: 'repeat' }),
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
  config: IChannelConfiguration,
  targetDateResolver: ITargetDateResolver,
): interfaces.IChannelMethods {
  if (typeof spaceId !== 'string' || spaceId.length === 0) {
    throw new TypeError('SpaceId is mandatory');
  }

  if (typeof channel !== 'string' || channel.length === 0) {
    throw new TypeError('Channel is mandatory');
  }

  if (state !== PublishingStatus.Live && state !== PublishingStatus.Staging) {
    throw new TypeError(`State must be either 'live' or 'staging'`);
  }

  if (typeof config.apiKey !== 'string' || config.apiKey.length === 0) {
    throw new TypeError(`apiKey is mandatory`);
  }

  if (config.locale && typeof config.locale !== 'string') {
    throw new TypeError('Property locale must be a string');
  }

  const content = createPreviewContentRequest(spaceId, channel, state, config, targetDateResolver);
  const search = createPreviewSearchRequest(spaceId, channel, state, config, targetDateResolver);
  const localizedContent = createPreviewContentRequest(spaceId, channel, state, config, targetDateResolver, config.locale);
  const localizedSearch = createPreviewSearchRequest(spaceId, channel, state, config, targetDateResolver, config.locale);
  return {
    content,
    localizedContent,
    localizedSearch,
    search,
  };
}

/**
 * @param {string} spaceId
 * @param {string} channel
 * @param {ISDKConfiguration} config
 * @returns
 */
export function getOnlineChannelMethods(spaceId: string, channel: string, config: IChannelConfiguration): interfaces.IChannelMethods {
  if (typeof spaceId !== 'string' || spaceId.length === 0) {
    throw new TypeError('SpaceId is mandatory');
  }

  if (typeof channel !== 'string' || channel.length === 0) {
    throw new TypeError('Channel is mandatory');
  }

  if (typeof config.apiKey !== 'string' || config.apiKey.length === 0) {
    throw new TypeError(`apiKey is mandatory`);
  }

  if (config.locale && typeof config.locale !== 'string') {
    throw new TypeError('Property locale must be a string');
  }

  const content = createOnlineContentRequest(spaceId, channel, config);
  const search = createOnlineSearchRequest(spaceId, channel, config);
  const localizedContent = createOnlineContentRequest(spaceId, channel, config, config.locale);
  const localizedSearch = createOnlineSearchRequest(spaceId, channel, config, config.locale);

  return {
    content,
    localizedContent,
    localizedSearch,
    search,
  };
}

/**
 * @param {string} spaceId
 * @param {interfaces.ContentRequestMethod} method
 * @param {string} channel
 * @returns
 */
export function getOnlineEndpoint(spaceId: string, method: interfaces.ContentRequestMethod, channel: string, locale?: string) {
  return `/space/${spaceId}/online/${method}/${channel}${locale ? `/${locale}` : ''}`;
}

/**
 * @param {string} spaceId
 * @param {interfaces.ContentRequestMethod} method
 * @param {PublishingStatus} state
 * @param {string} channel
 * @returns
 */
export function getPreviewEndpoint(spaceId: string, method: interfaces.ContentRequestMethod, state: PublishingStatus, channel: string, locale?: string) {
  return `/space/${spaceId}/preview/${state}/${method}/${channel}${locale ? `/${locale}` : ''}`;
}

export * from './interfaces';
