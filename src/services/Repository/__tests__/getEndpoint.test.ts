import { getEndpoint } from '..';

describe('Tests getEndpoint', () => {
  test(`getEndpoint returns a string`, () => {
    expect(typeof getEndpoint('content', 'live', 'foo')).toBe('string');
    expect(getEndpoint('content', 'live', 'test')).toContain('live/content/test');
  });
});
