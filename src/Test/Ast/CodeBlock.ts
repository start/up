/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


function insideDocument(syntaxNodes: SyntaxNode[]): DocumentNode {
  return new DocumentNode(syntaxNodes);
}


describe('Text surrounded (underlined and overlined) by streaks of backticks', function() {
  it('produces a code block node containing the surrounded text', function() {
    const text =
      `
\`\`\`
let x = y
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new CodeBlockNode([
          new PlainTextNode('let x = y')
        ]),
      ]))
  })
})
