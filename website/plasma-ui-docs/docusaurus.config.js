// eslint-disable-next-line @typescript-eslint/no-var-requires
const lightCodeTheme = require('prism-react-renderer/themes/github');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const versionsArchived = require('./versionsArchived.json');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'Workflow Laboratory',
    tagline: 'Workflow Laboratory',
    baseUrl: '/',
    url: 'https://github.com/fanisco/workflow-laboratory/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    organizationName: 'Open Source',
    projectName: 'Workflow Laboratory',
    themes: ['@docusaurus/theme-live-codeblock'],
    themeConfig: {
        navbar: {
            title: 'Workflow Laboratory',
            items: [
                {
                    type: 'doc',
                    position: 'left',
                    docId: 'intro',
                    label: 'Docs',
                },
                {
                    type: 'docsVersionDropdown',
                    position: 'right',
                    dropdownActiveClassDisabled: false,
                    dropdownItemsAfter: [
                        ...Object.entries(versionsArchived).map(([versionName, versionUrl]) => ({
                            label: versionName,
                            href: versionUrl,
                        })),
                    ],
                },
                {
                    href: 'https://github.com/fanisco/workflow-laboratory',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        prism: {
            theme: lightCodeTheme,
            darkTheme: darkCodeTheme,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    routeBasePath: '/',
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/fanisco/workflow-laboratory/blob/master/website/plasma-ui-docs/',
                    versions: {
                        current: {
                            label: '0.0.0',
                            path: '',
                        },
                    },
                },
            },
        ],
    ]
};
