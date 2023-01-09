import ISDKConfiguration, { IChannelConfiguration, ITargetDateResolver } from '../ConfigurationManager/interfaces/SDKConfiguration';
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

  return async <T extends object>(params: interfaces.GetContentOnlineConfig): Promise<interfaces.MethodResponse<interfaces.IGetContentResponse<T>>> => {
  
    const searchParams: URLSearchParams = createGetContentRequestURLSearchParams(params, undefined);
    return executeFetchRequest(config, url, searchParams)
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

  return async <T extends object>(params: interfaces.GetContentPreviewConfig):  Promise<interfaces.MethodResponse<interfaces.IGetContentResponse<T>>> => {
    const targetDate = await targetDateResolver.getTargetDate();

    const searchParams: URLSearchParams = createGetContentRequestURLSearchParams(params, targetDate);
    return executeFetchRequest(config, url, searchParams)
  };
}

/**
 * @param {string} spaceId
 * @param {string} channel
 * @param {ISDKConfiguration} config
 */
export function createOnlineSearchRequest(spaceId: string, channel: string, config: IChannelConfiguration, locale?: string) {
  const url = getOnlineEndpoint(spaceId, 'search/v2', channel, locale);

  return async <T extends object>(params: interfaces.SearchOnlineConfig): Promise<interfaces.MethodResponse<interfaces.IPaginatedResponse<interfaces.IResponse<T>>>> => {    
    const searchParams: URLSearchParams = createSearchRequestURLSearchParams(params, undefined);

    return executeFetchRequest(config, url, searchParams)
  };
}

export function createPreviewSearchRequest(spaceId: string, channel: string, state: PublishingStatus, config: IChannelConfiguration, targetDateResolver: ITargetDateResolver, locale?: string) {
  const url = getPreviewEndpoint(spaceId, 'search/v2', state, channel, locale);

  return async <T extends object>(params: interfaces.SearchPreviewConfig): Promise<interfaces.MethodResponse<interfaces.IPaginatedResponse<interfaces.IResponse<T>>>> => {
    const targetDate = await targetDateResolver.getTargetDate();

    const searchParams: URLSearchParams = createSearchRequestURLSearchParams(params, targetDate);

    return executeFetchRequest(config, url, searchParams)
    
  };
}

function maybeAddToURLSearchParams (params: URLSearchParams, paramName: string, paramValue: string | string[]) {
  if(!paramValue) {
    return;
  }

  const items = Array.isArray(paramValue) ? paramValue : [paramValue];
  items.forEach((item) => {
    params.append(paramName, item);
  })     
}

function createSearchRequestURLSearchParams (params: interfaces.SearchPreviewConfig | interfaces.SearchOnlineConfig, targetDate?: string) {

  const { skip, take, contentDefinition, legacyMetadata, propFilters, publicId, repositories, sorting, tags } = params;

  const createdParams = new URLSearchParams({
    skip: '' + skip,
    take: '' + take,
  });

  maybeAddToURLSearchParams(createdParams, 'legacyMetadata', legacyMetadata ? 'true' : null);

  maybeAddToURLSearchParams(createdParams, 'publicId', publicId);

  maybeAddToURLSearchParams(createdParams, 'contentDefinition', contentDefinition);

  maybeAddToURLSearchParams(createdParams, 'repositories', repositories);

  const serializedPropFilters = params.propFilters ? JSON.stringify(propFilters) : undefined;
  maybeAddToURLSearchParams(createdParams, 'propFilters', serializedPropFilters);

  maybeAddToURLSearchParams(createdParams, 'sorting', serializeSorting(sorting));

  maybeAddToURLSearchParams(createdParams, 'targetDate', targetDate);

  maybeAddToURLSearchParams(createdParams, 'tags', tags);
  
  return createdParams;
}

function createGetContentRequestURLSearchParams (params: interfaces.GetContentPreviewConfig | interfaces.GetContentOnlineConfig , targetDate?: string) {

  const { legacyMetadata, publicId } = params;

  const createdParams = new URLSearchParams({
  });

  maybeAddToURLSearchParams(createdParams, 'legacyMetadata', '' + legacyMetadata);
  maybeAddToURLSearchParams(createdParams, 'publicId', publicId);
  maybeAddToURLSearchParams(createdParams, 'targetDate', targetDate);

  return createdParams;
}

export async function executeFetchRequest<T>(config: IChannelConfiguration, url: string, params: URLSearchParams) : Promise<interfaces.MethodResponse<T>> {
  
  const fullUrl = new URL(url, `${config.host}`);
  fullUrl.search = params.toString();

  const result = await fetch(fullUrl.toString(), 
    { 
      headers: { 'X-Chef-Key': config.apiKey },      
    });2

  const xx = await result.json();
  console.log('xxxx', xx);
  return { 
    data: xx as T ,
    config: { url,params }
  };
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
