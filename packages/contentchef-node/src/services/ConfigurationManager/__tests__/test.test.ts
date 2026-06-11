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
    expect(() => new ConfigurationManager({ spaceId: 'aSpace' })).not.toThrow();

    // @ts-ignore
    expect(() => new ConfigurationManager({ spaceId: 'aSpace', host: 100 })).toThrow();

    expect(() => new ConfigurationManager({ spaceId: 'aSpace', host: '' })).not.toThrow();

    expect(() => new ConfigurationManager({ spaceId: 'aSpace', host: '   ' })).not.toThrow();

    expect(() => new ConfigurationManager({ spaceId: 'aSpace', host: 'qwe' })).not.toThrow();

    // @ts-ignore
    expect(() => new ConfigurationManager({ spaceId: 'aSpace', host: 'qwe', timeout: '1000' })).toThrow();

    expect(() => new ConfigurationManager({ spaceId: 'aSpace', host: 'qwe', timeout: -1 })).toThrow();

    // @ts-ignore
    expect( () => new ConfigurationManager({ spaceId: 'aSpace', host: 'qwe', timeout: -1 }, 10)).toThrow();

    expect( () => new ConfigurationManager(
        { spaceId: 'aSpace', host: 'qwe' },
        'testTargetDate',
    )).not.toThrow();

    expect( () => new ConfigurationManager(
        { spaceId: 'aSpace', host: 'qwe' },
        { getTargetDate: async () => '2019-08-16T12:22:232Z' },
    )).not.toThrow();
  });

  test('It can configure an object implementing the IConfigurable interface', () => {
    const configurable = {
      foo: '',
      configurePreviewMethods(configuration: ISDKConfiguration) {
        this.foo = configuration.spaceId;
        return {} as GetPreviewChannelMethods;
      },
      configureOnlineMethods(configuration: ISDKConfiguration) {
        this.foo = configuration.spaceId;
        return {} as GetOnlineChannelMethods;
      },
    };
    const configurationManager = new ConfigurationManager({
      host: 'ipsum',
      spaceId: 'aSpace',
    });

    expect(configurationManager.configure(configurable)).toHaveProperty('onlineChannel');
    expect(configurationManager.configure(configurable)).toHaveProperty('previewChannel');
    expect(configurable.foo).toBe('aSpace');
  });

  describe('host normalization', () => {
    let warnSpy: jest.SpyInstance;

    beforeEach(() => {
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    // Captures the configuration the ConfigurationManager hands to the SDK so
    // we can assert whether `host` survived (kept) or was dropped (default applies).
    const captureConfiguration = (configuration: ISDKConfiguration) => {
      let captured: ISDKConfiguration | undefined;
      const configurable = {
        configurePreviewMethods() {
          return {} as GetPreviewChannelMethods;
        },
        configureOnlineMethods(config: ISDKConfiguration) {
          captured = config;
          return {} as GetOnlineChannelMethods;
        },
      };
      new ConfigurationManager(configuration).configure(configurable);
      return captured as ISDKConfiguration;
    };

    test('drops an empty-string host and warns', () => {
      const captured = captureConfiguration({ spaceId: 'aSpace', host: '' });

      expect(captured).not.toHaveProperty('host');
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    test('drops a whitespace-only host and warns', () => {
      const captured = captureConfiguration({ spaceId: 'aSpace', host: '   ' });

      expect(captured).not.toHaveProperty('host');
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    test('drops an undefined host without warning', () => {
      const captured = captureConfiguration({
        spaceId: 'aSpace',
        host: undefined,
      });

      expect(captured).not.toHaveProperty('host');
      expect(warnSpy).not.toHaveBeenCalled();
    });

    test('keeps a valid host without warning', () => {
      const captured = captureConfiguration({
        spaceId: 'aSpace',
        host: 'https://example.test',
      });

      expect(captured.host).toBe('https://example.test');
      expect(warnSpy).not.toHaveBeenCalled();
    });

    test('does not warn when host is omitted entirely', () => {
      const captured = captureConfiguration({ spaceId: 'aSpace' });

      expect(captured).not.toHaveProperty('host');
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
