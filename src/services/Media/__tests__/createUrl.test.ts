import { createUrl } from '..';

describe('createUrl should', () => {
    const publicId = 'test-public-id';
    it('successfully created an url for a resource with https as protocol', () => {
        const resource = createUrl(publicId);
        const groups = resource.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
        const protocol = groups[2];
        expect(protocol).toEqual('https');
    });

    it('successfully created an url for a resource with provided cloud_name', () => {
        const cloudName = 'amazingCloudName';
        const resource = createUrl(publicId, {cloud_name: cloudName});

        expect(resource).toContain(cloudName);
    })
})