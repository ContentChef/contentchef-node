### Install

This is a [Lerna](https://lerna.js.org/) monorepo using npm workspaces, so a single install at the root wires up both packages:

```bash
npm install
```

### Structure

```
contentchef-node/
  packages/
    contentchef-node/
    contentchef-media/
```

* `contentchef-node` package contains the client to retrieve contents from ContentChef. [Click here for more details](./packages/contentchef-node/README.md)
* `contentchef-media` package contains methods to help managing and interacting with ContentChef's media. [Click here for more details](./packages/contentchef-media/README.md)

### Common commands

Run from the repo root via Lerna; each command fans out to both packages:

```bash
npm run lint    # eslint
npm test        # jest with coverage
npm run build   # dual CJS + ESM build
```

### Versioning & Publishing

Both packages are released in lockstep ([fixed mode](https://lerna.js.org/docs/features/version-and-publish#fixed-mode-default)) — `lerna.json` carries the shared version and `lerna version` bumps every package to match. The publish pipeline relies on each package's `prepublishOnly` hook, which runs `npm test && npm run lint && npm run build` before anything is uploaded to npm.

#### One-shot publish (stable)

Bumps versions, generates the changelog, commits, tags, pushes, and publishes in one go:

```bash
npx lerna publish
```

#### Two-step release (recommended for CI)

Separate the version commit from the publish step so the tag exists on `master` before publishing:

```bash
# 1. Bump versions, write CHANGELOG, commit, tag, push
npx lerna version

# 2. Publish whatever versions are now tagged in git
npx lerna publish from-git
```

#### Prereleases (beta / next)

The current line is `7.0.0-beta.*`. Bump to the next prerelease and publish under the `beta` dist-tag so it doesn't replace `latest`:

```bash
# bump 7.0.0-beta.2 → 7.0.0-beta.3 across all packages
npx lerna version prerelease --preid beta

# publish under the `beta` tag
npx lerna publish from-git --dist-tag beta
```

When the line stabilises, graduate the prerelease and publish under `latest`:

```bash
npx lerna version 7.0.0
npx lerna publish from-git
```

#### Dry-run / preview

Lerna has no native `--dry-run`, but you can preview each phase safely:

```bash
# Preview the version bump — updates package.json + lerna.json in the working tree
# but creates no commit, no tag, and pushes nothing. Revert with `git restore .`.
npx lerna version prerelease --preid beta --no-git-tag-version --no-push --yes

# Preview what would be uploaded to npm (runs prepack lint+build hooks too)
npm publish --dry-run --workspaces
# or per-package
npm pack --dry-run -w @contentchef/contentchef-node
```

#### Publishing from local versions (no lerna version)

If `package.json` versions are already bumped (e.g. by a release PR) and you just want to push to npm:

```bash
npx lerna publish from-package
```

### Changelog

To properly generate a changelog based off PRs the following labels must be used:

- `breaking` (💥 Breaking Change)
- `enhancement` (🚀 Enhancement)
- `bug` (🐛 Bug Fix)
- `documentation` (📝 Documentation)
- `internal` (🏠 Internal)

Regenerate with `npm run changelog` (uses `lerna-changelog`).
