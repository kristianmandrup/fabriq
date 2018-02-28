<h1 align="center">
  Fabriq
</h1>
<div align="center">
  <a href="http://slack.crocodilejs.com"><img src="http://slack.crocodilejs.com/badge.svg" alt="chat" /></a>
  <a href="https://semaphoreci.com/niftylettuce/fabriq"> <img src="https://semaphoreci.com/api/v1/niftylettuce/fabriq/branches/master/shields_badge.svg" alt="build status"></a>
  <a href="https://codecov.io/github/fabriqjs/fabriq"><img src="https://img.shields.io/codecov/c/github/fabriqjs/fabriq/master.svg" alt="code coverage" /></a>
  <a href="https://github.com/sindresorhus/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg" alt="code style" /></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="styled with prettier" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/fabriqjs/fabriq.svg" alt="license" /></a>
</div>
<br />
<div align="center">
  Fabriq scaffolds a package boilerplate for a <a href="https://github.com/kristianmandrup/comptroller">Comptroller project</a>
</div>

## Table of Contents

* [Features](#features)
* [Prerequisities](#prerequisities)
* [Install](#install)
* [Usage](#usage)
  * [Create a package](#create-a-package)
  * [Test it](#test-it)
* [Tips](#tips)
  * [Configuration](#configuration)
* [Related](#related)
* [Contributors](#contributors)
* [Trademark Notice](#trademark-notice)
* [License](#license)


## Features

* Unit testing with [ava][] or [jest][]
* Linting with [eslint][] (with an option to choose between [prettier][] and [xo][] or [standard][])
* Markdown Linting with [remark][]
* Automatic code formatting with [prettier][]
* Automatic `git init`
* Automatic `npm install` (or `yarn install` if selected)
* Automatic builds, tests, and code coverage uploading to [Codecov][] with [Travis-CI][]
* Includes git/editor configurations:
  * [.gitignore](template/gitignore)
  * [.gitattributes](template/.gitattributes)
  * [.editorconfig](template/.editorconfig)
* Automatic markdown formatting and linting with [remark][]
  * Adheres to GitHub flavored markdown standards
  * Adds contributors section automatically with [remark-contributors][]
  * Adjusts heading gaps automatically
  * Adds a license block automatically with [remark-license][]
  * Utilizes configurable presets with [remark-preset-github][]
* Highly configurable and remembers your defaults with [sao][]
* Test coverage with [nyc][]
* Automatically generated files with tailored defaults
  * Readme with badges through [Shields.io][shields]
  * Choose from (343) different licenses with [spdx-license-list][] (defaults to your npm default or MIT)
  * Automatically inserts license year/name/email/website for MIT license if selected


## Prerequisities

Node.js v8+


## Install

Install `fabriq` as a `dev` dependency in your project

[npm][]:

```sh
npm install fabriq -D
```

[yarn][]:

```sh
yarn add fabriq -D
```

Use `npx` to run `fabriq`

`$ npx fabriq`

## Usage

### Create a package

```sh
fabriq new-package
cd new-package
```

### Test it

[npm][]:

```sh
npm test
```

[yarn][]:

```sh
yarn test
```


## Tips

### Configuration

You should configure [npm init defaults][npm-init-defaults] before using this package.

Run the following commands and replace the values below with your own:

```bash
npm config set init-author-email "my-email@gmail.com"
npm config set init-author-name "John Doe"
npm config set init-author-url "http://john-doe.com"
npm config set init-license "MIT"
npm config set init-version "0.0.1"
```

These defaults get utilized by `fabriq` when scaffolding a package and `npm init` in general.

To check your existing configuration, run `npm config list -l`.


## Related

* [lass][] - Scaffold a boilerplate for [Node.js][node]
* [lad][] - Scaffold a [Koa][] webapp and API framework for [Node.js][node]
* [lipo][] - Free image manipulation API service built on top of [Sharp][]
* [cabin][] - Logging and analytics solution for [Node.js][node], [Lad][], [Koa][], and [Express][]


## Contributors

| Name             | Website                   |
| ---------------- | ------------------------- |
| **Nick Baugh**   | <http://niftylettuce.com> |
| **Pablo Varela** | <http://pablo.life>       |


## License

[MIT](LICENSE) © [Kristian Mandrup](http://tecla5.com)

##

<a href="#"><img src="https://cdn.rawgit.com/fabriqjs/fabriq/e39cd571/media/fabriq-footer.png" alt="#" /></a>

[eslint]: https://eslint.org/

[xo]: https://github.com/sindresorhus/xo

[codecov]: https://codecov.io

[travis-ci]: https://travis-ci.org

[ava]: https://github.com/avajs/ava

[prettier]: https://prettier.io/

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[remark]: https://github.com/wooorm/remark

[remark-contributors]: https://github.com/hughsk/remark-contributors

[lass]: https://lass.js.org

[lad]: https://lad.js.org

[node]: https://nodejs.org

[koa]: http://koajs.com/

[remark-license]: https://github.com/wooorm/remark-license

[remark-preset-github]: https://github.com/niftylettuce/remark-preset-github

[sao]: https://sao.js.org/#/

[nyc]: https://github.com/istanbuljs/nyc

[shields]: https://shields.io/

[spdx-license-list]: https://github.com/sindresorhus/spdx-license-list

[npm-init-defaults]: https://docs.npmjs.com/misc/config#init-author-name

[sharp]: http://sharp.dimens.io/

[lipo]: https://lipo.io

[cabin]: http://cabinjs.com

[express]: https://expressjs.com

[standard]: https://standardjs.com/
