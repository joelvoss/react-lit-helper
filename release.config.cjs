module.exports = {
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		['@semantic-release/npm', { npmPublish: false }],
		'@semantic-release/changelog',
		[
			'@semantic-release/git',
			{ message: 'chore(release): ${nextRelease.version}' },
		],
	],
	presetConfig: {
		types: [
			{ type: 'feat', section: 'Features' },
			{ type: 'feature', section: 'Features' },
			{ type: 'fix', section: 'Bug Fixes' },
			{ type: 'perf', section: 'Performance Improvements' },
			{ type: 'revert', section: 'Reverts' },
			{ type: 'docs', section: 'Documentation', hidden: true },
			{ type: 'style', section: 'Styles', hidden: true },
			{ type: 'chore', section: 'Miscellaneous Changes', hidden: true },
			{ type: 'refactor', section: 'Code Refactoring', hidden: true },
			{ type: 'test', section: 'Tests', hidden: true },
			{ type: 'build', section: 'Build System', hidden: true },
			{ type: 'ci', section: 'Continuous Integration', hidden: true },
		],
	},
	releaseRules: [
		{ breaking: true, release: 'major' },
		{ revert: true, release: 'patch' },
		{ type: 'feat', release: 'minor' },
		{ type: 'fix', release: 'patch' },
		{ type: 'perf', release: 'patch' },
		{ type: 'chore', release: 'patch' },
	],
	branches: ['master', 'main'],
};
