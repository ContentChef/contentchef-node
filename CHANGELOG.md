# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- `apiKey` should be passed as an header `X-WHO-KNOWS-Key`

## [2.2.0]- 2020-04-09
### Added
- `host` will default to `https://api.contentchef.io`
- `createUrl` helper that returns the media url for the given `publicId`
- `createImageTag` helper that returns an `<img>` tag for the given `publicId`
- `createVideoTag` helper that returns a `<video>` tag for the given `publicId`
- `cloud_name` for all helpers methods will default to `contentchef`

### Changed
- `host` from `IContentChefConfiguration` is now optional
- `apiKey` is now provided to `onlineChannel` and `previewChannel` as their first argument
- `spaceId` is now required in `IContentChefConfiguration`

### Removed
- `apiKey` from `IContentChefConfiguration`