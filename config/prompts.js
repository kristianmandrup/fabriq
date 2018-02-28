module.exports = {
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
