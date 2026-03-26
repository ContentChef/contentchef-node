import nock from 'nock';
import { createExperimentalOnlineSearchRequest } from '..';
import { IChannelConfiguration } from '../../ConfigurationManager/interfaces/SDKConfiguration';
import { IPropFilter, IResponse, LogicalOperators, Operators } from '../interfaces';
global.fetch = require('node-fetch');

const mockedData = {
  items: [
    {
      metadata: {
        authoringContentId: 1,
        contentLastModifiedDate: '',
        contentVersion: 0,
        id: 0,
        publishedOn: '',
      },
      offlineDate: '',
      onlineDate: '',
      payload: {
        tags: [
          'hello',
          'world',
        ],
      },
      requestContext: {
        publishingChannel: 'test',
      },
    } as IResponse<any>,
  ],
  skip: 0,
  take: 10,
  total: 1,
};

const config = <IChannelConfiguration> {
  apiKey: 'test',
  host: `http://localhost:1234/`,
  spaceId: 'aSpace',
  timeout: 25000,
};

nock(config.host!)
  .persist()
  .get(/.*/)
  .reply(200, mockedData);

describe(`Tests createExperimentalOnlineSearchRequest`, () => {
  test(`Invoking this method will return a new function`, () => {
    expect(typeof createExperimentalOnlineSearchRequest('aSpace', 'test', config)).toBe('function');
  });

  test('Invoking the returning method will trigger a request using v3 endpoint', done => {
    createExperimentalOnlineSearchRequest('aSpace', 'foo', config)<any>({ contentDefinition: 'hello-world', tags: ['hello', 'world'], skip: 0, take: 10 }).then(response => {
      expect(response.data).toEqual(mockedData);
      expect(response.data.items[0].payload.tags).toEqual(['hello', 'world']);
      expect(response.config.url).toContain('space/aSpace/online/search/v3/foo');
      done();
    });
  });

  test('Invoking the returning method with propFilters param should trigger a request and propFilters should be a stringified json', done => {
    const propFilters: IPropFilter = {
      condition: LogicalOperators.AND,
      items: [{
        field: 'indexedField1',
        operator: Operators.CONTAINS,
        value: 'indexedValue1',
      }],
    };
    createExperimentalOnlineSearchRequest('aSpace', 'foo', config)<any>({ propFilters, skip: 0, take: 10 }).then(response => {
      expect(response.data).toEqual(mockedData);
      expect(response.config.params.get('propFilters')).toEqual(JSON.stringify(propFilters));
      done();
    });
  });

  test('Invoking the returning method after configuring it with locale, will use correct endpoint', done => {
    createExperimentalOnlineSearchRequest(
      'aSpace',
      'foo',
      config,
      'locale-to-get',
    )({ contentDefinition: 'hello-world', skip: 0, take: 10 }).then(response => {
      const expectedURL = `space/aSpace/online/search/v3/foo/locale-to-get`;
      expect(response.config.url).toContain(expectedURL);
      expect(response.data).toEqual(mockedData);
      done();
    });
  });
});
