### Install

```bash
npm install @contentchef/contentchef-media
# or alternatively with yarn
yarn @contentchef/contentchef-media
```

### Usage

This package provides methods to help you manage and interact with ContentChef's media

* `createUrl` helps you generate a proper url given a media publicId
* `createImageTag` helps you create a img tag given a media publicId
* `createVideoTag` helps you create a video tag given a media publicId

```typescript
import { createUrl, createImageTag, createVideoTag } from '@contentchef/contentchef-node';

const mediaPublicId = 'publicId';

const mediaUrl = createUrl(mediaPublicId);

const imageTag = createImageTag(mediaPublicId);
imageTag.toHtml();

const videoTag = createVideoTag(mediaPublicId);
videoTag.toHtml();

// If you'd like to pass transformations you can do so in the second argument of each method
const transformations = {
  height: 100,
  width: 200
}
const mediaUrl = createUrl(mediaPublicId, transformations);
```
