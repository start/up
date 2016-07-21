import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'


context('A code block preserves all indentation when it is', () => {
  specify('a top-level convention', () => {
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


  context('within a spoiler block', () => {
    specify('using 2 spaces for indentation', () => {
      const text = `
SPOILER:
  \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new SpoilerBlockNode([
            new CodeBlockNode(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })
  })
})