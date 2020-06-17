import { getOnlineChannelMethods } from '..';

describe(`Tests getOnlineChannelMethods` , () => {
    test(`getOnlineChannelMethods will throw if not properly configured`, () => {
        // @ts-ignore
        expect(() => getOnlineChannelMethods()).toThrow();

        expect(() => (getOnlineChannelMethods as any)('defaultSpaceId', 'abc', {apiKey: 'qwe'})).not.toThrow();

        // @ts-ignore
        expect(() => (getOnlineChannelMethods as any)('defaultSpaceId', 100)).toThrow();

        expect(() => (getOnlineChannelMethods as any)(undefined, 'foobar')).toThrow();

        expect(() => (getOnlineChannelMethods as any)(null, 'foobar')).toThrow();

        expect(() => (getOnlineChannelMethods as any)('', 'foobar')).toThrow();

        expect(() => (getOnlineChannelMethods as any)('defaultSpaceId', undefined)).toThrow();

        expect(() => (getOnlineChannelMethods as any)('defaultSpaceId', null)).toThrow();

        expect(() => (getOnlineChannelMethods as any)('defaultSpaceId', '')).toThrow();

        expect(() => (getOnlineChannelMethods as any)(undefined, undefined)).toThrow();

        expect(() => getOnlineChannelMethods('defaultSpaceId', 'foobar', {} as any)).toThrow();
    });

    test(`getOnlineChannelMethods returns methods for contentPreview and searchPreview endpoints`, () => {
        const result = getOnlineChannelMethods('test', 'testchannel', {apiKey: 'qwe'} as any);

        expect(typeof result.content).toBe('function');
        expect(typeof result.search).toBe('function');
    });
});
