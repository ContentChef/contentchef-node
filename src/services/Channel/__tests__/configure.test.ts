import { configureOnlineMethods, configurePreviewMethods } from '..';

describe(`Tests Content Chef service`, () => {
  test(`Configuring the service onlineMethods, a function will be returned`, () => {
    expect(typeof configureOnlineMethods({
      apiKey: 'foo',
      host: 'bar',
      spaceId: 'aSpace',
    })).toBe('function');
  });

  test(`Configuring the service previewMethods, a function will be returned`, () => {
    expect(typeof configurePreviewMethods(
      {
        apiKey: 'foo',
        host: 'bar',
        spaceId: 'aSpace',
      },
      {
        getTargetDate: async () => '2019-08-16T12:22:232Z',
      })).toBe('function');
  });
});
