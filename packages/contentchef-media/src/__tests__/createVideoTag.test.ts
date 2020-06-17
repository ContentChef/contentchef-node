import { createVideoTag } from '..';

describe('createVideoTag should', () => {
    const publicId = 'test-public-id';
    it('successfully created an video tag with publicId in src', () => {
        const resource = createVideoTag(publicId);
        // tslint:disable-next-line: no-string-literal
        expect(resource['name']).toEqual('video');
        const countOfSources = (resource.toHtml().match(/source/g) || []).length;
        const countOfPublicIds = (resource.content().match(/test-public-id/g) || []).length;
        expect(countOfSources).toEqual(3);
        expect(countOfPublicIds).toEqual(3);
    });
});
