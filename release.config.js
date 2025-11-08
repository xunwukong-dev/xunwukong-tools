/**
 * Semantic Release configuration for monorepo
 * Uses PACKAGE_NAME environment variable to determine which package to release
 *
 * Usage:
 *   PACKAGE_NAME=withdraw pnpm release
 */
const packageName = process.env.PACKAGE_NAME;

if (!packageName) {
  throw new Error(
    'PACKAGE_NAME environment variable is required. Example: PACKAGE_NAME=withdraw pnpm release',
  );
}

const packagePath = `packages/${packageName}`;

module.exports = {
  branches: [
    'main',
    {
      name: 'beta',
      prerelease: true,
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: `${packagePath}/CHANGELOG.md`,
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: `pnpm --filter ${packageName} build`,
      },
    ],
    [
      '@semantic-release/npm',
      {
        access: 'public',
        pkgRoot: packagePath,
        tarballDir: 'dist',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [`${packagePath}/CHANGELOG.md`, `${packagePath}/package.json`],
        message: 'chore(release): ${nextRelease.version} [skip ci]\\n\\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: `${packagePath}/dist/**/*`,
            label: 'Distribution files',
          },
        ],
      },
    ],
  ],
};
