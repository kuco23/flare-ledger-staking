# Flare Ledger Staking

## Installation and version management

Some info on upgrading this tool to a new version.

1. Build the project with `yarn build`
2. Check that lib can be created `npm pack`
3. Bump to next version `npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]`
4. Publish with `npm publish --access=public`
5. Make sure to push to git with `git push`

To publish locally use `npm install -g .`.