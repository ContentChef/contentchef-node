### Install

```bash
npm run bootstrap
# or with yarn
yarn bootstrap
```

### Structure

```
contentchef-node/
  packages/
    contentchef-node/
    contentchef-media/
```

* `contentchef-node` package contains the client to retrieve contents from ContentChef. [Click here for more details](./packages/contentchef-node/README.md)
* `contentchef-media` package contains methods to help managing and interacting with ContentChef's media. [Click here for more details](./packages/contentchef-media/README.md);

### Changelog

To properly generate a changelog based off PRs labels needs to be used

- breaking (💥 Breaking Change)
- enhancement (🚀 Enhancement)
- bug (🐛 Bug Fix)
- documentation (📝 Documentation)
- internal (🏠 Internal)