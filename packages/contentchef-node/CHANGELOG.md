# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [8.0.0]
### Removed
- **BREAKING:** `experimentalOnlineChannel` from the configured SDK and its `content/v3`/`search/v3` endpoints
- **BREAKING:** `enableExperimentalChannel` and `useExperimentalOnlineChannel` options from `IContentChefConfiguration`
- `GetExperimentalOnlineChannelMethods` type and `configureExperimentalOnlineMethods` from the `IConfigurable` interface

## [7.0.0-beta.0]
### Fixed
- Removed `axios` from package dependencies

## [7.0.0-alpha.5]
### Fixed
- Read response as text to avoid double consuming the buffer

## [7.0.0-alpha.4]
### Fixed
- Data defaults to text when error does not have JSON response

## [7.0.0-alpha.3]
### Changed
- `IMethodResponse` now returns `status` and `ok` properties

## [7.0.0-alpha.2]
### Fixed
- Custom host should now work properly

## [7.0.0-alpha.0]
### Added
- Experimental channel for cached endpoints

## [6.0.0]
### Changed
- Removed `axios`, now the client uses global `fetch` to support edge environments
- Removed `axios` related configuration from `IContentChefConfiguration`
- All channel methods now return `IMethodResponse` instead of `AxiosResponse`
- For SSR usage you should provide a global fetch (e.g. `node-fetch` or similar)

### Fixed
- Return correct data value from `executeFetchRequest`
- Linting errors
- Add lint script to prepack

## [5.0.3]
### Added
- Type for image options

## [5.0.2]
### Fixed
- Export types from `cloudinary-build-url`

## [5.0.1]
### Fixed
- `cloud_name` optional in `IMediaOptions`

## [5.0.0]
### Changed
- Use `cloudinary-build-url` and remove `@cloudinary/url-gen`
- Create CommonJS and ESNext bundles when building
- Use named export for `qs` stringify

## [4.0.3]
### Added
- `locale` in `IResponseMetadata`

## [4.0.2]
### Added
- `availableLocales` to `IResponseMetadata`

## [4.0.1]
### Added
- Localized methods on channels (`localizedContent`, `localizedSearch`)

## [4.0.0]
### Added
- Methods for generating image, video, raw URL

## [3.0.0]
### Changed
- Bump node and media packages to 3.0.0
- Split media into separate package (`contentchef-media`)

## [2.2.4] - 2020-06-01
### Added
- `IChannelMethods` interface to deprecate `IPreviewChannelMethods` and `IOnlineChannelMethods` as since version 2.0.0 they were the same

## [2.2.3] - 2020-05-27
### Added
- `apiKey` should be passed as a header named `X-Chef-Key`

## [2.2.2] - 2020-05-05
### Added
- better check in chef client initialization when `configuration.host` is pass, and it's value is equal to `undefined` 

## [2.2.1] - 2020-04-09
### Added
- `secure` option to `true` when initializing cloudinary client to prevent images url without https protocol


## [2.2.0] - 2020-04-09
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
