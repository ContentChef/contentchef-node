import { AxiosResponse } from 'axios';
import { PublishingStatus } from '../index';

export type ContentRequestMethod = 'content' | 'search';

export type ContentState = 'staging' | 'live';

export type GetRequestMethods = (channel: string, state: PublishingStatus) => IGetRequestMethodsList;

export interface IGetContentConfig {
  legacyMetadata?: boolean;
  publicId?: string;
  targetDate?: string;
}

export interface IGetContentResponse<T = any> extends IResponse<T> { }

export interface IGetRequestMethodsList {
  content<T extends object>(params: IGetContentConfig): Promise<AxiosResponse<IGetContentResponse<T>>>;
  search<T extends object>(params: ISearchConfig): Promise<AxiosResponse<Array<ISearchResponse<T>>>>;
}

export interface IResponse<T> {
  definition: string;
  publicId: string;
  metadata: IRequestMetadata;
  offlineDate: string | null;
  onlineDate: string | null;
  payload: T;
}

export interface IRequestMetadata {
  authoringContentId: number;
  contentLastModifiedDate: string;
  contentVersion: number;
  id: number;
  publishedOn: string;
  tags: string[];
}

export interface ISearchConfig {
  publicId?: string[] | string;
  contentDefinition?: string[] | string;
  legacyMetadata?: boolean;
  limit?: number;
  tags?: string[] | string;
  targetDate?: string;
  propFilters?: IPropFilter;
}

export interface IPropFilter {
  condition: LogicalOperators;
  items: IPropFilterItem[];
}

export interface IPropFilterItem {
  field: string;
  operator: Operators;
  value: string;
}

export enum LogicalOperators {
  AND = 'AND',
  OR = 'OR',
}

export enum Operators {
  EQUALS = 'EQUALS',
  CONTAINS = 'CONTAINS',
  IGNORE_CASE = 'IGNORE_CASE',
}

export interface ISearchResponse<T = any> extends IResponse<T> {
  requestData: ISearchResponseRequestData;
}

export interface ISearchResponseRequestData {
  publishingChannel: string;
}
