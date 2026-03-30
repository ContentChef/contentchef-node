import nock from 'nock';
global.fetch = require('node-fetch');

import { IChannelConfiguration } from '../../ConfigurationManager/interfaces/SDKConfiguration';
import {
  createExperimentalOnlineContentRequest,
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
const config = <IChannelConfiguration>{
  apiKey: 'test',
  host: 'http://localhost:1234/',
  spaceId: 'aSpace',
  timeout: 25000,
};

nock(config.host)
  .persist()
  .get(/.*/)
  .reply(200, mockedData);

describe(`Tests createExperimentalOnlineContentRequest`, () => {
  test(`Invoking this method will return a new function`, () => {
    expect(() => createExperimentalOnlineContentRequest('aSpace', 'foo', config)).not.toThrow();

    expect(typeof createExperimentalOnlineContentRequest('aSpace', 'foo', config)).toBe('function');
  });

  test('Invoking the returning method will trigger a request using v3 endpoint', done => {
    createExperimentalOnlineContentRequest('aSpace', 'foo', config)({ publicId: 'hello-world' }).then(response => {
      expect(response.data).toEqual(mockedData);
      expect(response.config.url).toContain('space/aSpace/online/content/v3/foo');
      done();
    });
  });

  test('Invoking the returning method after configuring it with locale, will use correct endpoint', done => {
    createExperimentalOnlineContentRequest(
      'aSpace',
      'foo',
      config,
      'locale-to-get',
    )({ publicId: 'hello-world' }).then(response => {
      const expectedURL = `space/aSpace/online/content/v3/foo/locale-to-get`;
      expect(response.config.url).toContain(expectedURL);
      expect(response.data).toEqual(mockedData);
      done();
    });
  });
});
