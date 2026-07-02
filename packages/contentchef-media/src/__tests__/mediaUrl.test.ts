import {
    IMedia,
    mediaImageUrl,
    mediaRawFileUrl,
    mediaVideoUrl,
    MediaProvider,
} from '..';
import {
    buildCloudflareImageUrl,
    DEFAULT_CLOUDFLARE_BASE_URL,
    toCloudflareOptions,
} from '../cloudflare';

const cloudinaryMedia = (publicId = 'test-public-id'): IMedia => ({
    publicId,
    provider: MediaProvider.cloudinary,
    metadata: { provider: MediaProvider.cloudinary },
});

const cloudflareMedia = (publicId = 'space/img/logo.png'): IMedia => ({
    publicId,
    provider: MediaProvider.cloudflare,
    metadata: { provider: MediaProvider.cloudflare },
});

describe('provider detection', () => {
    it('treats media without a provider as cloudinary (legacy)', () => {
        const url = mediaImageUrl({ publicId: 'legacy-id' });
        expect(url).toContain('res.cloudinary.com');
        expect(url).toContain('/image/');
    });

    it('reads the provider from metadata when the top-level field is absent', () => {
        const url = mediaImageUrl({ publicId: 'space/img/x.png', metadata: { provider: MediaProvider.cloudflare } });
        expect(url).toContain('media.contentchef.io');
    });

    it('lets the top-level provider win over metadata', () => {
        const url = mediaImageUrl({
            publicId: 'space/img/x.png',
            provider: MediaProvider.cloudflare,
            metadata: { provider: MediaProvider.cloudinary },
        });
        expect(url).toContain('media.contentchef.io');
    });
});

describe('mediaImageUrl (cloudinary)', () => {
    it('builds a secure cloudinary image url', () => {
        const url = mediaImageUrl(cloudinaryMedia(), { cloud_name: 'myCloud', resize: { width: 100 } });
        expect(url.startsWith('https://')).toBe(true);
        expect(url).toContain('myCloud');
        expect(url).toContain('/image/');
    });
});

describe('mediaImageUrl (cloudflare)', () => {
    it('builds a /cdn-cgi/image/ url off the default base', () => {
        const url = mediaImageUrl(cloudflareMedia('space/img/logo.png'), {
            resize: { width: 100, height: 200, type: 'fill' },
        });
        expect(url).toBe(`${DEFAULT_CLOUDFLARE_BASE_URL}/cdn-cgi/image/width=100,height=200,fit=cover/space/img/logo.png`);
    });

    it('returns a plain delivery url when no options map to cloudflare params', () => {
        const url = mediaImageUrl(cloudflareMedia('space/img/logo.png'));
        expect(url).toBe(`${DEFAULT_CLOUDFLARE_BASE_URL}/space/img/logo.png`);
    });

    it('honours a baseUrl override and strips redundant slashes', () => {
        const url = mediaImageUrl(cloudflareMedia('/space/img/logo.png'), {
            baseUrl: 'https://cdn.example.com/',
            resize: { width: 50 },
        });
        expect(url).toBe('https://cdn.example.com/cdn-cgi/image/width=50/space/img/logo.png');
    });

    it('does not leak baseUrl into cloudinary transformations', () => {
        const url = mediaImageUrl(cloudinaryMedia(), { baseUrl: 'https://cdn.example.com', resize: { width: 50 } });
        expect(url).not.toContain('baseUrl');
        expect(url).not.toContain('cdn.example.com');
    });
});

describe('mediaVideoUrl', () => {
    it('serves cloudflare video directly from the delivery host', () => {
        const url = mediaVideoUrl(cloudflareMedia('space/video/clip.mp4'));
        expect(url).toBe(`${DEFAULT_CLOUDFLARE_BASE_URL}/space/video/clip.mp4`);
    });

    it('keeps the cloudinary video pipeline', () => {
        const url = mediaVideoUrl(cloudinaryMedia());
        expect(url).toContain('/video/');
    });
});

describe('mediaRawFileUrl', () => {
    it('serves cloudflare raw files directly', () => {
        const url = mediaRawFileUrl(cloudflareMedia('space/raw/doc.pdf'));
        expect(url).toBe(`${DEFAULT_CLOUDFLARE_BASE_URL}/space/raw/doc.pdf`);
    });

    it('keeps the cloudinary raw pipeline', () => {
        const url = mediaRawFileUrl(cloudinaryMedia());
        expect(url).toContain('/raw/');
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

describe('buildCloudflareImageUrl', () => {
    it('joins multiple options with commas', () => {
        const url = buildCloudflareImageUrl('a/b.png', { resize: { width: 100 }, format: 'auto', quality: 80 });
        expect(url).toBe(`${DEFAULT_CLOUDFLARE_BASE_URL}/cdn-cgi/image/width=100,format=auto,quality=80/a/b.png`);
    });
});
