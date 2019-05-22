import { getChannelMethods, PublishingStatus } from '..';

describe(`Tests getRequestMethods` , () => {
  test(`getRequestMethods will throw if not properly configured`, () => {
    // @ts-ignore
    expect(() => getChannelMethods()).toThrow();

    expect(() => (getChannelMethods as any)('defaultSpaceId', 'abc', PublishingStatus.Live)).not.toThrow();

    // @ts-ignore
    expect(() => (getChannelMethods as any)('defaultSpaceId', 100)).toThrow();

    expect(() => (getChannelMethods as any)(undefined, 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => (getChannelMethods as any)(null, 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => (getChannelMethods as any)('', 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => (getChannelMethods as any)('defaultSpaceId', undefined, PublishingStatus.Staging)).toThrow();

    expect(() => (getChannelMethods as any)('defaultSpaceId', null, PublishingStatus.Staging)).toThrow();

    expect(() => (getChannelMethods as any)('defaultSpaceId', '', PublishingStatus.Staging)).toThrow();

    expect(() => (getChannelMethods as any)(undefined, undefined, undefined)).toThrow();

    expect(() => (getChannelMethods as any)('defaultSpaceId', 'foobar', null)).toThrow();

    // @ts-ignore
    expect(() => (getChannelMethods as any)('defaultSpaceId', 'foobar', 'Unknown!')).toThrow();

    expect(() => getChannelMethods('defaultSpaceId', 'foobar', PublishingStatus.Staging, {} as any)).not.toThrow();
  });

  test(`getRequestMethods returns methods for content and search endpoints`, () => {
    const result = getChannelMethods('test', 'testchannel', PublishingStatus.Live, {

    } as any);

    expect(typeof result.content).toBe('function');
    expect(typeof result.search).toBe('function');
  });
});
