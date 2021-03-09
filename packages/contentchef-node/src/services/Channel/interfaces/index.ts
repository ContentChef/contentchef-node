import { AxiosResponse } from 'axios';
import { PublishingStatus } from '../index';

export type ContentRequestMethod = 'content' | `search/v2`;

export type ContentState = 'staging' | 'live';

export type GetPreviewChannelMethods = (apiKey: string, channel: string, state: PublishingStatus, locale?: string) => IChannelMethods;
export type GetOnlineChannelMethods = (apiKey: string, channel: string, locale?: string) => IChannelMethods;

export interface IGetContentConfig {
  legacyMetadata?: boolean;
  publicId: string;
}

export interface IRequestContext {
  publishingChannel: string;
  targetDate: Date;
  cloudName: string;
  timestamp: string;
}

export type GetContentOnlineConfig = IGetContentConfig;
export type GetContentPreviewConfig = IGetContentConfig;

export type SearchOnlineConfig = ISearchConfig;
export type SearchPreviewConfig = ISearchConfig;

export interface IGetContentResponse<T = any> extends IResponse<T> { }

export interface IChannelMethods {
  content<T extends object>(params: IGetContentConfig): Promise<AxiosResponse<IGetContentResponse<T>>>;
  search<T extends object>(params: ISearchConfig): Promise<AxiosResponse<IPaginatedResponse<IResponse<T>>>>;
  localizedContent<T extends object>(params: IGetContentConfig): Promise<AxiosResponse<IGetContentResponse<T>>>;
  localizedSearch<T extends object>(params: ISearchConfig): Promise<AxiosResponse<IPaginatedResponse<IResponse<T>>>>;
}

/**
 * @deprecated Since version 2.2.4. This will be removed in version 3.0.0
 * @export
 * @interface IOnlineChannelMethods
 */
export interface IOnlineChannelMethods extends IChannelMethods {}
/**
 * @deprecated Since version 2.2.4. This will be removed in version 3.0.0
 * @export
 * @interface IPreviewChannelMethods
 */
export interface IPreviewChannelMethods extends IChannelMethods {}

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

export interface IResponseMetadata {
  authoringContentId: number;
  contentLastModifiedDate: string;
  contentVersion: number;
  id: number;
  publishedOn: string;
  tags: string[];
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
