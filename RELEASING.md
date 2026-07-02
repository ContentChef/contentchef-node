# Releasing

Publishing is automated by [`.github/workflows/publish.yml`](.github/workflows/publish.yml). It runs whenever a **per-package** tag is pushed — i.e. any tag matching `@contentchef/*`.

Lerna runs in **independent** mode (`"version": "independent"` in [`lerna.json`](lerna.json)), so each package carries its own version and is released on its own. There is no shared/lockstep version anymore.

- `packages/contentchef-node` → tag `@contentchef/contentchef-node@<version>`
- `packages/contentchef-media` → tag `@contentchef/contentchef-media@<version>`

Each pushed tag triggers its **own** workflow run, which parses the tag and publishes **only** the package named in it. Releasing one package never touches the other.

## One-time setup

### 1. Create an npm automation token

1. Sign in to <https://www.npmjs.com> with an account that has `publish` rights on the `@contentchef` scope.
2. Avatar → **Access Tokens** → **Generate New Token** → **Classic Token** → type **Automation** (bypasses 2FA so CI can use it).
   - Alternatively, generate a **Granular Access Token** scoped to the `@contentchef` packages with **Read and write** permission.
3. Copy the token (`npm_…`). You will not see it again.

### 2. Add the token to GitHub repository secrets

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
2. Name: `NPM_AUTH_TOKEN`. Value: the token from the previous step. Save.

### 3. (Optional) Allow npm provenance

The workflow publishes with provenance (via `NPM_CONFIG_PROVENANCE=true` and the `id-token: write` permission). This embeds a signed attestation linking each tarball to the exact GitHub Actions run that built it. Nothing else to configure — it works automatically once the token is in place.

## Cutting a release

Run these from a clean `master` checkout.

```bash
npx lerna version            # interactive — prompts a version for each CHANGED package
git push --follow-tags       # only needed if lerna's auto-push was disabled
```

`lerna version`:

- detects which packages changed since **their own** last release tag,
- prompts you for a new version **per package**,
- writes each `package.json`, updates the changelog, commits, and creates one tag per bumped package (`@contentchef/<pkg>@<version>`),
- pushes commit + tags by default.

Because it only touches **changed** packages, the normal way to "release just one package" is simply to land changes in that package — the untouched package won't be bumped, tagged, or published.

### Force-release a specific package

To bump a package that Lerna considers unchanged (e.g. a metadata-only or dependency bump), name it explicitly:

```bash
npx lerna version --force-publish=@contentchef/contentchef-media
```

The released set is *changed packages ∪ force-published packages*. On a clean `master` where only the package you care about has commits, this reliably targets exactly one package.

### Prerelease (beta / next)

```bash
npx lerna version prerelease --preid beta
```

This bumps e.g. `8.1.0-beta.2` → `8.1.0-beta.3` on each changed package and pushes tags like `@contentchef/contentchef-node@8.1.0-beta.3`. The workflow reads the preid from the version and publishes under the matching dist-tag (`beta`), leaving `latest` untouched. Consumers install with `npm i @contentchef/contentchef-node@beta`.

The dist-tag derivation in the workflow is: the portion after the version's `-`, up to the first `.`, becomes the tag (`8.1.0-beta.3` → `beta`, `1.2.3-rc.1` → `rc`, stable `1.2.3` → `latest`).

### Explicit version

```bash
npx lerna version --force-publish=@contentchef/contentchef-node
# then pick the exact version at the prompt, e.g. to graduate a beta to stable
```

## Dry-run before releasing

Always-safe local previews — neither touches git remotes nor the npm registry:

```bash
# Preview the version bump (mutates package.json + lerna.json, no commit/tag/push).
# Revert with: git restore .
npx lerna version prerelease --preid beta --no-git-tag-version --no-push --yes

# Preview a single package's publish (runs prepack lint+build, lists tarball contents, no upload).
npm publish --workspace @contentchef/contentchef-node --dry-run
npm publish --workspace @contentchef/contentchef-media --dry-run
```

## Recovering from a failed publish

If the workflow fails after the tag was already pushed (e.g. flaky npm, expired token), just re-run that tag's workflow from the **Actions** tab — it republishes only that one package, and npm rejects a re-publish of an already-present version, so a partial success is safe to retry.

If the tag itself is wrong, delete it locally and remotely before re-tagging:

```bash
git tag -d @contentchef/contentchef-node@8.1.0
git push origin :refs/tags/@contentchef/contentchef-node@8.1.0
```

## Changelog labels

`lerna-changelog` groups PRs by these labels — make sure every PR carries one:

- `breaking` (💥 Breaking Change)
- `enhancement` (🚀 Enhancement)
- `bug` (🐛 Bug Fix)
- `documentation` (📝 Documentation)
- `internal` (🏠 Internal)
