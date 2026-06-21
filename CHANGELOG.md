# Changelog

All notable changes to this project are documented here. Versioned releases are
published automatically by [semantic-release](https://github.com/semantic-release/semantic-release)
to npm and GitHub Releases.

## [Unreleased]

### Changed
- Migrated the toolchain from yarn/Node to [Bun](https://bun.sh) for installing,
  testing, and running scripts (`bun.lock`, `packageManager: bun`)
- Replaced Jest/ts-jest with the built-in `bun test` runner (tests import from `bun:test`)
- Replaced ESLint + Prettier with [Biome](https://biomejs.dev) for unified lint/format
- Switched the build to Rollup + esbuild, producing dual **CommonJS + ESM** bundles
  plus a minified **UMD** bundle for CDNs (`exports` map, `module` field, `sideEffects: false`)
- Made the package fully universal and tree-shakeable: separate `.d.mts`/`.d.cts`
  type declarations per module system (clean `publint` and `are-the-types-wrong`),
  `unpkg`/`jsdelivr` fields for `<script>` use, and documented Node/Bun/Deno/browser usage
- Raised the TypeScript target from ES5 to ES2020 and enabled stricter compiler options
- Mirrored the `graphql-upload-ts` release pipeline: reusable `validate.yml`, a matrix
  CI (`ci.yml`, Node 22 & 24), and a `release.yml` running semantic-release with npm
  provenance, plus husky + lint-staged pre-commit hooks
- Updated all dependencies to their latest versions

### Removed
- Dropped ESLint, Prettier, Jest, ts-jest, `rollup-plugin-uglify`, and the now-unused
  `tslib` (esbuild inlines helpers); replaced `@rollup/plugin-typescript` with
  `rollup-plugin-dts` for declaration output
- Removed dead code in `parseUrl` and replaced the global `isNaN` with `Number.isNaN`

## [6.2.0](https://github.com/meabed/build-url-ts/releases/tag/v6.2.0)

### Added
- Comprehensive test coverage (137+ cases) and edge-case handling
- TypeScript enhancements and improved documentation

## Earlier releases

See the [GitHub Releases](https://github.com/meabed/build-url-ts/releases) page for
the full history prior to 6.2.0.
