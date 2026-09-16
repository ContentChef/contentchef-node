# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [9.0.0-beta.1]
### Changed
- **BREAKING:** `createUrl`, `imageUrl`, `videoUrl` and `rawFileUrl` now take an `IMedia` object
  (`{ publicId, provider?, metadata? }`) instead of a `publicId` string, so the provider travels
  with the media as published rather than being configured at the call site
- `createUrl` infers the resource type from `metadata.resourceType` (defaulting to image) when the
  `resourceType` argument is omitted

## [9.0.0-alpha.2]
### Added
- Cloudflare Images support: media whose provider resolves to `cloudflare` builds URLs against
  `https://media.contentchef.io`, overridable per call with the `baseUrl` option
- `IMedia`, `IMediaMetadata` and `MediaProvider` exports, and the `BaseUrlAware` option type
- Cloudinary transformation options are translated to their Cloudflare equivalents
  (resize type to `fit`, gravity, format, quality)

### Changed
- The provider is resolved from `media.provider`, falling back to `media.metadata.provider`;
  anything other than `cloudflare` is served by Cloudinary as before
