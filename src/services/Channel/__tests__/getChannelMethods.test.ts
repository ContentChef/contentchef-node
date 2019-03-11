import { getChannelMethods, PublishingStatus } from '..';

describe(`Tests getRequestMethods` , () => {
  test(`getRequestMethods will throw if not properly configured`, () => {
    // @ts-ignore
    expect(() => getChannelMethods()).toThrow();

    expect(() => getChannelMethods('defaultSpaceId', 'abc')).not.toThrow();

    // @ts-ignore
    expect(() => getChannelMethods('defaultSpaceId', 100)).toThrow();

    expect(() => getChannelMethods(undefined, 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => getChannelMethods(null, 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => getChannelMethods('', 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => getChannelMethods('defaultSpaceId', undefined, PublishingStatus.Staging)).toThrow();

    expect(() => getChannelMethods('defaultSpaceId', null, PublishingStatus.Staging)).toThrow();

    expect(() => getChannelMethods('defaultSpaceId', '', PublishingStatus.Staging)).toThrow();

    expect(() => getChannelMethods(undefined, undefined, undefined)).toThrow();

    expect(() => getChannelMethods('defaultSpaceId', 'foobar', null)).toThrow();

    // @ts-ignore
    expect(() => getChannelMethods('defaultSpaceId', 'foobar', 'Unknown!')).toThrow();

    expect(() => getChannelMethods('defaultSpaceId', 'foobar', PublishingStatus.Staging)).not.toThrow();
  });

  test(`getRequestMethods returns methods for content and search endpoints`, () => {
    const result = getChannelMethods('test', PublishingStatus.Live);

    expect(typeof result.content).toBe('function');
    expect(typeof result.search).toBe('function');
  });
});
