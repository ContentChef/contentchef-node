import * as cloudinary from 'cloudinary-core';

export type IImageTag = cloudinary.ImageTag;
export type IVideoTag = cloudinary.VideoTag;
export type IMediaOptions = cloudinary.Transformation.Options;

const defaultCloudName = 'contentchef';
const client = cloudinary.Cloudinary.new({cloud_name: defaultCloudName});

export function createUrl(publicId: string, options?: IMediaOptions): string {
    return client.url(publicId, options);
}

export function createImageTag(publicId: string, options?: IMediaOptions): IImageTag {
    return client.imageTag(publicId, options);
}

export function createVideoTag(publicId: string, options?: IMediaOptions): IVideoTag {
    return client.videoTag(publicId, options);
}
