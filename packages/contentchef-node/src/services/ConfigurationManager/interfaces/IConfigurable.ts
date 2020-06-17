import { GetOnlineChannelMethods, GetPreviewChannelMethods } from '../../Channel/interfaces';
import ISDKConfiguration, {ITargetDateResolver} from './SDKConfiguration';

/**
 * @export
 * @interface IConfigurable
 */
export interface IConfigurable {
  /**
   * @param {ISDKConfiguration} configuration
   * @param {ITargetDateResolver} targetDateResolver
   * @returns {*}
   * @memberof IConfigurable
   */
  configurePreviewMethods(configuration: ISDKConfiguration, targetDateResolver: ITargetDateResolver): GetPreviewChannelMethods;

  /**
   * @param {ISDKConfiguration} configuration
   * @returns {*}
   * @memberof IConfigurable
   */
  configureOnlineMethods(configuration: ISDKConfiguration): GetOnlineChannelMethods;
}
