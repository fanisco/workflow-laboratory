import { compose } from './utils';

const ccRegExp = /(\w+)(\(.*\))?:/;

const parseCommit = (commit: string) => {
    const match = commit.match(ccRegExp);

    if (match) {
        const [, type, packageNames] = match;
        const result = [type];

        if (packageNames) {
            result.push(...packageNames.replace(/\(|\)|\s/g, '').split(','));
        }
        return result;
    }

    return null;
};

/**
 * @example ['docs(package): Message', 'chore: Message'] => [['docs', ['package']], ['chore']]
 */
export const getCommitInfo = (commits: string[]) => commits.map(parseCommit).filter((info) => info);

/**
 * @example [['docs', 'package'], ['chore']] => [['docs', 'package']]
 */
export const filterInfo = (info: (string | undefined)[][]) => info.filter((inf) => inf[0] === 'docs' && inf.length > 1);

/**
 * @example [['docs', 'package1'], ['docs', 'package2']] => ['package1', 'package2']
 */
export const removeTypes = (list: string[][]) => list.reduce((acc, [, ...names]) => [...acc, ...names], []);

/**
 * @example ['package1', 'package1', 'package2'] => ['package1', 'package2']
 */
export const removeCopies = (names: string[]) => Object.keys(names.reduce((acc, name) => ({ ...acc, [name]: 1 }), {}));

/**
 * Из лога коммитов вытащит названия пакетов, для которых нужно выпустить версии документации.
 */
export const getDocPackages = compose<string[]>(removeCopies, removeTypes, filterInfo, getCommitInfo);
