import { getEndpoint, PublishingStatus } from '..';

describe('Tests getEndpoint', () => {
  test(`getEndpoint returns a string`, () => {
    expect(typeof getEndpoint('content', PublishingStatus.Live, 'foo')).toBe('string');
    expect(getEndpoint('content', PublishingStatus.Live, 'test')).toContain('live/content/test');
  });
});
