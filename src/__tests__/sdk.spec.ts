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
    expect(() => sdk({ apiKey: '', callTimeout: '' })).toThrow();

    // @ts-ignore
    expect(() => sdk({ apiKey: '', callTimeout: 'this will throw' })).toThrow();

    // @ts-ignore
    expect(() => sdk({ apiKey: '', callTimeout: -1 })).toThrow();

    // @ts-ignore
    expect(() => sdk({ apiKey: '', callTimeout: 100, serviceRoot: '' })).toThrow();
  });

  test('A well configured sdk will return a repository method', () => {
    const cf = sdk({ apiKey: 'qwe', serviceRoot: 'qweqwe' });
    
    expect(typeof cf).toBe('object');
    expect(typeof cf.repository).toBe('function');
  });
});
