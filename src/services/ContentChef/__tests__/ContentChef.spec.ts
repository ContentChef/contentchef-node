import ContentChefConfiguration from '..';

describe(`Tests Content Chef service`, () => {
  test(`Configuring the service, a function will be returned`, () => {
    expect(typeof ContentChefConfiguration({
      apiKey: 'foo',
      serviceRoot: 'bar',
    })).toBe('function');
  });
});
