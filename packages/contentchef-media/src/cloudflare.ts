import { TransformerOption } from '@cld-apis/types';

export const DEFAULT_CLOUDFLARE_BASE_URL = 'https://media.contentchef.io';

const FIT_MAP: { [resizeType: string]: string } = {
    crop: 'crop',
    imaggaCrop: 'crop',
    fill: 'cover',
    fill_pad: 'cover',
    lfill: 'cover',
    thumb: 'cover',
    fit: 'contain',
    mfit: 'contain',
    scale: 'contain',
    limit: 'scale-down',
    imaggaScale: 'scale-down',
    pad: 'pad',
    lpad: 'pad',
    mpad: 'pad',
};

const GRAVITY_MAP: { [gravity: string]: string } = {
    auto: 'auto',
    'auto:subject': 'auto',
    faces: 'auto',
    'faces:center': 'auto',
    face: 'face',
    'face:center': 'face',
    north: 'top',
    south: 'bottom',
    east: 'right',
    west: 'left',
    center: '0.5x0.5',
    north_west: '0x0',
    north_east: '1x0',
    south_west: '0x1',
    south_east: '1x1',
};

const FORMAT_MAP: { [format: string]: string } = {
    auto: 'auto',
    webp: 'webp',
    avif: 'avif',
    jpg: 'jpeg',
    jpeg: 'jpeg',
    png: 'png',
    gif: 'gif',
    json: 'json',
};

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

function toNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
        return undefined;
    }
    const n = Number(value);
    return isNaN(n) ? undefined : n;
}

/** Cloudinary accepts `16:9` or a decimal like `1.5`. */
function parseAspectRatio(aspectRatio?: string): number | undefined {
    if (!aspectRatio) {
        return undefined;
    }
    const [a, b] = String(aspectRatio).split(':').map(Number);
    const ratio = b === undefined ? a : a / b;
    return ratio > 0 && isFinite(ratio) ? ratio : undefined;
}

function mapEffect(effect: { name: string; value?: number | string | string[] | number[] }): string | undefined {
    const raw = Array.isArray(effect.value) ? effect.value[0] : effect.value;
    const value = toNumber(raw);
    switch (effect.name) {
        case 'blur':
            return value !== undefined ? `blur=${clamp(Math.round(value / 8), 1, 250)}` : undefined;
        case 'brightness':
            return value !== undefined ? `brightness=${round2(1 + value / 100)}` : undefined;
        case 'contrast':
            return value !== undefined ? `contrast=${round2(1 + value / 100)}` : undefined;
        case 'saturation':
            return value !== undefined ? `saturation=${round2(1 + value / 100)}` : undefined;
        case 'sharpen':
            return `sharpen=${value !== undefined ? clamp(value, 0, 10) : 1}`;
        case 'grayscale':
        case 'blackwhite':
            return 'saturation=0';
        default:
            return undefined;
    }
}

function encodeBackground(background: string): string {
    return background.replace(/#/g, '%23');
}

export function toCloudflareOptions(options: TransformerOption = {}): string[] {
    const params: string[] = [];
    const { resize, gravity, quality, format, fetchFormat, dpr, rotate, background, effect } = options;

    if (resize) {
        // Cloudflare has no aspect ratio: derive the missing side like Cloudinary, which ignores it when both are set
        const ratio = parseAspectRatio(resize.aspectRatio);
        const w = toNumber(resize.width);
        const h = toNumber(resize.height);
        const width = ratio && resize.width == null && h !== undefined ? Math.round(h * ratio) : resize.width;
        const height = ratio && resize.height == null && w !== undefined ? Math.round(w / ratio) : resize.height;
        if (width !== undefined && width !== null) {
            params.push(`width=${width}`);
        }
        if (height !== undefined && height !== null) {
            params.push(`height=${height}`);
        }
        if (resize.type !== undefined && resize.type !== null) {
            const fit = FIT_MAP[String(resize.type)];
            if (fit) {
                params.push(`fit=${fit}`);
            }
        }
    }

    if (gravity !== undefined && gravity !== null) {
        const mapped = GRAVITY_MAP[String(gravity)];
        if (mapped) {
            params.push(`gravity=${mapped}`);
        }
    }

    // Cloudinary urls get f_auto by default; without format=auto Cloudflare never serves AVIF/WebP
    const fmt = format || fetchFormat;
    params.push(`format=${(fmt && FORMAT_MAP[String(fmt).toLowerCase()]) || 'auto'}`);

    if (quality !== undefined && quality !== null) {
        const numericQuality = toNumber(quality);
        if (numericQuality !== undefined) {
            params.push(`quality=${clamp(Math.round(numericQuality), 1, 100)}`);
        }
    }

    const dprValue = toNumber(dpr);
    if (dprValue !== undefined) {
        params.push(`dpr=${dprValue}`);
    }

    const rotateValue = toNumber(rotate);
    if (rotateValue !== undefined && (rotateValue === 90 || rotateValue === 180 || rotateValue === 270)) {
        params.push(`rotate=${rotateValue}`);
    }

    if (background) {
        params.push(`background=${encodeBackground(background)}`);
    }

    if (effect && effect.name) {
        const mappedEffect = mapEffect(effect);
        if (mappedEffect) {
            params.push(mappedEffect);
        }
    }

    return params;
}

function normalizeBase(baseUrl?: string): string {
    const base = baseUrl || DEFAULT_CLOUDFLARE_BASE_URL;
    return base.replace(/\/+$/, '');
}

function normalizeSource(publicId: string): string {
    return String(publicId).replace(/^\/+/, '');
}

/** Without `options` (video, raw files) the media is served as-is, since Cloudflare only transforms images. */
export function buildCloudflareUrl(publicId: string, options?: TransformerOption, baseUrl?: string): string {
    const base = normalizeBase(baseUrl);
    const source = normalizeSource(publicId);
    if (!options) {
        return `${base}/${source}`;
    }
    return `${base}/cdn-cgi/image/${toCloudflareOptions(options).join(',')}/${source}`;
}
