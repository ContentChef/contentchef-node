import { createCloudinaryLegacyURL } from '@cloudinary/url-gen';
import { LegacyITransforamtionOptions } from '@cloudinary/url-gen/types/types';

export type IMediaOptions = LegacyITransforamtionOptions;

export enum ResourceType {
    image = 'image',
    video = 'video',
    raw = 'raw'
};

const defaultCloudName = 'contentchef';

export function createUrl(publicId: string, options?: IMediaOptions, resourceType: ResourceType = ResourceType.image): string {
    return createCloudinaryLegacyURL(publicId, { ...options, resource_type: resourceType, cloud_name: options && options.cloud_name ? options.cloud_name : defaultCloudName, secure: true });
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
