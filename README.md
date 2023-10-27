<img src="https://user-images.githubusercontent.com/41601975/221385568-db7e3649-a1f1-4df7-9bf8-5eb30182653e.svg" height="55px" alt="reggex" />

[![NPM version][npm-version-src]][npm-version-href]
[![NPM downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]
[![Bundlephobia][bundlephobia-src]][bundlephobia-href]

> A programmatic and human-readable API to create strongly-typed regular expressions in Typescript.

## 📖 Table of Contents

- [📖 Table of Contents](#-table-of-contents)
- [⚡ Features](#-features)
- [🧑‍💻 Development](#-development)
- [💡 Inspiration](#-inspiration)

## ⚡ Features

This library is still under active development. Once the API becomes more stable, the README will be updated with more useful documentation.

## 🧑‍💻 Development

This project is open to any contributions via pull requests! Here are some steps to help with any contributions you would like to make:

1. Clone the repo (`git clone git@github.com:pcbowers/reggex.git`)
2. Install the dependencies using pnpm (`pnpm install`)
3. Run tests interactively using vitest while making changes (`pnpm run dev`)
4. Ensure all the lint tests pass using prettier and eslint (`pnpm run lint`)
5. Ensure the package can be built using tsup (`pnpm run build`)
6. Use changesets to describe any release-dependent changes (`pnpm run changeset`)
7. Commit and Push your changes, ensuring any CI workflows pass
8. Create a Pull Request to begin the review process and get your changes merged!

Tired of running all these commands? Use `pnpm run ci` to run the tests, lint, build, and export checks all at once!

**More details for the curious:**

- This package relies heavily on tests. For any developer out there that hasn't contributed to projects using tests, don't fret! This package prioritizes developer experience, so tests are fast and easy to get up and running. If you have questions, don't hesitate to reach out! Code coverage is used as the metric in this project to ensure tests are being written.
- If you don't have auto-format on save setup in your editor, linting will fail. I would highly suggest enabling this feature in your editor. If you don't want to do this, run `pnpm prettier --write .` before a commit to ensure any CI workflows pass.
- This project relies on the `@changesets/cli` to version and publish the package. If you are making a change that is not CI/Document related, add a changeset for each change you make to help document the new features/bug fixes/breaking changes that are being made.

If you've never contributed to open source before and have some questions, reach out via an issue and I'd be happy to guide you to some resources or answer your questions!

## 💡 Inspiration

This library was inspired by [Super Expressive](https://github.com/francisrstokes/super-expressive) and [magic-regexp](https://github.com/danielroe/magic-regexp).

[npm-version-src]: https://img.shields.io/npm/v/reggex
[npm-version-href]: https://npmjs.com/package/reggex
[npm-downloads-src]: https://img.shields.io/npm/dm/reggex
[npm-downloads-href]: https://npmjs.com/package/reggex
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/pcbowers/reggex/ci.yml?branch=main
[github-actions-href]: https://github.com/pcbowers/reggex/actions
[codecov-src]: https://img.shields.io/codecov/c/github/pcbowers/reggex?token=JG2DBS606N
[codecov-href]: https://codecov.io/gh/pcbowers/reggex
[bundlephobia-src]: https://img.shields.io/bundlephobia/minzip/reggex
[bundlephobia-href]: https://bundlephobia.com/package/reggex
