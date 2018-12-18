import { AxiosResponse } from 'axios';
import { PublishingStatus } from '../index';

export type ContentRequestMethod = 'content' | 'search';

export type ContentState = 'staging' | 'live';

export type GetRequestMethods = (channel: string, state: PublishingStatus) => IGetRequestMethodsList;

export interface IGetContentConfig {
  legacyMetadata?: any;
  publicId?: any;
  targetDate?: any;
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
}

export interface ISearchConfig {
  contentDefinition?: any;
  legacyMetadata?: any;
  limit?: any;
  tags?: any;
  targetDate?: any;
}

export interface ISearchResponse<T = any> extends IResponse<T> {
  requestData: ISearchResponseRequestData;
}

export interface ISearchResponseRequestData {
  publishingChannel: string;
}
