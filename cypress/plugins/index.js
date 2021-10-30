/// <reference types="cypress" />

const path = require('path');
const fs = require('fs');

////////////////////////////////////////////////////////////////////////////////

/**
 * readFile
 * @param {string} name
 * @returns {string}
 */
function readFile(name) {
	return fs.readFileSync(
		path.join(__dirname, `../../tests/e2e/tabbable/fixtures/${name}.html`),
		'utf8',
	);
}

////////////////////////////////////////////////////////////////////////////////

/**
 * @type {Cypress.PluginConfig}
 */
// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
	on('task', {
		getTabbableFixtures() {
			return {
				basic: readFile('basic'),
				'changing-content': readFile('changing-content'),
				jqueryui: readFile('jqueryui'),
				nested: readFile('nested'),
				'non-linear': readFile('non-linear'),
				svg: readFile('svg'),
				radio: readFile('radio'),
				details: readFile('details'),
				'shadow-dom': readFile('shadow-dom'),
				displayed: readFile('displayed'),
				fieldset: readFile('fieldset'),
			};
		},
	});

	return config;
};
