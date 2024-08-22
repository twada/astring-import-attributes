import { strict as assert } from 'node:assert';
import type {
  Node,
  BaseNode,
  Literal,
  Identifier,
  ImportDeclaration
} from 'estree';
import { GENERATOR } from 'astring';
import type { State, Generator } from 'astring';

export interface ImportAttribute extends BaseNode {
  type: 'ImportAttribute';
  key: Identifier | Literal;
  value: Literal;
}

export interface ImportDeclarationWithAttributes extends ImportDeclaration {
  attributes: ImportAttribute[];
}

export function isImportDeclarationWithAttributes (node: Node): node is ImportDeclarationWithAttributes {
  return node.type === 'ImportDeclaration' && Object.hasOwn(node, 'attributes');
}

export const customGenerator = Object.assign({}, GENERATOR, {
  ImportDeclaration (this: Generator, node: ImportDeclaration, state: State) {
    state.write('import ');
    const { specifiers } = node;
    const { length } = specifiers;
    // TODO: Once babili is fixed, put this after condition
    // https://github.com/babel/babili/issues/430
    let i = 0;
    if (length > 0) {
      for (; i < length;) {
        if (i > 0) {
          state.write(', ');
        }
        const specifier = specifiers[i];
        const type = specifier.type[6];
        if (type === 'D') {
          // ImportDefaultSpecifier
          state.write(specifier.local.name, specifier);
          i++;
        } else if (type === 'N') {
          // ImportNamespaceSpecifier
          state.write('* as ' + specifier.local.name, specifier);
          i++;
        } else {
          // ImportSpecifier
          break;
        }
      }
      if (i < length) {
        state.write('{');
        for (;;) {
          const specifier = specifiers[i];
          assert(specifier.type === 'ImportSpecifier', 'Invalid ImportSpecifier');
          const { name } = specifier.imported;
          state.write(name, specifier);
          if (name !== specifier.local.name) {
            state.write(' as ' + specifier.local.name);
          }
          if (++i < length) {
            state.write(', ');
          } else {
            break;
          }
        }
        state.write('}');
      }
      state.write(' from ');
    }
    this.Literal(node.source, state);

    if (isImportDeclarationWithAttributes(node)) {
      state.write(' with {');
      const { attributes } = node;
      const { length } = attributes;
      for (let i = 0; i < length; i++) {
        if (i > 0) {
          state.write(', ');
        }
        const attribute = attributes[i];
        switch (attribute.key.type) {
          case 'Literal':
            this.Literal(attribute.key, state);
            break;
          case 'Identifier':
            this.Identifier(attribute.key, state);
            break;
          default:
            throw new Error('Invalid ImportAttribute key type');
        }
        state.write(': ');
        this.Literal(attribute.value, state);
      }
      state.write('}');
    }

    state.write(';');
  }
});
