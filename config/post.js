module.exports = async ctx => {
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
