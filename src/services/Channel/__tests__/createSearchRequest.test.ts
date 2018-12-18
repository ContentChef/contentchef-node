import express from 'express';
import { Server } from 'http';
import portfinder from 'portfinder';
import { configure, createSearchRequest, PublishingStatus } from '..';
import { ISearchResponse } from '../interfaces';

const app = express();
const mockedData = {
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
} as ISearchResponse<any>;

app.get('*', (_, response) => {
  mockedData.payload = _.query;
  response.status(200).json([mockedData]);
});

let server: Server | undefined;

beforeAll(async () => {
  const port = await portfinder.getPortPromise();

  server = app.listen(port);

  configure({
    apiKey: 'qwerty',
    host: `http://localhost:${port}/`,
    timeout: 25000,
  });
});
afterAll(() => server.close());

describe(`Tests createSearchRequest`, () => {
  test(`Invoking this method will return a new function`, () => {
    expect(typeof createSearchRequest('test', PublishingStatus.Live)).toBe('function');
  });

  test('Invoking the returning method with staging state will trigger an axios request', done => {
    createSearchRequest('foo', PublishingStatus.Staging)({ contentDefinition: 'hello-world' }).then(response => {
      expect(response.data).toEqual([mockedData]);
      done();
    });
  });

  test('Invoking the returning method with live state will trigger an axios request', done => {
    createSearchRequest('foo', PublishingStatus.Live)<any>({ contentDefinition: 'hello-world', tags: ['hello', 'world'] }).then(response => {
      expect(response.data).toEqual([mockedData]);
      expect(response.data[0].payload.tags).toEqual(['hello', 'world']);
      done();
    });
  });
});
