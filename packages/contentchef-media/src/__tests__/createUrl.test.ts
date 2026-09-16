import {
    createUrl,
    imageUrl,
    IMedia,
    rawFileUrl,
    ResourceType,
    videoUrl,
} from '..';
import {
    buildCloudflareUrl,
    DEFAULT_CLOUDFLARE_BASE_URL,
    toCloudflareOptions,
} from '../cloudflare';

const cloudinaryMedia = (
    publicId = 'test-public-id',
    resourceType = 'image',
): IMedia => ({
    publicId,
    provider: 'cloudinary',
    metadata: { provider: 'cloudinary', resourceType },
});

const cloudflareMedia = (
    publicId = 'space/img/logo.png',
    resourceType = 'image',
): IMedia => ({
    publicId,
    provider: 'cloudflare',
    metadata: { provider: 'cloudflare', resourceType },
});

describe('createUrl provider detection', () => {
    it('treats media without a provider as cloudinary (legacy)', () => {
        const url = createUrl({ publicId: 'legacy-id' });
        expect(url).toContain('res.cloudinary.com');
        expect(url).toContain('/image/');
    });

    it('reads the provider from metadata when the top-level field is absent', () => {
        const url = createUrl({ publicId: 'space/img/x.png', metadata: { provider: 'cloudflare' } });
        expect(url).toContain('media.contentchef.io');
    });

    it('lets the top-level provider win over metadata', () => {
        const url = createUrl({
            publicId: 'space/img/x.png',
            provider: 'cloudflare',
            metadata: { provider: 'cloudinary' },
        });
        expect(url).toContain('media.contentchef.io');
    });
});

describe('createUrl (cloudinary)', () => {
    it('builds a secure url with https as protocol', () => {
        const resource = createUrl(cloudinaryMedia());
        const groups = resource.match(/^((http[s]?|ftp):\/)?\/?([^:/\s]+)((\/\w+)*\/)([\w\-.]+[^#?\s]+)(.*)?(#[\w-]+)?$/);
        expect(groups[2]).toEqual('https');
    });

    it('honours a provided cloud_name', () => {
        expect(createUrl(cloudinaryMedia(), { cloud_name: 'amazingCloudName' })).toContain('amazingCloudName');
    });

    it('infers image/video/raw from metadata', () => {
        expect(createUrl(cloudinaryMedia('id', 'image'))).toContain('/image/');
        expect(createUrl(cloudinaryMedia('id', 'video'))).toContain('/video/');
        expect(createUrl(cloudinaryMedia('id', 'raw'))).toContain('/raw/');
    });

    it('defaults to image when metadata has no resource type', () => {
        expect(createUrl({ publicId: 'id' })).toContain('/image/');
    });

    it('lets the explicit resourceType argument override metadata', () => {
        expect(createUrl(cloudinaryMedia('id', 'image'), {}, ResourceType.video)).toContain('/video/');
    });
});

describe('createUrl (cloudflare)', () => {
    it('builds a /cdn-cgi/image/ url for images off the default base', () => {
        const url = createUrl(cloudflareMedia('space/img/logo.png'), {
            resize: { width: 100, height: 200, type: 'fill' },
        });
        expect(url).toBe(`${DEFAULT_CLOUDFLARE_BASE_URL}/cdn-cgi/image/width=100,height=200,fit=cover/space/img/logo.png`);
    });

    it('returns a plain delivery url for images when nothing maps', () => {
        expect(createUrl(cloudflareMedia('space/img/logo.png'))).toBe(
            `${DEFAULT_CLOUDFLARE_BASE_URL}/space/img/logo.png`,
        );
    });

    it('serves video as plain delivery (transformations ignored)', () => {
        const url = createUrl(cloudflareMedia('space/video/clip.mp4', 'video'), { resize: { width: 100 } });
        expect(url).toBe(`${DEFAULT_CLOUDFLARE_BASE_URL}/space/video/clip.mp4`);
        expect(url).not.toContain('cdn-cgi');
    });

    it('serves raw files as plain delivery', () => {
        expect(createUrl(cloudflareMedia('space/raw/doc.pdf', 'raw'))).toBe(
            `${DEFAULT_CLOUDFLARE_BASE_URL}/space/raw/doc.pdf`,
        );
    });

    it('honours a baseUrl override and strips redundant slashes', () => {
        const url = createUrl(cloudflareMedia('/space/img/logo.png'), {
            baseUrl: 'https://cdn.example.com/',
            resize: { width: 50 },
        });
        expect(url).toBe('https://cdn.example.com/cdn-cgi/image/width=50/space/img/logo.png');
    });

    it('does not leak baseUrl or cloud_name into cloudflare params', () => {
        const url = createUrl(cloudflareMedia('a/b.png'), {
            baseUrl: 'https://cdn.example.com',
            cloud_name: 'x',
            resize: { width: 50 },
        });
        expect(url).toBe('https://cdn.example.com/cdn-cgi/image/width=50/a/b.png');
    });
});

describe('per-type helpers force the resource type', () => {
    it('imageUrl / videoUrl / rawFileUrl override the inferred type', () => {
        expect(imageUrl(cloudinaryMedia('id', 'video'))).toContain('/image/');
        expect(videoUrl(cloudinaryMedia('id', 'image'))).toContain('/video/');
        expect(rawFileUrl(cloudinaryMedia('id', 'image'))).toContain('/raw/');
    });

    it('imageUrl maps a cloudflare image', () => {
        expect(imageUrl(cloudflareMedia('a/b.png'), { resize: { width: 10 } })).toBe(
            `${DEFAULT_CLOUDFLARE_BASE_URL}/cdn-cgi/image/width=10/a/b.png`,
        );
    });

    it('videoUrl serves a cloudflare video as plain delivery', () => {
        expect(videoUrl(cloudflareMedia('a/clip.mp4'))).toBe(`${DEFAULT_CLOUDFLARE_BASE_URL}/a/clip.mp4`);
    });

    it('rawFileUrl serves a cloudflare raw file as plain delivery', () => {
        expect(rawFileUrl(cloudflareMedia('a/doc.pdf'))).toBe(`${DEFAULT_CLOUDFLARE_BASE_URL}/a/doc.pdf`);
    });
});

describe('toCloudflareOptions mapping', () => {
    it('maps resize dimensions and fit', () => {
        expect(toCloudflareOptions({ resize: { width: 10, height: 20, type: 'fit' } }))
            .toEqual(['width=10', 'height=20', 'fit=contain']);
    });

    it('maps compass gravity to sides and corners', () => {
        expect(toCloudflareOptions({ gravity: 'north' as any })).toEqual(['gravity=top']);
        expect(toCloudflareOptions({ gravity: 'south_east' as any })).toEqual(['gravity=1x1']);
        expect(toCloudflareOptions({ gravity: 'auto' as any })).toEqual(['gravity=auto']);
    });

    it('maps format, falling back to fetchFormat, and normalises jpg', () => {
        expect(toCloudflareOptions({ format: 'auto' })).toEqual(['format=auto']);
        expect(toCloudflareOptions({ fetchFormat: 'jpg' })).toEqual(['format=jpeg']);
    });

    it('passes numeric quality through and drops auto quality', () => {
        expect(toCloudflareOptions({ quality: 75 })).toEqual(['quality=75']);
        expect(toCloudflareOptions({ quality: 'auto' })).toEqual([]);
    });

    it('only allows cloudflare-supported rotations', () => {
        expect(toCloudflareOptions({ rotate: 90 })).toEqual(['rotate=90']);
        expect(toCloudflareOptions({ rotate: 45 })).toEqual([]);
    });

    it('escapes the hash in a hex background', () => {
        expect(toCloudflareOptions({ background: '#ff0000' })).toEqual(['background=%23ff0000']);
    });

    it('maps common effects with approximate scaling', () => {
        expect(toCloudflareOptions({ effect: { name: 'brightness', value: 50 } })).toEqual(['brightness=1.5']);
        expect(toCloudflareOptions({ effect: { name: 'grayscale' } })).toEqual(['saturation=0']);
        expect(toCloudflareOptions({ effect: { name: 'sepia', value: 80 } })).toEqual([]);
    });
});

describe('buildCloudflareUrl', () => {
    it('joins multiple options with commas', () => {
        const url = buildCloudflareUrl('a/b.png', { resize: { width: 100 }, format: 'auto', quality: 80 });
        expect(url).toBe(`${DEFAULT_CLOUDFLARE_BASE_URL}/cdn-cgi/image/width=100,format=auto,quality=80/a/b.png`);
    });

    it('returns a plain delivery url when no options map to params', () => {
        expect(buildCloudflareUrl('space/raw/doc.pdf')).toBe(`${DEFAULT_CLOUDFLARE_BASE_URL}/space/raw/doc.pdf`);
    });
});
