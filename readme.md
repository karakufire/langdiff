# Lang diff tool

## options
    -h, --help : show help on console

    -o, --output, --out-path : set result output file path

## how to use

* show help
    * `node ./langdiff -h`

* show differences on console
    * `node ./langdiff foo.lang bar.lang`

* outputs differences into file
    * `node ./langdiff foo.lang bar.lang -o result.txt`

## output format
Output format is TSV(tab separated values).

headers:
* keys
* [FILE A NAME] value
* [FILE A NAME] line
* [FILE B NAME] value
* [FILE B NAME] line
