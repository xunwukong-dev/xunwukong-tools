/**
 * Semantic Release configuration for monorepo
 * This configuration supports multiple packages in the monorepo
 * 
 * For monorepo, we use @semantic-release/exec to handle package-specific releases
 * Each package can be released independently based on changes
 */
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
        changelogFile: 'CHANGELOG.md',
      },
    ],
    // Build all packages before release
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'pnpm build',
      },
    ],
    // Release packages individually
    // This will publish each package that has changes
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'packages/withdraw',
        tarballDir: 'dist',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'packages/withdraw/package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'packages/withdraw/dist/**/*',
            label: 'Distribution files',
          },
        ],
      },
    ],
  ],
};


