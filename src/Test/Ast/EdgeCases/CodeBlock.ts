
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
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode(' ```'),
      ]))
  })
})
