import { PublishingStatus } from '../index';

export type ContentRequestMethod = 'content' | 'content-by-id' | `search/v2`;

export type ContentState = 'staging' | 'live';

export type GetPreviewChannelMethods = (apiKey: string, channel: string, state: PublishingStatus, locale?: string) => IChannelMethods;
export type GetOnlineChannelMethods = (apiKey: string, channel: string, locale?: string) => IChannelMethods;

export interface IGetContentConfig {
  legacyMetadata?: boolean;
  publicId: string;
}

export interface IGetContentByIdConfig {
  legacyMetadata?: boolean;
  publishedContentId: number;
}

export interface IRequestContext {
  publishingChannel: string;
  targetDate: Date;
  cloudName: string;
  timestamp: string;
}

export type GetContentOnlineConfig = IGetContentConfig;
export type GetContentPreviewConfig = IGetContentConfig;
export type GetContentByIdOnlineConfig = IGetContentByIdConfig;
export type GetContentByIdPreviewConfig = IGetContentByIdConfig;

export type SearchOnlineConfig = ISearchConfig;
export type SearchPreviewConfig = ISearchConfig;

export interface IMethodResponse<T> {
  data: T;
  config: {
    params: URLSearchParams,
    url: string,
  };  
}

export interface IGetContentResponse<T = any> extends IResponse<T> { }
export type IGetContentByIdResponse<T = any> = Omit<IResponse<T>, 'requestContext'> & {
  requestContext: Omit<IRequestContext, 'publishingChannel'> & {publishingChannel?: IRequestContext['publishingChannel']},
};

export interface IChannelMethods {
  content<T extends object>(params: IGetContentConfig): Promise<IMethodResponse<IGetContentResponse<T>>>;
  contentById<T extends object>(params: IGetContentByIdConfig): Promise<IMethodResponse<IGetContentByIdResponse<T>>>;
  search<T extends object>(params: ISearchConfig): Promise<IMethodResponse<IPaginatedResponse<IResponse<T>>>>;
  localizedContent<T extends object>(params: IGetContentConfig): Promise<IMethodResponse<IGetContentResponse<T>>>;
  localizedSearch<T extends object>(params: ISearchConfig): Promise<IMethodResponse<IPaginatedResponse<IResponse<T>>>>;
}

export interface IResponse<T> {
  definition: string;
  repository: string;
  publicId: string;
  metadata: IResponseMetadata;
  offlineDate: string | null;
  onlineDate: string | null;
  payload: T;
  requestContext: IRequestContext;
}

export interface IPaginatedResponse<T = any> {
  items: T[];
  total: number;
  skip: number;
  take: number;
  requestContext: IRequestContext;
}

export interface IAvailableLocale {
  locale: string;
  slugs?: {
    [key: string]: string;
  };
}

export interface IResponseMetadata {
  authoringContentId: number;
  contentLastModifiedDate: string;
  contentVersion: number;
  id: number;
  publishedOn: string;
  tags: string[];
  availableLocales?: IAvailableLocale[];
  locale: string;
}

export interface ISortingField {
  fieldName: 'publicId' | 'onlineDate' | 'offlineDate' | string;
  ascending: boolean;
}

export interface ISearchConfig {
  skip: number;
  take: number;
  publicId?: string[] | string;
  contentDefinition?: string[] | string;
  repositories?: string[];
  legacyMetadata?: boolean;
  tags?: string[] | string;
  propFilters?: IPropFilter;
  sorting?: ISortingField[] | string;
}

export interface IPropFilter {
  condition: LogicalOperators;
  items: IPropFilterItem[];
}

export interface IPropFilterItem {
  field: string;
  operator: Operators;
  value: any;
}

export enum LogicalOperators {
  AND = 'AND',
  OR = 'OR',
}

export enum Operators {
  CONTAINS = 'CONTAINS',
  CONTAINS_IC = 'CONTAINS_IC',
  EQUALS = 'EQUALS',
  EQUALS_IC = 'EQUALS_IC',
  IN = 'IN',
  IN_IC = 'IN_IC',
  STARTS_WITH = 'STARTS_WITH',
  STARTS_WITH_IC = 'STARTS_WITH_IC',
}
