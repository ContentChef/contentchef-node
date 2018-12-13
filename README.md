Content Chef Typescript SDK
===========================

[Content Chef](https://contentchefwebsite)'s polymorphic typescript SDK for your web and node.js applications.

![Logo](assets/logo-banner.svg)

- [Content Chef Typescript SDK](#content-chef-typescript-sdk)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [API](#api)
      - [ContentChef](#contentchef)
      - [repository](#repository)

## Requirements

In order to use this SDK, you will need

* A active Content Chef account
* Node.js (v >= 8)

An IDE/TextEditor with support for TypeScript is highly recommended. 

## Installation

```bash
# install it from NPM!
npm i --save @byte-code/contentchef-sdk
```

## API

#### ContentChef

ContentChef is the default exported function. It is used to configure the SDK with your data.

example

```typescript
import ContentChef from '@byte-code/contentchef-sdk';

const cf = ContentChef({
  // Your Content Chef apiKey
  apiKey: 'your-content-chef-api-key',
  // Will close every http call exceeding this duration (in milliseconds)
  callTimeout: 5000,
  // Your Content Chef instance domain
  serviceRoot: 'https://instance.of.contentchef.com/',
});
```

> Bear in mind that `apiKey` and `serviceRoot` are required

#### repository

A repository is a collector of contents in a certain channel.

With the SDK you can retrieve contents which are both in *staging* and *live* state.

You can use the **content** method collects a specific content by it's own `publicId`, for example to retrieve a single post from your blog, a single image from a gallery or a set or articles from your featured articles list, otherwise you can use the **search** method to find content with multiple matching criterias, like content definition name, publishing dates and more.

```typescript
import ContentChef from '@byte-code/contentchef-sdk';

const cf = ContentChef({
  apiKey: 'your-content-chef-api-key',
  callTimeout: 5000,
  serviceRoot: 'https://instance.of.contentchef.com/',
});

// opens for example an article repository, will query only the published ones
const publishedArticles = cf.repository('articles', 'live');

// will retrieve from the channel articles a single published content
publishedArticles.content({ publicId: 'your-content-id' }).then(response => /* handles response */);

// will retrieve from the channel articles every content with a specific contentDefinition
publishedArticles.search({ contentDefinition: 'featured-articles' }).then(response => /* handles response */);
```