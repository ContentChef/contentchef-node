import { getRequestMethods, PublishingStatus } from '..';

describe(`Tests getRequestMethods` , () => {
  test(`getRequestMethods will throw if not properly configured`, () => {
    // @ts-ignore
    expect(() => getRequestMethods()).toThrow();

    expect(() => getRequestMethods('defaultSpaceId', 'abc')).not.toThrow();

    // @ts-ignore
    expect(() => getRequestMethods('defaultSpaceId', 100)).toThrow();

    expect(() => getRequestMethods(undefined, 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => getRequestMethods(null, 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => getRequestMethods('', 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => getRequestMethods('defaultSpaceId', undefined, PublishingStatus.Staging)).toThrow();

    expect(() => getRequestMethods('defaultSpaceId', null, PublishingStatus.Staging)).toThrow();

    expect(() => getRequestMethods('defaultSpaceId', '', PublishingStatus.Staging)).toThrow();

    expect(() => getRequestMethods(undefined, undefined, undefined)).toThrow();

    expect(() => getRequestMethods('defaultSpaceId', 'foobar', null)).toThrow();

    // @ts-ignore
    expect(() => getRequestMethods('defaultSpaceId', 'foobar', 'Unknown!')).toThrow();

    expect(() => getRequestMethods('defaultSpaceId', 'foobar', PublishingStatus.Staging)).not.toThrow();
  });

  test(`getRequestMethods returns methods for content and search endpoints`, () => {
    const result = getRequestMethods('test', PublishingStatus.Live);

    expect(typeof result.content).toBe('function');
    expect(typeof result.search).toBe('function');
  });
});
