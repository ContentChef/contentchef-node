---
name: contentchef-node-usage
description: How to configure and consume the @contentchef/contentchef-node SDK — channels (online, preview, experimental), content/search methods, localized variants, sorting, prop filters, target dates. Use when the user is integrating the SDK in an app, debugging SDK responses, or asking about endpoints/params the SDK exposes.
---

# Using `@contentchef/contentchef-node`

The SDK is a thin fetch client over the ContentChef **publishing** HTTP API
(`packages/lambdas/src/app/publishing` in `ContentChef/contentchef-serverless`).
It exposes **read-only** content delivery endpoints — publishing itself
(create release, publish-to-live, etc.) is not exposed by this SDK.

## 1. Configure the SDK

```ts
import ContentChef from '@contentchef/contentchef-node';

const cf = ContentChef({
  spaceId: 'my-space',           // required
  host: 'https://api.contentchef.io', // optional, default shown
  timeout: 5000,                 // optional, ms
  enableExperimentalChannel: false, // optional, see §4
}, targetDateResolver);          // string ISO date | ITargetDateResolver | undefined
```

`ITargetDateResolver`:
```ts
interface ITargetDateResolver {
  getTargetDate(): Promise<string | undefined>; // ISO 8601, e.g. '2026-04-18T12:00:00Z'
}
```
Only the **preview** channel sends `targetDate`; online ignores it.

Validation performed by `ConfigurationManager`: `spaceId` must be a non-empty
string, `timeout` a non-negative number, `host` a non-empty string when
provided. Invalid input throws `TypeError` synchronously.

## 2. Channels

`configure()` returns:

```ts
interface IConfiguredSDK {
  onlineChannel:  (apiKey, channel, locale?) => IChannelMethods;
  previewChannel: (apiKey, channel, state, locale?) => IChannelMethods;
  experimentalOnlineChannel?: (apiKey, channel, locale?) => IChannelMethods;
}
```

- **`onlineChannel`** → only *live* content visible **now**.
  Backend: `GET /space/{spaceId}/online/content/{channel}[/{locale}]`
  and `/online/search/v2/{channel}[/{locale}]`. Cached 300s at API Gateway.
- **`previewChannel`** → *live* OR *staging* content, can be resolved at a
  `targetDate` ≠ now. Takes `PublishingStatus.Live | PublishingStatus.Staging`.
  Backend: `/preview/{state}/content|search/v2/{channel}[/{locale}]`.
  Not cached.
- **`experimentalOnlineChannel`** → only attached when `host` is the default
  OR `enableExperimentalChannel: true`. Points at `content/v3` and `search/v3`
  (not in `serverless.yml` — these live on a separate deployment).

`state` for preview: use the `PublishingStatus` enum, not a raw string.

```ts
import { PublishingStatus } from '@contentchef/contentchef-node';
const live    = cf.previewChannel('key', 'website', PublishingStatus.Live);
const staging = cf.previewChannel('key', 'website', PublishingStatus.Staging);
```

Each channel returns:

```ts
interface IChannelMethods {
  content<T>(params: IGetContentConfig):       Promise<IMethodResponse<IGetContentResponse<T>>>;
  search<T>(params: ISearchConfig):            Promise<IMethodResponse<IPaginatedResponse<IResponse<T>>>>;
  localizedContent<T>(params: IGetContentConfig): /* same as content */;
  localizedSearch<T>(params: ISearchConfig):      /* same as search  */;
}
```

`localized*` variants append `/{locale}` to the URL — pass `locale` when
creating the channel. If `locale` is omitted, they behave like the
non-localized variants.

## 3. `content` vs `search`

### `content(params)` — single item by publicId
```ts
interface IGetContentConfig { publicId: string; legacyMetadata?: boolean; }
```
Returns `IGetContentResponse<T>` (one `IResponse<T>`).

### `search(params)` — paginated, filterable
```ts
interface ISearchConfig {
  skip: number;            // required
  take: number;            // required (page size)
  publicId?:         string | string[];
  contentDefinition?: string | string[];
  repositories?:     string[];
  tags?:             string | string[];
  legacyMetadata?:   boolean;
  propFilters?:      IPropFilter;
  sorting?:          ISortingField[] | string; // '+publicId, -onlineDate' or array
}
```

Returns `IPaginatedResponse<IResponse<T>>` with `items`, `total`, `skip`,
`take`, `requestContext`.

### Sorting
Accepts either a string (`'+publicId, -onlineDate'`) or an array of
`{ fieldName, ascending }`. `+` = ascending, `-` = descending.
Serializer in `serializeSorting.ts`.

### Prop filters
```ts
interface IPropFilter {
  condition: 'AND' | 'OR';
  items: Array<{ field: string; operator: Operators; value: any }>;
}
```
`Operators`: `CONTAINS | CONTAINS_IC | EQUALS | EQUALS_IC | IN | IN_IC | STARTS_WITH | STARTS_WITH_IC`
(`_IC` = case-insensitive). Passed as JSON-stringified query param `propFilters`.

## 4. Response shape

```ts
interface IMethodResponse<T> {
  data: T;
  config: { url: string; params: URLSearchParams };
  status: number;
  ok: boolean;          // false on 4xx/5xx — check this, no exceptions thrown
}
```
`executeFetchRequest` never throws on HTTP errors — inspect `ok`/`status`.
If the body is not JSON, `data` is the raw text string.

Each item (`IResponse<T>`):
```ts
{ definition, repository, publicId, metadata, offlineDate, onlineDate, payload: T, requestContext }
```
`payload` is your typed content. `metadata.availableLocales` is present for
localized queries.

## 5. Patterns

**Type your payloads.**
```ts
interface Article { title: string; body: string; }
const res = await online.search<Article>({ skip: 0, take: 10, contentDefinition: 'article' });
if (!res.ok) throw new Error(`ContentChef ${res.status}`);
res.data.items.forEach(i => console.log(i.payload.title));
```

**Dynamic target date for preview.**
```ts
const cf = ContentChef({ spaceId }, {
  getTargetDate: async () => req.headers['x-preview-date'] ?? undefined,
});
```

**Locale-aware channel.**
```ts
const itChannel = cf.onlineChannel(apiKey, 'website', 'it-IT');
await itChannel.localizedSearch<Article>({ skip: 0, take: 5 });
// GET /space/{spaceId}/online/search/v2/website/it-IT?skip=0&take=5
```

## 6. Auth & transport

- Header sent: `X-Chef-Key: <apiKey>`. `apiKey` is per-channel, not global.
- SDK uses the global `fetch` (Node ≥ 18 or polyfilled). No axios.
- `timeout` in config is not currently enforced in `executeFetchRequest` —
  wrap in `AbortController` yourself if you need it.

## 7. Gotchas

- `host` must be a **non-empty** string if provided — `''` throws.
- Providing a custom `host` silently drops `experimentalOnlineChannel`
  unless `enableExperimentalChannel: true`.
- `search`'s `skip`/`take` are **required**, not defaulted.
- `legacyMetadata` in `content()` is stringified unconditionally
  (`'true'`/`'false'`/`'undefined'`) — pass it explicitly or the query string
  will contain `legacyMetadata=undefined`.
- `propFilters` is JSON-serialized client-side; the backend parses JSON —
  don't pre-stringify.

## 8. Where things live

- SDK entry: `packages/contentchef-node/src/index.ts`
- Channel logic: `packages/contentchef-node/src/services/Channel/index.ts`
- Public types: `packages/contentchef-node/src/services/Channel/interfaces/index.ts`
- Config validation: `packages/contentchef-node/src/services/ConfigurationManager/index.ts`
- Backend endpoints: `packages/lambdas/src/app/publishing/serverless.yml`
  in `ContentChef/contentchef-serverless` (private repo).
