import nock = require('nock');
import ISDKConfiguration from '../../ConfigurationManager/interfaces/SDKConfiguration';
import { createContentRequest, PublishingStatus } from '../index';
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

describe(`Tests createContentRequest`, () => {
  test(`Invoking this method will return a new function`, () => {
    expect(() => createContentRequest('aSpace', 'foo', PublishingStatus.Live, config)).not.toThrow();

    expect(typeof createContentRequest('aSpace', 'foo', PublishingStatus.Live, config)).toBe('function');
  });

  test('Invoking the returning method with staging state will trigger an axios request', done => {
    createContentRequest('aSpace', 'foo', PublishingStatus.Staging, config)({ publicId: 'hello-world' }).then(response => {
      expect(response.data).toEqual(mockedData);
      done();
    });
  });

  test('Invoking the returning method with live state will trigger an axios request', done => {
    createContentRequest('aSpace', 'foo', PublishingStatus.Live, config)({ publicId: 'hello-world' }).then(response => {
      expect(response.data).toEqual(mockedData);
      done();
    });
  });
});
