import { TransformerOption, TransformerVideoOption } from '@cld-apis/types';
import cloudinaryBuildUrl from 'cloudinary-build-url';
import { buildCloudflareUrl } from './cloudflare';
import { IMedia, MediaProvider, resolveProvider } from './types';

export type IMediaOptions = (TransformerOption | TransformerVideoOption) & {
  cloud_name?: string;
};
export type IImageOptions = TransformerOption & { cloud_name?: string };
export type IVideoOptions = TransformerVideoOption & { cloud_name?: string };

export type BaseUrlAware = { baseUrl?: string };
export type IMediaUrlOptions = IMediaOptions & BaseUrlAware;
export type IMediaImageOptions = IImageOptions & BaseUrlAware;
export type IMediaVideoOptions = IVideoOptions & BaseUrlAware;
export type IMediaFileOptions = IMediaOptions & BaseUrlAware;

export enum ResourceType {
  image = 'image',
  video = 'video',
  raw = 'raw',
}

const defaultCloudName = 'contentchef';

function inferResourceType(media: IMedia): ResourceType {
  const resourceType = media.metadata && media.metadata.resourceType;
  if (resourceType === ResourceType.video) {
    return ResourceType.video;
  }
  if (resourceType === ResourceType.raw) {
    return ResourceType.raw;
  }
  return ResourceType.image;
}

/**
 * Builds a delivery URL for a media object taken from a published content payload.
 *
 * The provider and the resource type are detected from the media object itself
 * (`metadata.resourceType`, defaulting to image); pass `resourceType` to force it.
 *
 * @param media - Media reference, e.g. `{ publicId, provider, metadata }`.
 * @param options - Transformation options; `baseUrl` overrides the default delivery host.
 * @param resourceType - Overrides the resource type inferred from `metadata`.
 * @returns The media delivery URL.
 *
 * @example
 * createUrl(media);
 * createUrl(media, { resize: { width: 200 } });
 * createUrl(media, {}, ResourceType.video);
 */
export function createUrl(
  media: IMedia,
  options: IMediaUrlOptions = {},
  resourceType?: ResourceType,
): string {
  const type = resourceType || inferResourceType(media);
  const { cloud_name, baseUrl, ...transformations } = options;
  if (resolveProvider(media) === MediaProvider.cloudflare) {
    const cloudflareOptions =
      type === ResourceType.image
        ? (transformations as TransformerOption)
        : undefined;
    return buildCloudflareUrl(media.publicId, cloudflareOptions, baseUrl);
  }
  return cloudinaryBuildUrl(media.publicId, {
    cloud: {
      cloudName: cloud_name || defaultCloudName,
      resourceType: type,
      secure: true,
    },
    transformations,
  });
}

/**
 * Builds a delivery URL for the given media, forcing the image resource type.
 *
 * @param media - Media reference, e.g. `{ publicId, provider, metadata }`.
 * @param options - Transformation options; `baseUrl` overrides the default delivery host.
 * @returns The image delivery URL.
 */
export function imageUrl(media: IMedia, options?: IMediaImageOptions) {
  return createUrl(media, options, ResourceType.image);
}

/**
 * Builds a delivery URL for the given media, forcing the video resource type.
 *
 * @param media - Media reference, e.g. `{ publicId, provider, metadata }`.
 * @param options - Transformation options; `baseUrl` overrides the default delivery host.
 * @returns The video delivery URL.
 */
export function videoUrl(media: IMedia, options?: IMediaVideoOptions) {
  return createUrl(media, options, ResourceType.video);
}

/**
 * Builds a delivery URL for the given media (pdf, zip, etc.), forcing the raw resource type.
 *
 * @param media - Media reference, e.g. `{ publicId, provider, metadata }`.
 * @param options - Transformation options; `baseUrl` overrides the default delivery host.
 * @returns The raw-file delivery URL.
 */
export function rawFileUrl(media: IMedia, options?: IMediaFileOptions) {
  return createUrl(media, options, ResourceType.raw);
}

export { IMedia, IMediaMetadata } from './types';

export {
  AudioCodec,
  Border,
  ColorSpace,
  CompassGravity,
  Condition,
  ConditionExpression,
  CustomFunction,
  Effect,
  Expression,
  Flag,
  FPS,
  FPSType,
  Gravity,
  Offset,
  Position,
  Radius,
  Resize,
  ResizeType,
  Rotation,
  StringValue,
  TextStyle,
  Transformation,
  TransformerBaseOptions,
  TransformerOption,
  TransformerVideoOption,
  Variable,
  VColorSpace,
  VEffect,
  VFlag,
} from '@cld-apis/types';
