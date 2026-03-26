import { getExperimentalOnlineChannelMethods } from '..';

describe(`Tests getExperimentalOnlineChannelMethods` , () => {
    test(`getExperimentalOnlineChannelMethods will throw if not properly configured`, () => {
        // @ts-ignore
        expect(() => getExperimentalOnlineChannelMethods()).toThrow();

        expect(() => (getExperimentalOnlineChannelMethods as any)('defaultSpaceId', 'abc', {apiKey: 'qwe'})).not.toThrow();

        // @ts-ignore
        expect(() => (getExperimentalOnlineChannelMethods as any)('defaultSpaceId', 100)).toThrow();

        expect(() => (getExperimentalOnlineChannelMethods as any)(undefined, 'foobar')).toThrow();

        expect(() => (getExperimentalOnlineChannelMethods as any)(null, 'foobar')).toThrow();

        expect(() => (getExperimentalOnlineChannelMethods as any)('', 'foobar')).toThrow();

        expect(() => (getExperimentalOnlineChannelMethods as any)('defaultSpaceId', undefined)).toThrow();

        expect(() => (getExperimentalOnlineChannelMethods as any)('defaultSpaceId', null)).toThrow();

        expect(() => (getExperimentalOnlineChannelMethods as any)('defaultSpaceId', '')).toThrow();

        expect(() => (getExperimentalOnlineChannelMethods as any)(undefined, undefined)).toThrow();

        expect(() => getExperimentalOnlineChannelMethods('defaultSpaceId', 'foobar', {} as any)).toThrow();
    });

    test(`getExperimentalOnlineChannelMethods returns methods for content and search endpoints`, () => {
        const result = getExperimentalOnlineChannelMethods('test', 'testchannel', {apiKey: 'qwe', locale: 'test'} as any);

        expect(typeof result.content).toBe('function');
        expect(typeof result.search).toBe('function');
        expect(typeof result.localizedContent).toBe('function');
        expect(typeof result.localizedSearch).toBe('function');
    });
});
