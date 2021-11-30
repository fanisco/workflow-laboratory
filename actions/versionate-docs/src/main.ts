import { getInput, setOutput, setFailed } from '@actions/core';
import { context as eventContext, getOctokit } from '@actions/github';
import { lstatSync } from 'fs';

import { exec } from './exec';
import { readFile, writeFile } from './fs';
import { getDocPackages } from './commits';

const { GITHUB_EVENT_NAME = '' } = process.env;
const pullRequestEvents = ['pull_request', 'pull_request_target'];

const getPullRequestCommitList = async (token: string) => {
    const octokit = getOctokit(token);
    const { owner, repo, number } = eventContext.issue;
    const { data: commits } = await octokit.rest.pulls.listCommits({
        owner,
        repo,
        // eslint-disable-next-line @typescript-eslint/camelcase
        pull_number: number,
    });
    return commits.map(({ commit }) => commit.message);
};
const getPushCommitList = async () => {
    return eventContext.payload.commits.map((commit: { message: string }) => commit.message);
};

/**
 * Из пуллреквеста или пуша вытащит лог коммитов.
 */
const getCommitList = async (token: string) => {
    if (pullRequestEvents.includes(GITHUB_EVENT_NAME)) {
        return getPullRequestCommitList(token);
    } else {
        return getPushCommitList();
    }
};

const getChanged = async () => {
    const { stdout } = await exec('npx lerna changed --all --json --toposort');
    const changed: [{ name: string; version: string }] = JSON.parse(stdout);

    return changed
        .map(({ name, version }) => ({ name: name.replace(/.+\//, ''), version }))
        .reduce((acc, { name, version }) => ({ ...acc, [name]: version }), {}) as Record<string, string>;
};

const mergeChangedWithDocs = (packages: string[], changed: Record<string, string>) =>
    packages.reduce((acc, packageName) => {
        if (changed[packageName]) {
            return {
                ...acc,
                [packageName]: changed[packageName],
            };
        }
        return acc;
    }, {});

const packageToDocumentation: Record<string, string> = {
    'plasma-ui': 'plasma-ui-docs',
    'plasma-web': 'plasma-web-docs',
    'plasma-b2c': 'plasma-web-docs',
    'plasma-temple': 'plasma-temple-docs',
};

const mapPackagesToDocumentation = (packages: Record<string, string>): Record<string, string> =>
    Object.entries(packages).reduce(
        (acc, [packageName, version]) => ({ ...acc, [packageToDocumentation[packageName]]: version }),
        {},
    );

// const buildDocumentation = async (packageName: string) => {
//     const { stdout, stderr } = await exec(`npm run build --prefix="./website/${packageName}"`);

//     console.log(packageName, stdout, stderr);
// };

const writeVersionsJson = async (packageName: string, version: string, url: string) => {
    const path = `./website/${packageName}/versionsArchived.json`;
    let json = {};

    if (lstatSync(path).isFile()) {
        const rawData = await readFile(path);
        json = JSON.parse(rawData.toString());
    }

    writeFile(`./website/${packageName}/versionsArchived.json`, JSON.stringify({ ...json, [version]: url }));
};

/**
 * Разбор лога и пакетов, подвергшихся изменению.
 */
async function main() {
    const token = getInput('token', { required: true });
    const commits = await getCommitList(token);
    const packages = getDocPackages(commits);
    const changed = await getChanged();
    const packagesAndVersions = mergeChangedWithDocs(packages, changed);
    const docsAndVersions = mapPackagesToDocumentation(packagesAndVersions);

    console.log('--->>', commits, changed);
    console.log('--->>', packagesAndVersions);
    console.log('--->>', docsAndVersions);

    if (Object.keys(docsAndVersions).length < 1) {
        return setOutput('result', false);
    }

    await Promise.all(Object.entries(docsAndVersions).map(async ([packageName, version]) => {
        // await buildDocumentation(packageName);
        await writeVersionsJson(packageName, version, `https://plasma.sberdevices.ru/${packageName}/${version}/`);
    }));

    setOutput('result', true);
}

main().catch((err) => setFailed(err.message));
