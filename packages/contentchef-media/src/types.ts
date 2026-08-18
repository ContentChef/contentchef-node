export enum MediaProvider {
    cloudinary = 'cloudinary',
    cloudflare = 'cloudflare',
}

export interface IMediaMetadata {
    provider?: MediaProvider | string;
    resourceType?: string;
    format?: string;
    width?: number;
    height?: number;
    aspectRatio?: number;
    name?: string;
    [key: string]: unknown;
}

export interface IMedia {
    publicId: string;
    provider?: MediaProvider | string;
    metadata?: IMediaMetadata;
}

export function resolveProvider(media: IMedia): MediaProvider {
    const provider = (media && media.provider) || (media && media.metadata && media.metadata.provider);
    return provider === MediaProvider.cloudflare ? MediaProvider.cloudflare : MediaProvider.cloudinary;
}
