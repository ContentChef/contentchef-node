Content Chef Typescript SDK
===========================

[Content Chef](https://contentchefwebsite)'s polymorphic typescript SDK for your web and node.js applications.

![Logo](assets/logo-banner.svg)

- [Content Chef Typescript SDK](#content-chef-typescript-sdk)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [API](#api)
      - [ContentChef](#contentchef)
      - [Channel](#channel)

## Requirements

In order to use this SDK, you will need

* An active Content Chef account
* Node.js (v >= 8)

An IDE/TextEditor with support for TypeScript is highly recommended. 

## Installation

```bash
# install it from NPM!
npm i --save @contentchef/contentchef-node
```

## API

#### ContentChef

ContentChef is the default exported function. It is used to configure the SDK with your data.

example

```typescript
import ContentChef from '@contentchef/contentchef-node';

const cf = ContentChef({
  // Your Content Chef apiKey
  apiKey: 'your-content-chef-api-key',
  // Your Content Chef instance domain
  host: 'https://instance.of.contentchef.com/',
  // Will close a pending change after 5 seconds
  timeout: 5000,
});
```

Configuration implements this interface

```typescript
export default interface ISDKConfiguration {
  /**
   * Your Content Chef API key
   * @type {string}
   * @memberof IContentChefConfiguration
   */
  apiKey: string;
  /**
   * Sets a pending request timeout
   * @type {number}
   * @memberof IContentChefConfiguration
   */
  timeout?: number;
  /**
   * Custom agent to perform HTTP requests. 
   * Find further information in the 
   * [axios request config documentation](https://github.com/mzabriskie/axios#request-config).
   * @type {any}
   * @memberof IConfig
   */
  httpAgent?: any;
  /**
   * Custom agent to perform HTTPS requests.
   * Find further information in the 
   * [axios request config documentation](https://github.com/mzabriskie/axios#request-config).
   * @type {any}
   * @memberof IConfig
   */
  httpsAgent?: any;
  /**
   * Content Chef API Endpoint
   * @type {string}
   * @memberof IContentChefConfiguration
   */
  host: string;
  /**
   * Axios proxy configuration. 
   * See the [axios request config documentation](https://github.com/mzabriskie/axios#request-config) 
   * for further information about the supported values.
   * @type {AxiosProxyConfig}
   * @memberof IConfig
   */
  proxy?: AxiosProxyConfig;
}
```

> Bear in mind that `apiKey` and `host` are required

#### Channel

A channel is a collector of contents.

With the SDK you can retrieve contents which are both in *staging* and *live* state.

You can use the **content** method collects a specific content by it's own `publicId`, for example to retrieve a single post from your blog, a single image from a gallery or a set or articles from your featured articles list, otherwise you can use the **search** method to find content with multiple matching criterias, like content definition name, publishing dates and more.

```typescript
import ContentChef from '@contentchef/contentchef-node';

const cf = ContentChef({
  apiKey: 'your-content-chef-api-key',
  host: 'https://instance.of.contentchef.com/',
  timeout: 5000,
});

// opens for example your website channel, will query only the published ones
const websiteChannel = cf.channel('website');

// will retrieve from the channel website a single published content
websiteChannel.content({ publicId: 'your-content-id' }).then(response => /* handles response */);

// will retrieve from the channel website every content with a specific contentDefinition
websiteChannel.search({ contentDefinition: 'featured-articles' }).then(response => /* handles response */);
```