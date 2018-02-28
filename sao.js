const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const projectTemplate = require('project-template')

const githubUsernameRegex = require('github-username-regex');
const opn = require('opn');
const isURL = require('is-url');
const isEmail = require('is-email');
const semver = require('semver');
const spdxLicenseList = require('spdx-license-list/full');
const superb = require('superb');
const camelcase = require('camelcase');
const uppercamelcase = require('uppercamelcase');
const slug = require('speakingurl');
const npmConf = require('npm-conf');
const npmExists = require('npm-name-exists');
const isValidNpmName = require('is-valid-npm-name');
const fetchGithubUsername = require('github-username');

const conf = npmConf();

const defaultLicense =
  conf.get('init-license') === 'ISC' ? 'MIT' : conf.get('init-license');

const config = require('./config')

const {
  prompts
} = config

module.exports = saoConfig => {
  const knownAnswers = saoConfig.knownAnswers || {}
  const promptsNotAnswered = Object.keys(prompts).reduce((acc, key) => {
    const prompt = prompts[key]
    if (!saoConfig.knownAnswers[key]) {
      acc[key] = prompt
    }
    return acc
  }, {})
  return {
    // NOTE: answers made via prompts
    // can be used to build data answers if needed
    data(answers) {
      return saoConfig.knownAnswers
    },
    prompts: promptsNotAnswered,
    enforceNewFolder: true,
    templateOptions: {
      context: {
        camelcase,
        uppercamelcase
      }
    },
    move: {
      // We keep `.gitignore` as `gitignore` in the project
      // Because when it's published to npm
      // `.gitignore` file will be ignored!
      gitignore: '.gitignore',
      README: 'README.md',
      package: 'package.json'
    },
    filters: {
      // exclude MIT license from being copied
      LICENSE: 'license === "MIT"',
      // until this issue is resolved we need this line:
      // <https://github.com/saojs/sao/issues/59>
      'node_modules/**': false
    },
    post
  }
}
