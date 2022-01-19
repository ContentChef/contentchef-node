import { TransformerOption, TransformerVideoOption } from '@cld-apis/types';
import buildUrl from 'cloudinary-build-url';

export type IMediaOptions = (TransformerOption | TransformerVideoOption) & {cloud_name?: string};
export type IVideoOptions = TransformerVideoOption & {cloud_name?: string};

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

export function videoUrl(publicId: string, options?: IVideoOptions) {
    return createUrl(publicId, options, ResourceType.video);
}

export function rawFileUrl(publicId: string, options?: IMediaOptions) {
    return createUrl(publicId, options, ResourceType.raw);
}

export {
    AudioCodec, Border, ColorSpace, CompassGravity, Condition,
    ConditionExpression, CustomFunction, Effect, Expression,
    Flag, FPS, FPSType, Gravity,
    Offset,
    Position,
    Radius,
    Resize,
    ResizeType,
    Rotation, StringValue, TextStyle, Transformation, TransformerBaseOptions,
    TransformerOption,
    TransformerVideoOption, Variable, VColorSpace, VEffect, VFlag
} from '@cld-apis/types';

