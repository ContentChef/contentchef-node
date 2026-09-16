### Install

```bash
npm install @contentchef/contentchef-media
# or alternatively with yarn
yarn @contentchef/contentchef-media
```

### Usage

This package builds ContentChef media urls. Media can be hosted on **Cloudinary** (legacy) or
**Cloudflare** — you don't pick the provider: pass the media object and the right url is built
for you.

`createUrl` takes the whole media object (`{ publicId, provider, metadata }`) as it appears in a
published content payload:

```typescript
import { createUrl, ResourceType } from '@contentchef/contentchef-media';

// A media field taken straight from a published content payload
const media = content.payload.hero; // { publicId, provider, metadata }

// Provider and resource type (image / video / raw) are detected from the media object
const url = createUrl(media);

// Pass Cloudinary transformation options in the second argument
const resized = createUrl(media, { resize: { width: 200, height: 100, type: 'fill' } });

// Override the detected resource type with the optional third argument
const asVideo = createUrl(media, {}, ResourceType.video);
```

Three per-type helpers wrap `createUrl` when you want to force the resource type explicitly:

* `imageUrl(media, options?)`
* `videoUrl(media, options?)`
* `rawFileUrl(media, options?)`

> **Migrating from v8:** these functions now take the whole media object instead of a bare
> `publicId` string. If you only have a `publicId`, wrap it: `createUrl({ publicId })`.

### How urls are built

The provider is read from `media.provider` (falling back to `media.metadata.provider`), and the
resource type from `media.metadata.resourceType` (defaulting to image). Anything that isn't
explicitly `cloudflare` is treated as Cloudinary, so existing media keep working unchanged.

**Transformations always use the Cloudinary option types.** For Cloudflare media they are mapped
to [Cloudflare Image Resizing](https://developers.cloudflare.com/images/transform-images/transform-via-url/)
parameters and rendered as `https://media.contentchef.io/cdn-cgi/image/<options>/<publicId>`.
For example the resized call above yields:

```
https://media.contentchef.io/cdn-cgi/image/width=200,height=100,fit=cover/<publicId>
```

Notes for Cloudflare media:

* The base host defaults to `https://media.contentchef.io`; override it per call with
  `{ baseUrl: 'https://your-zone.example.com' }`.
* Image resizing is image-only. Video and raw files are served as plain delivery urls
  (`https://media.contentchef.io/<publicId>`) with transformations ignored.
* Only Cloudinary options with a Cloudflare counterpart are mapped (dimensions, `fit`,
  `gravity`, `quality`, `format`, `dpr`, `rotate`, `background`, and common `effect`s);
  unmappable options are ignored rather than producing a broken url.
