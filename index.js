"use strict";

const fs = require('fs');

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

