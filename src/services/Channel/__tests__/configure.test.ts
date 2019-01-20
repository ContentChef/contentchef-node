import { configure } from '..';

describe(`Tests Content Chef service`, () => {
  test(`Configuring the service, a function will be returned`, () => {
    expect(typeof configure({
      apiKey: 'foo',
      host: 'bar',
      spaceId: 'aSpace',
    })).toBe('function');
  });
});
