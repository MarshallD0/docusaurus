import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Telegram Agent UI Phase 3',
  tagline: 'Telegram, web UI y asistente compartido en una sola guia',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://marshallD0.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docusaurus/',


  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'marshallD0', // GitHub user/org name.
  projectName: 'docusaurus', // Repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  markdown: {
    mermaid: true,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Phase 3 Docs',
      logo: {
        alt: 'Telegram Agent UI Phase 3',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'phase3Sidebar',
          position: 'left',
          label: 'Fase 3',
        },
        {to: '/docs/phase-3/intro', label: 'Resumen', position: 'left'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Resumen',
              to: '/docs/phase-3/intro',
            },
            {
              label: 'Arquitectura',
              to: '/docs/phase-3/architecture',
            },
            {
              label: 'Configuracion',
              to: '/docs/phase-3/setup',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Telegram Agent UI Phase 3. Creado con Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
