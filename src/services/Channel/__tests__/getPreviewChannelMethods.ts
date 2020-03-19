import { getPreviewChannelMethods, PublishingStatus } from '..';

describe(`Tests getPreviewChannelMethods` , () => {
  test(`getPreviewChannelMethods will throw if not properly configured`, () => {
    // @ts-ignore
    expect(() => getPreviewChannelMethods()).toThrow();

    expect(() => (getPreviewChannelMethods as any)('defaultSpaceId', 'abc', PublishingStatus.Live)).not.toThrow();

    // @ts-ignore
    expect(() => (getPreviewChannelMethods as any)('defaultSpaceId', 100)).toThrow();

    expect(() => (getPreviewChannelMethods as any)(undefined, 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => (getPreviewChannelMethods as any)(null, 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => (getPreviewChannelMethods as any)('', 'foobar', PublishingStatus.Staging)).toThrow();

    expect(() => (getPreviewChannelMethods as any)('defaultSpaceId', undefined, PublishingStatus.Staging)).toThrow();

    expect(() => (getPreviewChannelMethods as any)('defaultSpaceId', null, PublishingStatus.Staging)).toThrow();

    expect(() => (getPreviewChannelMethods as any)('defaultSpaceId', '', PublishingStatus.Staging)).toThrow();

    expect(() => (getPreviewChannelMethods as any)(undefined, undefined, undefined)).toThrow();

    expect(() => (getPreviewChannelMethods as any)('defaultSpaceId', 'foobar', null)).toThrow();

    expect(() => (getPreviewChannelMethods as any)('defaultSpaceId', 'foobar', 'Unknown!')).toThrow();

    expect(() => getPreviewChannelMethods(
      'defaultSpaceId',
      'foobar',
      PublishingStatus.Staging, {} as any,
      { getTargetDate: async () => 'testTargetDate' },
    )).not.toThrow();
  });

  test(`getPreviewChannelMethods returns methods for contentPreview and searchPreview endpoints`, () => {
    const result = getPreviewChannelMethods(
      'test',
      'testchannel',
      PublishingStatus.Live,
      {} as any,
      { getTargetDate: async () => 'testTargetDate' },
    );

    expect(typeof result.content).toBe('function');
    expect(typeof result.search).toBe('function');
  });
});
