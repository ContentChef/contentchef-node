import * as cloudinary from 'cloudinary-core';

export type IImageTag = cloudinary.ImageTag;
export type IVideoTag = cloudinary.VideoTag;

const defaultCloudName = 'contentchef';
const client = cloudinary.Cloudinary.new({cloud_name: defaultCloudName});

export function createUrl(publicId: string, cloudName: string = defaultCloudName): string {
    return client.url(publicId, { cloud_name: cloudName });
}

export function createImageTag(publicId: string, cloudName: string = defaultCloudName): IImageTag {
    return client.imageTag(publicId, { cloud_name: cloudName });
}

export function createVideoTag(publicId: string, cloudName: string = defaultCloudName): IVideoTag {
    return client.videoTag(publicId, { cloud_name: cloudName });
}
