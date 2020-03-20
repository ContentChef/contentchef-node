import ConfigurationManager from '..';
import { GetOnlineChannelMethods, GetPreviewChannelMethods } from '../../Channel/interfaces';
import ISDKConfiguration from '../interfaces/SDKConfiguration';

describe('Tests ConfigurationManager class', () => {
  test('It throws if some configuration options are not valid', () => {
    // @ts-ignore
    expect(() => new ConfigurationManager()).toThrow();

    // @ts-ignore
    expect(() => new ConfigurationManager({ apiKey: 100 })).toThrow();

    // @ts-ignore
    expect(() => new ConfigurationManager({ apiKey: '' })).toThrow();

    // @ts-ignore
    expect(() => new ConfigurationManager({ apiKey: 'qwe' })).toThrow();

    // @ts-ignore
    expect(() => new ConfigurationManager({ spaceId: 'aSpace', apiKey: 'qwe', host: 100 })).toThrow();

    expect(() => new ConfigurationManager({ spaceId: 'aSpace', apiKey: 'qwe', host: '' })).toThrow();

    expect(() => new ConfigurationManager({ spaceId: 'aSpace', apiKey: 'qwe', host: 'qwe' })).not.toThrow();

    // @ts-ignore
    expect(() => new ConfigurationManager({ spaceId: 'aSpace', apiKey: 'qwe', host: 'qwe', timeout: '1000' })).toThrow();

    expect(() => new ConfigurationManager({ spaceId: 'aSpace', apiKey: 'qwe', host: 'qwe', timeout: -1 })).toThrow();

    // @ts-ignore
    expect( () => new ConfigurationManager({ spaceId: 'aSpace', apiKey: 'qwe', host: 'qwe', timeout: -1 }, 10)).toThrow();

    expect( () => new ConfigurationManager(
        { spaceId: 'aSpace', apiKey: 'qwe', host: 'qwe' },
        'testTargetDate',
    )).not.toThrow();

    expect( () => new ConfigurationManager(
        { spaceId: 'aSpace', apiKey: 'qwe', host: 'qwe' },
        { getTargetDate: async () => '2019-08-16T12:22:232Z' },
    )).not.toThrow();
  });

  test('It can configure an object implementing the IConfigurable interface', () => {
    const configurable = {
      foo: '',
      configurePreviewMethods(configuration: ISDKConfiguration) {
        this.foo = configuration.apiKey;
        return {} as GetPreviewChannelMethods;
      },
      configureOnlineMethods(configuration: ISDKConfiguration) {
        this.foo = configuration.apiKey;
        return {} as GetOnlineChannelMethods;
      },
    };
    const configurationManager = new ConfigurationManager({
      apiKey: 'lorem',
      host: 'ipsum',
      spaceId: 'aSpace',
    });

    expect(configurationManager.configure(configurable)).toHaveProperty('onlineChannel');
    expect(configurationManager.configure(configurable)).toHaveProperty('previewChannel');
    expect(configurable.foo).toBe('lorem');
  });
});
