import * as cloudinary from 'cloudinary-core';

const client = cloudinary.Cloudinary.new({});

export type IImageTag = cloudinary.ImageTag;

export function createUrl(publicId: string, cloudName: string): string {
    return client.url(publicId, { cloud_name: cloudName });
}

export function createImgTag(publicId: string, cloudName: string): IImageTag {
    return client.imageTag(publicId, { cloud_name: cloudName });
}
