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

module.exports = {
  enforceNewFolder: true,
  templateOptions: {
    context: {
      camelcase,
      uppercamelcase
    }
  },
  prompts: {
    name: {
      message: 'Name of the package',
      default: () => process.argv[2] || ':folderName:',
      validate: async val => {
        if (process.env.NODE_ENV === 'test' && val === 'fabriq') return true;
        if (!isValidNpmName(val)) return `The name ${val} is invalid`
        return (await npmExists(val)) ?
          `The package "${val}" already exists on npm` :
          true;
      }
    },
    description: {
      message: 'Package description',
      default: `a ${superb()} package`
    },
    pm: {
      message: 'Package manager',
      choices: ['npm5', 'yarn'],
      type: 'list',
      default: 'npm5',
      store: true
    },
    public: {
      message: 'Public',
      type: 'confirm',
      default: true
    },
    license: {
      message: 'License',
      choices: Object.keys(spdxLicenseList),
      type: 'list',
      default: defaultLicense,
      store: true
    },
    version: {
      message: 'Initial semver version',
      default: conf.get('init-version'),
      validate: val => (semver.valid(val) ? true : 'Invalid semver version')
    },
    eslint: {
      message: 'ESlint config',
      choices: ['prettier', 'standard'],
      type: 'list',
      default: 'prettier',
      store: true
    },
    testLib: {
      message: 'Test library',
      choices: ['ava', 'jest'],
      type: 'list',
      default: 'ava',
      store: true
    },
    srcExt: {
      message: 'Source file extension',
      choices: ['js', 'mjs', 'ts', 'tsx', 'jsx'],
      type: 'list',
      default: 'js',
      store: true
    },
    author: {
      message: "Author names",
      default: conf.get('init-author-name') || ':gitUser:',
      store: true
    },
    email: {
      message: "Author emails",
      default: conf.get('init-author-email') || ':gitEmail:',
      store: true,
      validate: val => (isEmail(val) ? true : 'Invalid email')
    },
    website: {
      message: "Author website",
      default: conf.get('init-author-url') || '',
      store: true,
      validate: val => (val === '' || isURL(val) ? true : 'Invalid URL')
    },
    username: {
      message: 'GitHub account',
      store: true,
      default: async answers => {
        if (answers.name.indexOf('@') === 0)
          return answers.name.split('/')[0].substring(1);
        try {
          const githubUsername = await fetchGithubUsername(answers.email);
          return githubUsername;
        } catch (err) {
          return ':gitUser:';
        }
      },
      validate: val =>
        githubUsernameRegex.test(val) ? true : 'Invalid GitHub username'
    },
    repo: {
      message: "GitHub repository URL",
      default (answers) {
        const name =
          answers.name.indexOf('@') === 0 ?
          answers.name.split('/')[1] :
          slug(answers.name);
        return `https://github.com/${slug(answers.username, {
          maintainCase: true
        })}/${name}`;
      },
      validate: val => {
        return isURL(val) &&
          val.indexOf('https://github.com/') === 0 &&
          val.lastIndexOf('/') !== val.length - 1 ?
          true :
          'Please include a valid GitHub.com URL without a trailing slash';
      }
    },
    keywords: {
      message: `Keywords (,)`,
      default (answers) {
        return `${answers.name}`;
      }
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
  post: async ctx => {
    ctx.gitInit();

    if (ctx.answers.pm === 'yarn') {
      ctx.yarnInstall();
    } else {
      ctx.npmInstall();
    }

    // copy tests folder

    try {
      const $params = {
        ava: {
          'test/sample.test.js': {},
        },
        jest: {
          '__tests__/sample.test.js': {},
          'jest.config.js': {},
        }
      }

      const params = $params[testLib]

      projectTemplate({
        templatePath: path.join(__rootdir, 'templates', '_test', testLib),
        // rename any template files that have .js extension to .ts in target dest
        buildPath(file, opts) {
          const ext = path.extname(file)
          const destExt = ext === 'js' ? 'ts' : ext
          return path.join(opts.rootBuildPath, path.basename(file), destExt)
        },
        opts: {
          srcExt: ctx.answers.srcExt, // used by resolveTemplateFile
          rootBuildPath: ctx.folderPath, // used by buildPath
        },
        params
      })
    } catch (err) {
      console.error(err)
    }

    // create `LICENSE` file with license selected
    if (ctx.answers.license !== 'MIT') {
      try {
        fs.writeFileSync(
          path.join(ctx.folderName, 'LICENSE'),
          spdxLicenseList[ctx.answers.license].licenseText
        );
        ctx.log.warn(
          `You should update the ${ctx.chalk.yellow(
            'LICENSE'
          )} file accordingly (e.g. add your name/company/year)`
        );
      } catch (err) {
        ctx.log.error(err);
      }
    }

    try {
      const gh = ctx.answers.repo.replace('https://github.com/', '');
      const domainType = ctx.answers.public ? 'org' : 'com'
      await Promise.all(
        [
          ctx.answers.repo,
          `https://travis-ci.${domainType}/${gh}`,
          `https://codecov.io/gh/${gh}`
        ].map(link => opn(link, {
          wait: false
        }))
      );
      ctx.log.success(
        'Opened browser to GitHub, Travis-CI, and Codecov for configuration!'
      );
    } catch (err) {
      ctx.log.error(err.message);
    }

    // Format code according to eslint configuration
    const linter = ctx.answers.eslint === 'standard' ? 'standard' : 'xo';
    await execa(`./node_modules/.bin/${linter}`, ['--fix'], {
      cwd: ctx.folderPath,
      stdio: 'inherit'
    });

    ctx.showTip();
  }
};
