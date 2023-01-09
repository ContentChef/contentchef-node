
export interface ITargetDateResolver {
  getTargetDate(): Promise<string | undefined>;
}

export default interface ISDKConfiguration {
  /**
   * Content Chef SpaceId to use
   * @type {string}
   * @memberof IContentChefConfiguration
   */
  spaceId: string;
  
  /**
   * Content Chef API Endpoint
   * @type {string}
   * @memberof IContentChefConfiguration
   */
  host?: string;

  /**
   * Sets a pending request timeout
   * @type {number}
   * @memberof IContentChefConfiguration
   */
  timeout?: number;
}

export interface IChannelConfiguration extends ISDKConfiguration {
  /**
   * Your Content Chef API key
   * @type {string}
   * @memberof IContentChefConfiguration
   */
  apiKey: string;

  /**
   * Locale needed to access localized contents
   */
  locale?: string;
}
