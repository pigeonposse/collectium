
import type { Zod } from './types'

export type ConfigType = Zod.infer<ReturnType<typeof configSchema>>

export const configTags = ( customType?: string[] ) => ( [
	// general
	'software',
	'toolkit',
	'database',
	'security',
	// libraries
	'library',
	'js-library',
	'ts-library',
	'rust-library',
	'python-library',
	'cli',
	'bin',
	// web
	'api',
	'api-rest',
	'web',
	'pwa',
	// game
	'browser-game',
	// plugin
	'plugin',
	'wp-plugin',
	'mautic-plugin',
	// theme
	'theme',
	'wp-theme',
	'mautic-theme',
	// browser
	'browser-extension',
	'chrome-extension',
	'chromium-extension',
	'firefox-extension',
	'safari-extension',
	'edge-extension',
	'brave-extension',
	'opera-extension',
	'operagx-extension',
	'yandex-extension',
	// desktop
	'desktop-app',
	'macos-app',
	'linux-app',
	'windows-app',
	// mobile
	'mobile-app',
	'ios-app',
	'android-app',
	// ai
	'ai',
	'llm',
	'bot',
	'chat-bot',
	// dev-tools
	'dev-tool',
	'ci-cd',
	'container',
	'docker',
	'kubernetes',
	// testing
	'testing',
	// design
	'ui-kit',
	'ux-design',
	'web-design',
	'graphic-design',
	...( customType ? customType : [] ),
] as const )
export const configSchema = ( z: Zod, customType?: string[] ) => z.object( { web : z.record(
	z.string().describe( 'Project ID' ),
	z.object( {
		name   : z.string().optional().describe( 'Project name' ),
		type   : z.array( z.enum( configTags( customType ) ) ).default( [ 'library' ] ).describe( 'Type of project' ),
		status : z.enum( [
			'idea',
			'development',
			'coming-soon',
			'alpha',
			'beta',
			'active',
			'archived',
			'abandoned',
		] ).default( 'active' ).describe( 'Current project status' ),
		version   : z.string().optional().describe( 'Project version' ),
		desc      : z.string().optional().describe( 'Project description' ),
		homepage  : z.string().url().optional().describe( 'Homepage URL' ),
		docs      : z.string().url().optional().describe( 'Documentation URL' ),
		changelog : z.string().url().optional().describe( 'Changelog URL' ),
		container : z.string().url().optional().describe( 'General Container URL (dockerhub, github packages...) (if it exists)' ),
		library   : z.string().url().optional().describe( 'General Library URL of the project (if it exists)' ),
		services  : z.object( {
			npm       : z.string().url().optional().describe( 'NPM URL of the project (if it exists)' ),
			jsr       : z.string().url().optional().describe( 'JSR URL of the project (if it exists)' ),
			dockerhub : z.string().url().optional().describe( 'DockerHub URL of the project (if it exists)' ),
		} ).optional().describe( 'Optional URL of specific services' ),
		license : z.object( {
			name : z.string().optional().describe( 'License name' ),
			url  : z.string().url().optional().describe( 'License URL' ),
		} ).optional(),
		logo   : z.string().url().optional().describe( 'Logo URL' ),
		banner : z.string().url().optional().describe( 'Banner URL' ),
	} ).strict()
		.describe( 'Object with data for a specific project' ),
).describe( 'Object to add projects designed to be displayed on the web' ) } ).optional()
