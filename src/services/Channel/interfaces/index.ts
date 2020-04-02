import { AxiosResponse } from 'axios';
import { PublishingStatus } from '../index';

export type ContentRequestMethod = 'content' | `search/v2`;

export type ContentState = 'staging' | 'live';

export type GetPreviewChannelMethods = (channel: string, state: PublishingStatus) => IPreviewChannelMethods;
export type GetOnlineChannelMethods = (channel: string) => IOnlineChannelMethods;

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

export interface IGetContentResponse<T = any> extends IResponse<T> { }

export interface IOnlineChannelMethods {
  content<T extends object>(params: GetContentOnlineConfig): Promise<AxiosResponse<IGetContentResponse<T>>>;
  search<T extends object>(params: SearchOnlineConfig): Promise<AxiosResponse<IPaginatedResponse<IResponse<T>>>>;
}

export interface IPreviewChannelMethods {
  content<T extends object>(params: GetContentPreviewConfig): Promise<AxiosResponse<IGetContentResponse<T>>>;
  search<T extends object>(params: SearchPreviewConfig): Promise<AxiosResponse<IPaginatedResponse<IResponse<T>>>>;
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

export type SearchOnlineConfig = ISearchConfig;
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
