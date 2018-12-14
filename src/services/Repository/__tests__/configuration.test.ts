import { configure } from '../index';

describe(`Tests Content Chef service internal methods`, () => {
  test(`Configuration will throw if the config is not entered or some params are invalid`, () => {
    // @ts-ignore
    expect(() => configure()).toThrow();
    
    // @ts-ignore
    expect(() => configure({ apiKey: 'foo' })).toThrow();
    
    // @ts-ignore
    expect(() => configure({ host: 'bar' })).toThrow();
  });

  test('Configurating the service will return a new function', () => {
    expect(typeof configure({ apiKey: 'qwerty', host: 'abedebare' })).toBe('function');
  });
});
