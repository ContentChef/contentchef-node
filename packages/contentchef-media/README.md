### Install

```bash
npm install @contentchef/contentchef-media
# or alternatively with yarn
yarn @contentchef/contentchef-media
```

### Usage

This package provides methods to help you manage and interact with ContentChef's media

* `createUrl` helps you generate a proper url given a media publicId
* `imageUrl` helps you create an url for an image given a media publicId
* `videoUrl` helps you create an url for a video given a media publicId
* `rawFileUrl` helps you create an url for a raw file (pdf, zip, ecc.) given a media publicId

```typescript
import { createUrl, imageUrl, videoUrl, rawFileUrl } from '@contentchef/contentchef-node';

const mediaPublicId = 'publicId';

const mediaUrl = createUrl(mediaPublicId);

const image = imageUrl(mediaPublicId);

const video = videoUrl(mediaPublicId);

const rawFile = rawFileUrl(mediaPublicId);

// If you'd like to pass transformations you can do so in the second argument of each method
const transformations = {
  height: 100,
  width: 200
}
const mediaUrl = createUrl(mediaPublicId, transformations);
```

### Provider-aware urls (Cloudinary or Cloudflare)

Media in ContentChef can be hosted on **Cloudinary** (legacy) or **Cloudflare**. The
functions above always build Cloudinary urls. The provider-aware functions instead take the
whole media object (`{ publicId, provider, metadata }`) as it appears in a published content
payload, detect the provider, and build the right url:

* `mediaImageUrl(media, options?)`
* `mediaVideoUrl(media, options?)`
* `mediaRawFileUrl(media, options?)`

The provider is read from `media.provider` (falling back to `media.metadata.provider`).
Anything that isn't explicitly `cloudflare` is treated as Cloudinary, so existing media keep
working unchanged.

```typescript
import { mediaImageUrl, mediaVideoUrl, mediaRawFileUrl } from '@contentchef/contentchef-media';

// A media field taken straight from a published content payload
const media = content.payload.hero; // { publicId, provider, metadata }

const image = mediaImageUrl(media, { resize: { width: 200, height: 100, type: 'fill' } });
const video = mediaVideoUrl(media);
const rawFile = mediaRawFileUrl(media);
```

**Transformations use the Cloudinary option types in every case.** For Cloudflare media they
are mapped to [Cloudflare Image Resizing](https://developers.cloudflare.com/images/transform-images/transform-via-url/)
parameters and rendered as `https://media.contentchef.io/cdn-cgi/image/<options>/<publicId>`.
For example the call above yields:

```
https://media.contentchef.io/cdn-cgi/image/width=200,height=100,fit=cover/<publicId>
```

Notes for the Cloudflare provider:

* The base host defaults to `https://media.contentchef.io`; override it per call with
  `{ baseUrl: 'https://your-zone.example.com' }`.
* Image resizing is image-only, so `mediaVideoUrl`/`mediaRawFileUrl` return the plain delivery
  url `https://media.contentchef.io/<publicId>`.
* Only Cloudinary options with a Cloudflare counterpart are mapped (dimensions, `fit`,
  `gravity`, `quality`, `format`, `dpr`, `rotate`, `background`, and common `effect`s);
  unmappable options are ignored rather than producing a broken url.
