/**
 * Playwright config.
 * @description Playwright config.
 * @see https://playwright.dev/docs/api/class-testconfig
 */
import { defineConfig } from '@playwright/test'

import { port } from './vite.config.js'

export default defineConfig( {
	webServer : {
		command : 'vite dev',
		port,
	},
	testDir   : 'tests',
	testMatch : /(.+\.)?(test|spec)\.[jt]s/,
} )
