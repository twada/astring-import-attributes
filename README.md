astring-import-attributes: import attributes support for astring
================================

Make [astring](https://github.com/davidbonnet/astring) generate JavaScript code with [Import Attributes](https://github.com/tc39/proposal-import-attributes) from [ESTree-compliant](https://github.com/estree/estree/blob/master/stage3/import-attributes.md) AST.

[![License][license-image]][license-url]


INSTALL
---------------------------------------

```
$ npm install astring-import-attributes
```


USAGE
---------------------------------------

```javascript
import * as astring from 'astring';
import { astringImportAttributes } from 'astring-import-attributes';

const customGenerator = astringImportAttributes(astring.GENERATOR);
const generatedCode = astring.generate(ast, {
  generator: customGenerator
});
```


AUTHOR
---------------------------------------
* [Takuto Wada](https://github.com/twada)


LICENSE
---------------------------------------
Licensed under the [MIT](https://twada.mit-license.org/) license.

[license-url]: https://twada.mit-license.org/
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg
