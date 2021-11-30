import { getDocPackages, removeCopies, removeTypes, filterInfo, getCommitInfo } from './commits';

const commits = [
    'docs(plasma-ui, plasma-web): Message',
    'docs(plasma-ui): Message',
    'feat(plasma-ui): Message',
    'chore: Message',
    'docs: Message',
    'Bad commit',
];
const info = [['docs', 'plasma-ui', 'plasma-web'], ['docs', 'plasma-ui'], ['feat', 'plasma-ui'], ['chore'], ['docs']];
const filtered = [
    ['docs', 'plasma-ui', 'plasma-web'],
    ['docs', 'plasma-ui'],
];
const packages = ['plasma-ui', 'plasma-web', 'plasma-ui'];
const result = ['plasma-ui', 'plasma-web'];

describe('commits.ts', () => {
    it('getCommitInfo', () => {
        expect(getCommitInfo(commits)).toStrictEqual(info);
    });

    it('filterInfo', () => {
        expect(filterInfo(info)).toStrictEqual(filtered);
    });

    it('removeTypes', () => {
        expect(removeTypes(filtered)).toStrictEqual(packages);
    });

    it('removeCopies', () => {
        expect(removeCopies(packages)).toStrictEqual(result);
    });

    it('getDocPackages', () => {
        expect(getDocPackages(commits)).toStrictEqual(result);
    });
});
