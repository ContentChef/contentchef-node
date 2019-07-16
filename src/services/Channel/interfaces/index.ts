import { AxiosResponse } from 'axios';
import { PublishingStatus } from '../index';

export type ContentRequestMethod = 'content' | `search/v2`;

export type ContentState = 'staging' | 'live';

export type GetPreviewChannelMethods = (channel: string, state: PublishingStatus) => IPreviewChannelMethods;
export type GetOnlineChannelMethods = (channel: string) => IOnlineChannelMethods;

export interface IGetContentConfig {
  legacyMetadata?: boolean;
  publicId: string;
  targetDate?: string;
}

export type GetContentOnlineConfig = Pick<IGetContentConfig, Exclude<keyof IGetContentConfig, 'targetDate'>>;
export type GetContentPreviewConfig = IGetContentConfig;

export interface IGetContentResponse<T = any> extends IResponse<T> { }

export interface IOnlineChannelMethods {
  contentOnline<T extends object>(params: GetContentOnlineConfig): Promise<AxiosResponse<IGetContentResponse<T>>>;
  searchOnline<T extends object>(params: SearchOnlineConfig): Promise<AxiosResponse<IPaginatedResponse<ISearchResponse<T>>>>;
}

export interface IPreviewChannelMethods {
  contentPreview<T extends object>(params: GetContentPreviewConfig): Promise<AxiosResponse<IGetContentResponse<T>>>;
  searchPreview<T extends object>(params: SearchPreviewConfig): Promise<AxiosResponse<IPaginatedResponse<ISearchResponse<T>>>>;
}

export interface IResponse<T> {
  definition: string;
  publicId: string;
  metadata: IResponseMetadata;
  offlineDate: string | null;
  onlineDate: string | null;
  payload: T;
}

export interface IPaginatedResponse<T = any> {
  items: T[];
  total: number;
  skip: number;
  take: number;
}

export interface IResponseMetadata {
  authoringContentId: number;
  contentLastModifiedDate: string;
  contentVersion: number;
  id: number;
  publishedOn: string;
  tags: string[];
}

export interface ISearchConfig {
  skip: number;
  take: number;
  publicId?: string[] | string;
  contentDefinition?: string[] | string;
  legacyMetadata?: boolean;
  tags?: string[] | string;
  targetDate?: Date;
  propFilters?: IPropFilter;
}

export type SearchOnlineConfig = Pick<ISearchConfig, Exclude<keyof ISearchConfig, 'targetDate'>>;
export type SearchPreviewConfig = ISearchConfig;

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

export interface ISearchResponse<T = any> extends IResponse<T> {
  requestData: ISearchResponseRequestData;
}

export interface ISearchResponseRequestData {
  publishingChannel: string;
}
