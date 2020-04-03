import * as cloudinary from 'cloudinary-core';

const client = cloudinary.Cloudinary.new({});

export type IImageTag = cloudinary.ImageTag;
export type IVideoTag = cloudinary.VideoTag;

export function createUrl(publicId: string, cloudName: string): string {
    return client.url(publicId, { cloud_name: cloudName });
}

export function createImageTag(publicId: string, cloudName: string): IImageTag {
    return client.imageTag(publicId, { cloud_name: cloudName });
}

export function createVideoTag(publicId: string, cloudName: string): IVideoTag {
    return client.videoTag(publicId, { cloud_name: cloudName });
}
