import { getAxiosInstance } from '..';

describe(`Tests getAxiosInstance`, () => {
  test('getAxiosInstance returns a new axios instance', () => {
    const axios = getAxiosInstance({} as any); 

    expect(typeof axios).toBe('function');
    expect(axios).toHaveProperty('delete');
    expect(axios).toHaveProperty('get');
    expect(axios).toHaveProperty('patch');
    expect(axios).toHaveProperty('post');
    expect(axios).toHaveProperty('put');
  });
});
