const pattern = /^(?<!#)(.*?)(?==)(.*)$/g;
const nl = /\r?\n|\r/g;

export class Entry {
    readonly iscomment: boolean;
    readonly contents: { name: '#' | string, value: string };
    readonly lineof: number;

    constructor(input: { name: string, value: string }, lineof: number) {
        this.contents = input;
        this.iscomment = (this.contents.name === '#');
        this.lineof = lineof + 1;
    }

    isKey(name: string) {
        return this.contents.name === name;
    }

    toString() {
        return `${this.lineof}: ${this.contents.name}=${this.contents.value}`;
    }
}

function parse1LineProp(line: string, lineof: number) {
    const dIdx = line.indexOf('=');
    if (line.startsWith('#')) {
        const comment = line.replace(/^# */, '');
        return new Entry({ name: '#', value: comment }, lineof);
    } else if (0 < dIdx) {
        const name = line.substring(0, dIdx);
        const value = line.substring(dIdx + 1);
        return new Entry({ name: name, value: value }, lineof);
    } else return null;
}

export function parseProperties(properties: string) {
    return properties.split(nl).map(parse1LineProp);
}
