import { getEndpoint, PublishingStatus } from '..';

describe('Tests getEndpoint', () => {
  test(`getEndpoint returns a string`, () => {
    expect(typeof getEndpoint('aSpace', 'content', PublishingStatus.Live, 'foo')).toBe('string');
    expect(getEndpoint('aSpace', 'content', PublishingStatus.Live, 'test')).toBe('/space/aSpace/live/content/test');
  });
});
