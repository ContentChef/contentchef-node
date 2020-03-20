import sdk from '..';
import ConfigurationManager from '../services/ConfigurationManager';

describe('Tests the sdk', () => {
  test('Entering an invalid configuration will throw an error', () => {
    // @ts-ignore
    expect(() => sdk()).toThrow();

    // @ts-ignore
    expect(() => sdk(null)).toThrow();

    // @ts-ignore
    expect(() => sdk('🍔🍣🍜')).toThrow();

    // @ts-ignore
    expect(() => sdk(new Date())).toThrow();

    // @ts-ignore
    expect(() => sdk(new Proxy({}))).toThrow();

    // @ts-ignore
    expect(() => sdk({})).toThrow();

    // @ts-ignore
    expect(() => sdk({ apiKey: '' })).toThrow();

    // @ts-ignore
    expect(() => sdk({ apiKey: '', timeout: '' })).toThrow();

    // @ts-ignore
    expect(() => sdk({ apiKey: '', timeout: 'this will throw' })).toThrow();

    // @ts-ignore
    expect(() => sdk({ apiKey: '', timeout: -1 })).toThrow();

    // @ts-ignore
    expect(() => sdk({ apiKey: '', timeout: 100, host: '' })).toThrow();

    expect(() => sdk({ spaceId: 'aSpace', apiKey: 'toast', host: 'unicorn' })).not.toThrow();

    // @ts-ignore
    expect( () => new ConfigurationManager({ spaceId: 'aSpace', apiKey: 'toast', host: 'unicorn' }, 10)).toThrow();

    expect( () => new ConfigurationManager(
        { spaceId: 'aSpace', apiKey: 'qwe', host: 'qwe' },
        'testTargetDate',
    )).not.toThrow();

    expect( () => new ConfigurationManager(
        { spaceId: 'aSpace', apiKey: 'qwe', host: 'qwe' },
        { getTargetDate: async () => '2019-08-16T12:22:232Z' },
    )).not.toThrow();
  });

  test('A well configured sdk will return a channel method', () => {
    const cf = sdk({ spaceId: 'aSpace', apiKey: 'qwe', host: 'qweqwe' });

    expect(typeof cf).toBe('object');
    expect(typeof cf.onlineChannel).toBe('function');
    expect(typeof cf.previewChannel).toBe('function');
  });
});
