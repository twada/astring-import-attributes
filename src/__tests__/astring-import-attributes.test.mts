import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { generate, GENERATOR } from 'astring';
import { Parser } from 'acorn';
import { importAttributes as acornImportAttributes } from 'acorn-import-attributes';
import { astringImportAttributes } from '../astring-import-attributes.mjs';
import type { Node } from 'estree';

test('generate import attributes', () => {
  // arrange
  const code = `import * as content from './foo.json' with { type: 'json' };`;
  const parser = Parser.extend(acornImportAttributes);
  const ast: Node = parser.parse(code, {
    sourceType: 'module',
    ecmaVersion: 2024,
  }) as unknown as Node;

  // act
  const customGenerator = astringImportAttributes(GENERATOR);
  const generatedCode = generate(ast, {
    generator: customGenerator
  });

  // assert
  assert.equal(generatedCode, `import * as content from './foo.json' with {type: 'json'};\n`);
});
