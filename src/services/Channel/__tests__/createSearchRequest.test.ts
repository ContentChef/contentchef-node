import express from 'express';
import { Server } from 'http';
import portfinder from 'portfinder';
import { configure, createSearchRequest, PublishingStatus } from '..';
import { IPropFilter, ISearchResponse, LogicalOperators, Operators } from '../interfaces';

const app = express();
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
      payload: 100,
      requestData: {
        publishingChannel: 'test',
      },
    } as ISearchResponse<any>,
  ],
  skip: 0,
  take: 10,
  total: 1,
};

app.get('*', (_, response) => {
  mockedData.items[0].payload = _.query;
  response.status(200).json(mockedData);
});

let server: Server | undefined;

beforeAll(async () => {
  const port = await portfinder.getPortPromise();

  server = app.listen(port);

  configure({
    apiKey: 'qwerty',
    host: `http://localhost:${port}/`,
    spaceId: 'aSpace',
    timeout: 25000,
  });
});
afterAll(() => server.close());

describe(`Tests createSearchRequest`, () => {
  test(`Invoking this method will return a new function`, () => {
    expect(typeof createSearchRequest('aSpace', 'test', PublishingStatus.Live)).toBe('function');
  });

  test('Invoking the returning method with staging state will trigger an axios request', done => {
    createSearchRequest('aSpace', 'foo', PublishingStatus.Staging)({ contentDefinition: 'hello-world', skip: 0, take: 10 }).then(response => {
      expect(response.data).toEqual(mockedData);
      done();
    });
  });

  test('Invoking the returning method with live state will trigger an axios request', done => {
    createSearchRequest('aSpace', 'foo', PublishingStatus.Live)<any>({ contentDefinition: 'hello-world', tags: ['hello', 'world'], skip: 0, take: 10 }).then(response => {
      expect(response.data).toEqual(mockedData);
      expect(response.data.items[0].payload.tags).toEqual(['hello', 'world']);
      done();
    });
  });

  test('Invoking the returning method with stage state and propFilters param should trigger an axios request and propFilters should be a stringified json', done => {
    const propFilters: IPropFilter = {
      condition: LogicalOperators.AND,
      items: [{
        field: 'indexedField1',
        operator: Operators.CONTAINS,
        value: 'indexedValue1',
      }],
    };
    createSearchRequest('aSpace', 'foo', PublishingStatus.Live)<any>({ propFilters, skip: 0, take: 10 }).then(response => {
      expect(response.data).toEqual(mockedData);
      expect(response.config.params.propFilters).toEqual(JSON.stringify(propFilters));
      done();
    });
  });
});
