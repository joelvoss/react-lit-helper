import { defineConfig } from 'cypress';
import { join, dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	viewportHeight: 600,
	viewportWidth: 800,
	screenshotOnRunFailure: false,
	video: false,
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
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
		},
		specPattern: 'tests/e2e/**/*.e2e.js',
		supportFile: false,
	},
});

////////////////////////////////////////////////////////////////////////////////

/**
 * readFile
 * @param {string} name
 * @returns {string}
 */
function readFile(name) {
	return fs.readFileSync(
		join(__dirname, `tests/e2e/tabbable/fixtures/${name}.html`),
		'utf8',
	);
}
