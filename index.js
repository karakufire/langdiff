"use strict";

const fs = require('fs');
const Prop = require('./property');
const col = require('colors/safe');

/**
 * @param {string} opt 
 * @param {string[]} args
 */
function indexOfOption(opt, args) {
    if (!args || !(args instanceof Array)) args = process.argv;
    return args.indexOf(opt);
}

/**
 * @param {string} opt 
 * @param {string[]} args
 */
function getOptionValue(opt, args) {
    if (!args || !(args instanceof Array)) args = process.argv;
    let index = indexOfOption(opt, args);

    if (index < 0 || index >= (args.length - 1)) return null;

    return args[index + 1];
}

const options = {
    get help() { return (indexOfOption('-h') != -1) || (indexOfOption('--help') != -1) || false },
    get out() { return getOptionValue('-o') || getOptionValue('--out-path') || getOptionValue('--output') || undefined }
}

if (options.help) return console.log([
    "use... >node ./langdiff foo.lang bar.lang",
    "options",
    "\t-h, --help : show help on console",
    "\t-o, --output, --out-path : set result output file path"
].join("\n"));

const fnA = process.argv[2];
const fnB = process.argv[3];
if (fnA == null || fnB == null) {
    return console.log("undefined input files"), 1;
}
let fileA;
let fileB;
try {
    fileA = fs.readFileSync(fnA, "utf-8");
    fileB = fs.readFileSync(fnB, "utf-8");
} catch (e) {
    console.error(e);
    return 1;
}

const [f1, f2] = [
    Prop.parseProperties(fileA).filter(e => e != null),
    Prop.parseProperties(fileB).filter(e => e != null)];

let res = [...new Set([...f1.map(e => e.contents.name), ...f2.map(e => e.contents.name)])]
    .filter(e => e != '#')
    .map(e => {
        let d1 = f1.find(d => d.isKey(e));
        let d2 = f2.find(d => d.isKey(e));
        return { key: e, v1: d1 ? d1.contents.value : null, l1: d1 ? d1.lineof : -1, v2: d2 ? d2.contents.value : null, l2: d2 ? d2.lineof : -1 };
    }).sort((e1, e2) => {
        const l2a = e1.l2;
        const l2b = e2.l2;
        if (l2a < 0) return 1;
        else if (l2b < 0) return -1;
        else return l2a - l2b;
    }).sort((e1, e2) => {
        const l1a = e1.l1;
        const l1b = e2.l1;
        if (l1a < 0) return 1;
        else if (l1b < 0) return -1;
        else return l1a - l1b;
    }).map(e => {
        let ret = `${e.key}\t${e.v1}\t${e.l1 > -1 ? e.l1 : null}\t${e.v2}\t${e.l2 > -1 ? e.l2 : null}`
        if (options.out == null) {
            const isDifferentLine = e.l1 < 0 || e.l2 < 0 || e.l1 != e.l2;
            const isNullValue = e.v1 == null || e.v2 == null;
            if (isDifferentLine) ret = col.yellow(ret);
            if (isNullValue) ret = col.bgRed(ret);
        }
        return ret;
    }).join('\n');

const header = [
    'entry',
    `value@${fnA.replace(/^.*(\/|\\)/, '')}`,
    `line@${fnA.replace(/^.*(\/|\\)/, '')}`,
    `value@${fnA.replace(/^.*(\/|\\)/, '')}`,
    `line@${fnA.replace(/^.*(\/|\\)/, '')}`
].join('\t');

if (options.out)
    fs.writeFileSync(options.out, header + '\n' + res);
else
    console.log(header + '\n' + res);


