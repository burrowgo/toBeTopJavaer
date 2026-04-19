import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://hollischuang.github.io',
	base: '/toBeTopJavaer',
	integrations: [
		starlight({
			title: 'Java Engineer\'s Road to Mastery',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/hollischuang/toBeTopJavaer' }
			],
			sidebar: [
				{
					label: 'Introduction',
					link: '/',
				},
				{
					label: 'Roadmaps (Mind Maps)',
					autogenerate: { directory: 'mind-maps' },
				},
				{
					label: 'Basics',
					items: [
						{ label: 'Java Basic', autogenerate: { directory: 'basics/java-basic' }, collapsed: true },
						{ label: 'Object-Oriented', autogenerate: { directory: 'basics/object-oriented' }, collapsed: true },
						{ label: 'Concurrent Coding', autogenerate: { directory: 'basics/concurrent-coding' }, collapsed: true },
						{ label: 'Network Programming', autogenerate: { directory: 'basics/network-programming' }, collapsed: true },
					],
				},
				{
					label: 'Basement (JVM)',
					items: [
						{ label: 'JVM Internals', autogenerate: { directory: 'basement/jvm' }, collapsed: true },
					],
				},
				{
					label: 'Advanced',
					items: [
						{ label: 'Design Patterns', autogenerate: { directory: 'advance/design-patterns' }, collapsed: true },
						{ label: 'Frameworks', autogenerate: { directory: 'advance/frameworks' }, collapsed: true },
						{ label: 'New Technologies', autogenerate: { directory: 'advance/new-technologies' }, collapsed: true },
					],
				},
				{
					label: 'Operating System',
					autogenerate: { directory: 'os' },
				},
			],
		}),
	],
});
