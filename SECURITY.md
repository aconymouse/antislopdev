# Security

antiSlopdev reads your source files, and its security rules tell people what is safe. A hole in either is worth reporting privately first.

## Reporting

Use [private vulnerability reporting](https://github.com/aconymouse/antislopdev/security/advisories/new) on this repository, or email hi@aconymous.com. Please do not open a public issue or discussion.

Say what you found, how to reproduce it and which version or commit you tested. You will hear back within three working days, and you will be credited in the release notes unless you would rather not be.

## In scope

- The CLI or the engine reading, writing or sending anything outside the paths it was given. The only network access is `--links`, which requests the URLs found in your files.
- A crafted file that makes the checker hang, crash or run code.
- The published npm package or the release workflow being tampered with.
- A security rule (`SEC-*`) that teaches something unsafe, or whose wording would lead someone to ship a vulnerability.

A security rule that misses a pattern is a normal [false positive or bug report](https://github.com/aconymouse/antislopdev/issues/new/choose), not a vulnerability.

## Supported versions

Only the latest release on npm gets fixes. Version 0.1.0 was published by hand; every release after it is published from GitHub Actions with npm provenance, so you can check that it was built from this repository.
