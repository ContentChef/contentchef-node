import { configureOnlineMethods, configurePreviewMethods } from '..';

describe(`Tests Content Chef service internal methods`, () => {
  test('Configurating online service will return a new function', () => {
    expect(typeof configureOnlineMethods({ spaceId: 'aSpace', apiKey: 'qwerty', host: 'abedebare' })).toBe('function');
  });

  test('Configurating online service will return a new function', () => {
    expect(typeof configurePreviewMethods(
        { spaceId: 'aSpace', apiKey: 'qwerty', host: 'abedebare' },
        { getTargetDate: async () => '2019-08-16T12:22:232Z' },
    )).toBe('function');
  });
});
