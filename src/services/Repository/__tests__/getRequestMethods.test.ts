import { getRequestMethods } from '..';

describe(`Tests getRequestMethods` , () => {
  test(`getRequestMethods will throw if not properly configured`, () => {
    // @ts-ignore
    expect(() => getRequestMethods()).toThrow();
    
    // @ts-ignore
    expect(() => getRequestMethods('abc')).toThrow();
    
    // @ts-ignore
    expect(() => getRequestMethods(100)).toThrow();
    
    // @ts-ignore
    expect(() => getRequestMethods(undefined, 'staging')).toThrow();
    
    // @ts-ignore
    expect(() => getRequestMethods(undefined, undefined)).toThrow();
  });

  test(`getRequestMethods returns methods for content and search endpoints`, () => {
    const result = getRequestMethods('test', 'live');

    expect(typeof result.content).toBe('function');
    expect(typeof result.search).toBe('function');
  });
});
