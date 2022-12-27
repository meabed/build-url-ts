// https://semantic-release.gitbook.io/semantic-release/usage/configuration
const pkg = require('./package.json');
const branch = process.env.BRANCH || process.env.CI_REF_NAME || '';
const branchPrefix = branch.split('/')[0];
const slugBranch = branch.replace(/\//g, '-');
const isMaster = branch === 'master' || branch === 'main';
// semantic-release configuration
module.exports = {
  branches: [
    {
      name: 'master',
      prerelease: false
    },
    {
      name: `${branchPrefix}/**`,
      prerelease: true,
      channel: `${slugBranch}`
    }
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          {
            type: 'build',
            scope: 'deps',
            release: 'patch'
          }
        ]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            {
              type: 'feat',
              section: 'Features'
            },
            {
              type: 'fix',
              section: 'Bug Fixes'
            },
            {
              type: 'build',
              section: 'Dependencies and Other Build Updates',
              hidden: false
            }
          ]
        }
      }
    ],
    // https://github.com/semantic-release/npm
    ['@semantic-release/npm'],
    // https://github.com/semantic-release/github
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false
      }
    ],
    // https://github.com/semantic-release/git
    isMaster && [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'yarn.lock', 'npm-shrinkwrap.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        GIT_AUTHOR_NAME: pkg.author.name,
        GIT_AUTHOR_EMAIL: pkg.author.email,
        GIT_COMMITTER_NAME: pkg.author.name,
        GIT_COMMITTER_EMAIL: pkg.author.email
      }
    ]
  ].filter(Boolean)
};
