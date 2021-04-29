import { createUrl, imageUrl, videoUrl, rawFileUrl } from '..';

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
    });
});

describe('imageUrl should', () => {
    const publicId = 'test-public-id';
    it('successfully created an url for a resource with https as protocol', () => {
        const resource = imageUrl(publicId);
        const groups = resource.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
        const protocol = groups[2];
        expect(protocol).toEqual('https');
    });
    it('successfully created an url for a resource with provided cloud_name', () => {
        const cloudName = 'amazingCloudName';
        const resource = imageUrl(publicId, {cloud_name: cloudName});

        expect(resource).toContain(cloudName);
    });
    it('have /image/ in generated url', () => {
        const resource = imageUrl(publicId);

        expect(resource).toContain('/image/');
    })
});

describe('videoUrl should', () => {
    const publicId = 'test-public-id';
    it('successfully created an url for a resource with https as protocol', () => {
        const resource = videoUrl(publicId);
        const groups = resource.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
        const protocol = groups[2];
        expect(protocol).toEqual('https');
    });
    it('successfully created an url for a resource with provided cloud_name', () => {
        const cloudName = 'amazingCloudName';
        const resource = videoUrl(publicId, {cloud_name: cloudName});

        expect(resource).toContain(cloudName);
    });
    it('have /image/ in generated url', () => {
        const resource = videoUrl(publicId);

        expect(resource).toContain('/video/');
    })
});

describe('rawFileUrl should', () => {
    const publicId = 'test-public-id';
    it('successfully created an url for a resource with https as protocol', () => {
        const resource = rawFileUrl(publicId);
        const groups = resource.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
        const protocol = groups[2];
        expect(protocol).toEqual('https');
    });
    it('successfully created an url for a resource with provided cloud_name', () => {
        const cloudName = 'amazingCloudName';
        const resource = rawFileUrl(publicId, {cloud_name: cloudName});

        expect(resource).toContain(cloudName);
    });
    it('have /image/ in generated url', () => {
        const resource = rawFileUrl(publicId);

        expect(resource).toContain('/raw/');
    })
});
