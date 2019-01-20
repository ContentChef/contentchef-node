import ConfigurationManager from '..';
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
  });

  test('It can configure an object implementing the IConfigurable interface', () => {
    const configurable = {
      foo: '',
      configure(configuration: ISDKConfiguration) {
        this.foo = configuration.apiKey;
        return 123;
      },
    };
    const configurationManager = new ConfigurationManager({
      apiKey: 'lorem',
      host: 'ipsum',
      spaceId: 'aSpace',
    });

    expect(configurationManager.configure(configurable)).toBe(123);
    expect(configurable.foo).toBe('lorem');
  });
});
