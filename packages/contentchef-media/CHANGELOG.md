# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [9.0.0]
### Added
- Cloudflare Images support: media whose provider resolves to `cloudflare` builds URLs against `https://media.contentchef.io`, overridable per call with the `baseUrl` option
- Cloudinary transformation options are translated to their Cloudflare equivalents (resize and its type as `fit`, gravity, format, quality, dpr, rotate, background and the blur, brightness, contrast, saturation, sharpen and grayscale effects); options with no equivalent are dropped
- `IMedia` and `IMediaMetadata` type exports, and the `BaseUrlAware`, `IMediaUrlOptions`, `IMediaImageOptions`, `IMediaVideoOptions` and `IMediaFileOptions` option types

### Changed
- **BREAKING:** `createUrl`, `imageUrl`, `videoUrl` and `rawFileUrl` now take an `IMedia` object (`{ publicId, provider?, metadata? }`) instead of a `publicId` string, so the provider travels with the media as published rather than being configured at the call site
- The provider is resolved from `media.provider`, falling back to `media.metadata.provider`; anything other than `cloudflare` is served by Cloudinary as before
- `createUrl` infers the resource type from `metadata.resourceType` (defaulting to image) when the `resourceType` argument is omitted
