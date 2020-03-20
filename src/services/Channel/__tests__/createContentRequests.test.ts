import nock = require('nock');
import ISDKConfiguration from '../../ConfigurationManager/interfaces/SDKConfiguration';
import {
  createOnlineContentRequest,
  createPreviewContentRequest,
  PublishingStatus,
} from '../index';
import { IGetContentResponse } from '../interfaces';

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
const config = <ISDKConfiguration> {
  apiKey: 'qwerty',
  host: 'http://localhost:1234/',
  spaceId: 'aSpace',
  timeout: 25000,
};

nock(config.host)
  .persist()
  .get(/.*/)
  .reply(200, mockedData);

describe(`Tests createPreviewContentRequest`, () => {
  test(`Invoking this method will return a new function`, () => {
    expect(() => createPreviewContentRequest(
      'aSpace',
      'foo',
      PublishingStatus.Live,
      config,
      { getTargetDate: async () => '2019-08-16T12:22:232Z' },
    )).not.toThrow();

    expect(typeof createPreviewContentRequest(
      'aSpace',
      'foo',
      PublishingStatus.Live,
      config,
      { getTargetDate: async () => '2019-08-16T12:22:232Z' },
    )).toBe('function');
  });

  test('Invoking the returning method with staging state will trigger an axios request', done => {
    createPreviewContentRequest(
      'aSpace',
      'foo',
      PublishingStatus.Staging,
      config,
      { getTargetDate: async () => '2019-08-16T12:22:232Z' },
      )({ publicId: 'hello-world' }).then(response => {
      expect(response.data).toEqual(mockedData);
      done();
    });
  });

  test('Invoking the returning method with live state will trigger an axios request', done => {
    createPreviewContentRequest(
      'aSpace',
      'foo',
      PublishingStatus.Live,
      config,
      { getTargetDate: async () => '2019-08-16T12:22:232Z' },
      )({ publicId: 'hello-world' }).then(response => {
      expect(response.data).toEqual(mockedData);
      done();
    });
  });
});

describe(`Tests createOnlineContentRequest`, () => {
  test(`Invoking this method will return a new function`, () => {
    expect(() => createOnlineContentRequest('aSpace', 'foo', config)).not.toThrow();

    expect(typeof createOnlineContentRequest('aSpace', 'foo', config)).toBe('function');
  });

  test('Invoking the returning method will trigger an axios request', done => {
    createOnlineContentRequest('aSpace', 'foo', config)({ publicId: 'hello-world' }).then(response => {
      expect(response.data).toEqual(mockedData);
      done();
    });
  });
});
