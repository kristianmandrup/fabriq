const path = require('path');
const test = require('ava');
const sao = require('sao');
const spdxLicenseList = require('spdx-license-list/simple');

const template = path.join(__dirname, '..');

const defaults = {
  name: 'fabriq',
  description: 'my project description',
  license: 'MIT',
  version: '0.0.1',
  author: 'Nick Baugh',
  email: 'niftylettuce@gmail.com',
  website: 'http://niftylettuce.com',
  username: 'niftylettuce',
  keywords: 'boilerplate,generator npm package fabriq'
};

test('auto detects email address from github', async t => {
  const stream = await sao.mockPrompt(template, {
    name: 'fabriq',
    description: 'test',
    license: 'MIT',
    version: '0.0.1',
    author: 'TJ',
    email: 'tj@apex.sh',
    website: 'https://apex.sh'
  });
  t.is(stream.meta.answers.username, 'tj');
});

test('allows SPDX licenses', async t => {
  const getRandomLicense = () => {
    return Array.from(spdxLicenseList)[
      Math.floor(Math.random() * Array.from(spdxLicenseList).length)
    ];
  };
  const license = getRandomLicense();
  const stream = await sao.mockPrompt(template, {
    name: 'fabriq',
    description: 'test',
    license,
    version: '0.0.1',
    author: 'TJ',
    email: 'tj@apex.sh',
    website: 'https://apex.sh'
  });
  t.is(stream.meta.answers.license, license);
});

//
// test.todo('logs error on non-SPDX license');

//
// test.todo('logs error if soa fails to write license');

test('defaults', async t => {
  const stream = await sao.mockPrompt(
    template,
    Object.assign({}, defaults, {
      name: 'my-package-name'
    })
  );

  const ignoredFiles = ['yarn-error.log'];
  t.snapshot(
    stream.fileList.filter(path => !ignoredFiles.includes(path)),
    'generated files'
  );

  const content = stream.fileContents('README.md');
  t.snapshot(content, 'content of README.md');
});

test('username retains capital letters', async t => {
  const stream = await sao.mockPrompt(
    template,
    Object.assign({}, defaults, {
      name: 'my-package-name',
      username: 'fooBar'
    })
  );
  t.is(stream.meta.answers.username, 'fooBar');
  t.regex(stream.meta.answers.repo, /fooBar/);
});

test('invalid name', async t => {
  const error = await t.throws(
    sao.mockPrompt(
      template,
      Object.assign({}, defaults, {
        name: 'Foo Bar Baz Beep'
      })
    )
  );
  t.regex(error.message, /package name cannot have uppercase letters/);
});

test('allows scope', async t => {
  await t.notThrows(
    sao.mockPrompt(
      template,
      Object.assign({}, defaults, {
        name: '@foo/bar'
      })
    )
  );
});

test('invalid version', async t => {
  const error = await t.throws(
    sao.mockPrompt(
      template,
      Object.assign({}, defaults, {
        version: 'abcdef'
      })
    )
  );
  t.regex(error.message, /Invalid semver version/);
});

test('invalid email', async t => {
  const error = await t.throws(
    sao.mockPrompt(
      template,
      Object.assign({}, defaults, {
        email: 'niftylettuce'
      })
    )
  );
  t.regex(error.message, /Invalid email/);
});

test('invalid website', async t => {
  const error = await t.throws(
    sao.mockPrompt(
      template,
      Object.assign({}, defaults, {
        website: 'niftylettuce'
      })
    )
  );
  t.regex(error.message, /Invalid URL/);
});

test('invalid username', async t => {
  const error = await t.throws(
    sao.mockPrompt(
      template,
      Object.assign({}, defaults, {
        username: '$$$'
      })
    )
  );
  t.regex(error.message, /Invalid GitHub username/);
});

test('invalid repo', async t => {
  const error = await t.throws(
    sao.mockPrompt(
      template,
      Object.assign({}, defaults, {
        username: 'fabriq',
        repo: 'https://bitbucket.org/foo/bar'
      })
    )
  );
  t.regex(
    error.message,
    /Please include a valid GitHub.com URL without a trailing slash/
  );
});
