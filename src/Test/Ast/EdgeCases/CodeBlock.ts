/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { CodeBlockNode } from '../../../SyntaxNodes/CodeBlockNode'


describe('A code block', () => {
  it('can contain a streak of backticks if the streak is preceeded by some whitespace', () => {
    const text =
      `
\`\`\`
 \`\`\`
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode(' ```'),
      ]))
  })
})
