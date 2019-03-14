import { AxiosResponse } from 'axios';
import { PublishingStatus } from '../index';

export type ContentRequestMethod = 'content' | 'search' | `search/v2`;

export type ContentState = 'staging' | 'live';

export type GetChannelMethods = (channel: string, state: PublishingStatus) => IChannelMethods;

export interface IGetContentConfig {
  legacyMetadata?: boolean;
  publicId: string;
  targetDate?: string;
}

export interface IGetContentResponse<T = any> extends IResponse<T> { }

export interface IChannelMethods {
  content<T extends object>(params: IGetContentConfig): Promise<AxiosResponse<IGetContentResponse<T>>>;
  search<T extends object>(params: ISearchConfig): Promise<AxiosResponse<IPaginatedResponse<ISearchResponse<T>>>>;
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
