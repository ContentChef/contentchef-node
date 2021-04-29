import { getOnlineEndpoint } from '..';

describe('Tests getOnlineEndpoint', () => {
    test(`getOnlineEndpoint returns a string`, () => {
        expect(typeof getOnlineEndpoint('aSpace', 'content', 'foo')).toBe('string');
        expect(getOnlineEndpoint('aSpace', 'content', 'test')).toBe('/space/aSpace/online/content/test');
    });

    test(`getOnlineEndpoint returns a string with locale`, () => {
        expect(typeof getOnlineEndpoint('aSpace', 'content', 'foo', 'test')).toBe('string');
        expect(getOnlineEndpoint('aSpace', 'content', 'test', 'test')).toBe('/space/aSpace/online/content/test/test');
    });
});
