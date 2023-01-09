import nock from 'nock';
import {createOnlineSearchRequest, createPreviewSearchRequest, PublishingStatus} from '..';
import ISDKConfiguration, { IChannelConfiguration } from '../../ConfigurationManager/interfaces/SDKConfiguration';
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

describe(`Tests createPreviewSearchRequest`, () => {
  test(`Invoking this method will return a new function`, () => {
    expect(typeof createPreviewSearchRequest(
      'aSpace',
      'test',
      PublishingStatus.Live,
      config,
      { getTargetDate: async () => '2019-08-16T12:22:232Z' },
    )).toBe('function');
  });

  test('Invoking the returning method with staging state will trigger an request', done => {
    createPreviewSearchRequest(
      'aSpace',
      'foo',
      PublishingStatus.Staging,
      config,
      { getTargetDate: async () => '2019-08-16T12:22:232Z' },
    )({ contentDefinition: 'hello-world', skip: 0, take: 10 }).then(response => {
      expect(response.data).toEqual(mockedData);
      done();
    });
  });

  test('Invoking the returning method with live state will trigger an request', done => {
    createPreviewSearchRequest(
      'aSpace',
      'foo',
      PublishingStatus.Live,
      config,
      { getTargetDate: async () => '2019-08-16T12:22:232Z' },
    )<any>({ contentDefinition: 'hello-world', tags: ['hello', 'world'], skip: 0, take: 10 }).then(response => {
      expect(response.data).toEqual(mockedData);
      expect(response.data.items[0].payload.tags).toEqual(['hello', 'world']);
      done();
    });
  });

  test('Invoking the returning method with stage state and propFilters param should trigger an request and propFilters should be a stringified json', done => {
    const propFilters: IPropFilter = {
      condition: LogicalOperators.AND,
      items: [{
        field: 'indexedField1',
        operator: Operators.CONTAINS,
        value: 'indexedValue1',
      }],
    };
    createPreviewSearchRequest(
      'aSpace',
      'foo',
      PublishingStatus.Live,
      config,
      { getTargetDate: async () => '2019-08-16T12:22:232Z' },
    )<any>({ propFilters, skip: 0, take: 10 }).then(response => {
      expect(response.data).toEqual(mockedData);
      expect(response.config.params.get('propFilters')).toEqual(JSON.stringify(propFilters));
      done();
    });
  });

  test('Invoking the returning method after configuring it with locale, will use correct endpoint', done => {
    createPreviewSearchRequest(
      'aSpace',
      'foo',
      PublishingStatus.Staging,
      config,
      { getTargetDate: async () => '2019-08-16T12:22:232Z' },
      'locale-to-get',
    )({ contentDefinition: 'hello-world', skip: 0, take: 10 }).then(response => {
      const expectedURL = `space/aSpace/preview/staging/search/v2/foo/locale-to-get`;
      expect(response.config.url).toContain(expectedURL);
      expect(response.data).toEqual(mockedData);
      done();
    });
  });
});

describe(`Tests createOnlineSearchRequest`, () => {
  test(`Invoking this method will return a new function`, () => {
    expect(typeof createOnlineSearchRequest('aSpace', 'test', config)).toBe('function');
  });

  test('Invoking the returning method will trigger an request', done => {
    createOnlineSearchRequest('aSpace', 'foo', config)<any>({ contentDefinition: 'hello-world', tags: ['hello', 'world'], skip: 0, take: 10 }).then(response => {
      expect(response.data).toEqual(mockedData);
      expect(response.data.items[0].payload.tags).toEqual(['hello', 'world']);
      done();
    });
  });

  test('Invoking the returning method with propFilters param should trigger an request and propFilters should be a stringified json', done => {
    const propFilters: IPropFilter = {
      condition: LogicalOperators.AND,
      items: [{
        field: 'indexedField1',
        operator: Operators.CONTAINS,
        value: 'indexedValue1',
      }],
    };
    createOnlineSearchRequest('aSpace', 'foo', config)<any>({ propFilters, skip: 0, take: 10 }).then(response => {
      expect(response.data).toEqual(mockedData);
      expect(response.config.params.get('propFilters')).toEqual(JSON.stringify(propFilters));
      done();
    });
  });
  test('Invoking the returning method after configuring it with locale, will use correct endpoint', done => {
    createOnlineSearchRequest(
      'aSpace',
      'foo',
      config,
      'locale-to-get',
    )({ contentDefinition: 'hello-world', skip: 0, take: 10 }).then(response => {
      const expectedURL = `space/aSpace/online/search/v2/foo/locale-to-get`;
      expect(response.config.url).toContain(expectedURL);
      expect(response.data).toEqual(mockedData);
      done();
    });
  });
});
