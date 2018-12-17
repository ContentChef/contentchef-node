import { getRequestMethods, PublishingStatus } from '..';

describe(`Tests getRequestMethods` , () => {
  test(`getRequestMethods will throw if not properly configured`, () => {
    // @ts-ignore
    expect(() => getRequestMethods()).toThrow();
    
    expect(() => getRequestMethods('abc')).not.toThrow();
    
    // @ts-ignore
    expect(() => getRequestMethods(100)).toThrow();
    
    expect(() => getRequestMethods(undefined, PublishingStatus.Staging)).toThrow();
    
    expect(() => getRequestMethods(undefined, undefined)).toThrow();

    expect(() => getRequestMethods('foobar', null)).toThrow();

    expect(() => getRequestMethods('foobar', PublishingStatus.Staging)).not.toThrow();
  });

  test(`getRequestMethods returns methods for content and search endpoints`, () => {
    const result = getRequestMethods('test', PublishingStatus.Live);

    expect(typeof result.content).toBe('function');
    expect(typeof result.search).toBe('function');
  });
});
