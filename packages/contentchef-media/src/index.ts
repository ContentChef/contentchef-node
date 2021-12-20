import { CldOptions } from '@cld-apis/types';
import buildUrl from 'cloudinary-build-url';

export type IMediaOptions = CldOptions['transformations'] & {cloud_name: string};

export enum ResourceType {
    image = 'image',
    video = 'video',
    raw = 'raw'
};

const defaultCloudName = 'contentchef';

export function createUrl(publicId: string, options: IMediaOptions = {cloud_name: defaultCloudName}, resourceType: ResourceType = ResourceType.image): string {
    const {cloud_name, ...transformations} = options;
    return buildUrl(publicId, {cloud: {cloudName: cloud_name || defaultCloudName, resourceType, secure: true}, transformations});
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
