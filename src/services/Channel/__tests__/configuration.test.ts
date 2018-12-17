import { configure } from '../index';

describe(`Tests Content Chef service internal methods`, () => {
  test('Configurating the service will return a new function', () => {
    expect(typeof configure({ apiKey: 'qwerty', host: 'abedebare' })).toBe('function');
  });
});
