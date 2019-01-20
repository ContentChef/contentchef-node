import express from 'express';
import { Server } from 'http';
import portfinder from 'portfinder';
import { configure, createContentRequest, PublishingStatus } from '../index';
import { IGetContentResponse } from '../interfaces';

const app = express();
const mockedData = {
  definition: '',
  metadata: {
    authoringContentId: 0,
    contentLastModifiedDate: '',
    contentVersion: 0,
    id: 0,
    publishedOn: '',
  },
  offlineDate: '',
  onlineDate: '',
  payload: 0,
  publicId: '',
} as IGetContentResponse<number>;

app.get('*', (_, response) => {
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

describe(`Tests createContentRequest`, () => {
  test(`Invoking this method will return a new function`, () => {
    expect(() => createContentRequest('aSpace', 'foo', PublishingStatus.Live)).not.toThrow();

    expect(typeof createContentRequest('aSpace', 'foo', PublishingStatus.Live)).toBe('function');
  });

  test('Invoking the returning method with staging state will trigger an axios request', done => {
    createContentRequest('aSpace', 'foo', PublishingStatus.Staging)({ publicId: 'hello-world' }).then(response => {
      expect(response.data).toEqual(mockedData);
      done();
    });
  });

  test('Invoking the returning method with live state will trigger an axios request', done => {
    createContentRequest('aSpace', 'foo', PublishingStatus.Live)({ publicId: 'hello-world' }).then(response => {
      expect(response.data).toEqual(mockedData);
      done();
    });
  });
});
