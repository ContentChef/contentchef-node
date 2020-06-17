import { createImageTag } from '..';

describe('createImageTag should', () => {
    const publicId = 'test-public-id';
    it('successfully created an img tag with publicId in src', () => {
        const resource = createImageTag(publicId);
        const { src } = resource.attributes() as { src: string };
        // tslint:disable-next-line: no-string-literal
        expect(resource['name']).toEqual('img')
        expect(src).toContain(publicId);
    });
});
