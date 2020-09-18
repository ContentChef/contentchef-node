import * as cloudinary from 'cloudinary-core';

export type IImageTag = cloudinary.ImageTag;
export type IVideoTag = cloudinary.VideoTag;
export type IMediaOptions = cloudinary.Transformation.Options;

export enum ResourceType {
    image = 'image',
    video = 'video',
    raw = 'raw'
};

const defaultCloudName = 'contentchef';
const client = cloudinary.Cloudinary.new({cloud_name: defaultCloudName, secure: true});

export function createUrl(publicId: string, options?: IMediaOptions, resourceType: ResourceType = ResourceType.image): string {
    return client.url(publicId, {...options, resource_type: resourceType});
}

export function createImageTag(publicId: string, options?: IMediaOptions): IImageTag {
    return client.imageTag(publicId, options);
}

export function createVideoTag(publicId: string, options?: IMediaOptions): IVideoTag {
    return client.videoTag(publicId, options);
}

export function imageUrl(publicId: string, options?: IMediaOptions) {
    return createUrl(publicId, options, ResourceType.image);
}

export function videoUrl(publicId: string, options?: IMediaOptions) {
    return createUrl(publicId, options, ResourceType.video);
}

export function rawFileUrl(publicId: string, options?: IMediaOptions) {
    return createUrl(publicId, options, ResourceType.raw);
}
