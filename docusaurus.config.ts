import { themes as prismThemes } from "prism-react-renderer"
import type { Config } from "@docusaurus/types"
import type * as Preset from "@docusaurus/preset-classic"

const config: Config = {
	title: "Solandra",
	tagline: "Modern TypeScript-first Creative Coding",
	favicon: "img/favicon.ico",

	// Set the production url of your site here
	url: "https://your-docusaurus-site.example.com",
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: "/",

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	// organizationName: "facebook", // Usually your GitHub org/user name.
	// projectName: "docusaurus", // Usually your repo name.

	// onBrokenLinks: "throw",
	// onBrokenMarkdownLinks: "warn",

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},
	presets: [
		[
			"classic",
			{
				docs: {
					sidebarPath: "./sidebars.ts",
					editUrl: "https://github.com/jamesporter/solandra",
				},
				blog: {
					showReadingTime: true,
				},
				theme: {
					customCss: "./src/css/custom.css",
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		// Replace with your project's social card
		image: "img/docusaurus-social-card.jpg",
		navbar: {
			title: "Solandra",
			logo: {
				alt: "Solandra Logo",
				src: "img/logo.svg",
			},
			items: [
				{
					type: "docSidebar",
					sidebarId: "tutorialSidebar",
					position: "left",
					label: "Docs",
				},
				{
					type: "docSidebar",
					sidebarId: "examples",
					position: "left",
					label: "Examples",
				},
				{ to: "/blog", label: "Blog", position: "left" },
				{
					href: "https://github.com/jamesporter/solandra",
					label: "GitHub",
					position: "right",
				},
			],
		},
		footer: {
			style: "dark",
			links: [
				{
					title: "Docs",
					items: [
						{
							label: "Tutorial",
							to: "/docs/intro",
						},
					],
				},
				{
					title: "More",
					items: [
						{
							label: "Blog",
							to: "/blog",
						},
						{
							label: "GitHub",
							href: "https://github.com/jamesporter/solandra",
						},
					],
				},
				{
					title: "Other Versions",
					items: [
						{
							label: "SVG",
							href: "https://github.com/jamesporter/solandra-svg",
						},
						{
							label: "Swift",
							href: "https://github.com/jamesporter/Solandra-Swift",
						},
						{
							label: "Flutter",
							href: "https://github.com/jamesporter/solandra-flutter",
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} James Porter`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
}

export default config
