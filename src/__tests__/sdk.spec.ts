import sdk from '..';

describe('Tests the sdk', () => {
  test('Entering an invalid configuration will throw an error', () => {
    // @ts-ignore
    expect(() => sdk()).toThrow();

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
    
    expect(() => sdk({ apiKey: 'toast', host: 'unicorn' })).not.toThrow();
  });

  test('A well configured sdk will return a channel method', () => {
    const cf = sdk({ apiKey: 'qwe', host: 'qweqwe' });
    
    expect(typeof cf).toBe('object');
    expect(typeof cf.channel).toBe('function');
  });
});
