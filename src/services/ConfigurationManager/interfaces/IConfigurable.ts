import { GetOnlineChannelMethods, GetPreviewChannelMethods } from '../../Channel/interfaces';
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
  configurePreviewMethods(configuration: ISDKConfiguration): GetPreviewChannelMethods;

  /**
   * @param {ISDKConfiguration} configuration
   * @returns {*}
   * @memberof IConfigurable
   */
  configureOnlineMethods(configuration: ISDKConfiguration): GetOnlineChannelMethods;
}
