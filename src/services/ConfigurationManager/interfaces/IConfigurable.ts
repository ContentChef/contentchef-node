import ISDKConfiguration from './SDKConfiguration';

/**
 * @export
 * @interface IConfigurable
 */
export interface IConfigurable {
  /**
   * @param {ISDKConfiguration} configuration
   * @returns {*}
   * @memberof IConfigurable
   */
  configure(configuration: ISDKConfiguration): any;
}
