# aurelia-dialog

[![npm Version](https://img.shields.io/npm/v/aurelia-dialog.svg)](https://www.npmjs.com/package/aurelia-dialog)
[![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![CircleCI](https://circleci.com/gh/aurelia/dialog.svg?style=shield)](https://circleci.com/gh/aurelia/dialog)

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains a dialog plugin.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions, please [join our community on Gitter](https://gitter.im/aurelia/discuss) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io/hub.html). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome or Firefox Extension and visit any of our repository's boards.

## Platform Support

This library can be used in the **browser**.

## Documentation

Check out the [docs](http://aurelia.io/hub.html#/doc/article/aurelia/dialog/latest/dialog-basics) on the Aurelia Hub.

## Reporting Issues

Please refer to the [issue template](ISSUE_TEMPLATE.md).

## Building

```shell
npm run build
```

## Tests

```shell
npm run test
```

## Developing

```shell
npm run test-watch
```

## Publishing

1. Bump the version
  
  ```shell
  npm run bump-version [<newversion> | major | minor | patch]
  ```

2. Prepare the release (run tests, run build, docs, release notes)
  
  ```shell
  npm run cut-release
  ```

3. Commit, tag, npm publish (not automated)
