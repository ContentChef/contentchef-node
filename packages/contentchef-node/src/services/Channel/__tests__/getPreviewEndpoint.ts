import { getPreviewEndpoint, PublishingStatus } from '..';

describe('Tests getPreviewEndpoint', () => {
  test(`getPreviewEndpoint returns a string`, () => {
    expect(typeof getPreviewEndpoint('aSpace', 'content', PublishingStatus.Live, 'foo')).toBe('string');
    expect(getPreviewEndpoint('aSpace', 'content', PublishingStatus.Live, 'test')).toBe('/space/aSpace/preview/live/content/test');
  });
});
