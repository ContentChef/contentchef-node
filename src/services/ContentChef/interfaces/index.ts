export type ContentRequestMethod = 'content' | 'search';

export type ContentState = 'staging' | 'live';

export interface IConfig {
  apiKey: string;
  callTimeout: number;
  serviceRoot: string;
}

export interface IGetContentConfig {
  legacyMetadata?: any;
  publicId?: any;
  targetDate?: any;
}

export interface IGetContentResponse<T = any> extends IRequest<T> {
  definition: string;
  publicId: string;
}

export interface IRequest<T> {
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

export interface ISearchResponse<T = any> extends IRequest<T> {
  requestData: ISearchResponseRequestData;
}

export interface ISearchResponseRequestData {
  publishingChannel: string;
}
