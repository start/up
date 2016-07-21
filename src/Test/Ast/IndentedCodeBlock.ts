import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'


describe('A code block', () => {
  it('preserves all indentation', () => {
    const text = `
\`\`\`
  if (x < 0) {
\t\treturn false
  }
\`\`\``

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode(
          `  if (x < 0) {
\t\treturn false
  }`),
      ]))
  })
})