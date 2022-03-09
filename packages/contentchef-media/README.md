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
