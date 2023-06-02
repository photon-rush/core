![Photon-Rush Interactive Logo](packages/web.resources/content/logo.svg)

This repository is the single repository for all Photon-Rush interactive JavaScript / TypeScript projects.

After cloning or pulling run `npm install` to make sure that all dependencies are up to date.


## Command Line Interface

The CLI is run with `npx run <command>` or `npx cli <command>`.

A full list of commands can be given by running `npx run help`.

## Code Style

ESLint / TSLint is used to check source code for style issues. But in a larger sense the style of the repository is to favor small, pure-ish, composable functions that deal with plain objects.


## Imports, Build Pipeline

All files are imported with absolute paths that start like this: `@photon-rush/${packageName}` This makes it easier to predictably move and consume modules across the web, electron and node targets. Relative paths are not allowed, neither are fully qualified URLs.


## Package Structure

- V: Versioned (Y-Yes, N-No)
- R: Required (Y-Yes, N-No)

| Path          | Type      | V | R | Description
|---------------|-----------|---|---|---------------------------------------------------------------
| readme.md     | File      | Y | N | Prose information about the package
| index.ts      | File      | Y | Y | The entry point for the application
| template.html | File      | Y | N | The default html template file used when bundling a web package. Multiple templates are possible, but these should go in the source, lib or content directory.
| package.json  | File      | Y | Y | Metadata about the package
| source        | Directory | Y | * | Source code for the package. All packages must have at least one of lib, source or content directory.
| lib           | Directory | Y | * | Source code for the package. All packages must have at least one of lib, source or content directory.
| content       | Directory | Y | * | Static content that will be deployed with the application. All packages must have at least one of lib, source or content directory.
| tests         | Directory | Y | N | Source code for unit and integration tests.
| documentation | Directory | Y | N | The package's documentation
| notes         | Directory | Y | N | Loose notes and todo lists etc. about the package
| -output       | Directory | N | N | output directory for build process.
| -logs         | Directory | N | N | output directory for application logs.
| -npm-logs     | Directory | N | N | output directory for node/npm logs.
| -temp         | Directory | N | N | output directory for temporary files
| -staging      | Directory | N | N | output directory for files that are ready to be packaged or deployed