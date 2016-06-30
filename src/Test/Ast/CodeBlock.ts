import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('Text surrounded by (underlined and overlined) streaks of backticks', () => {
  it('produces a code block node containing the surrounded text', () => {
    const text = `
\`\`\`
const pie = 3.5
\`\`\``

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode('const pie = 3.5'),
      ]))
  })
})


describe('A code block', () => {
  it('can contain multiple lines', () => {
    const text = `
\`\`\`
// Escaping backticks in typescript...
// Such a pain!
\`\`\``

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode(
`// Escaping backticks in typescript...
// Such a pain!`),
      ]))
  })

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

  it('preserves all backslashes', () => {
    const text = `
\`\`\`
const lineBreak = "\\n"
\`\`\``

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode('const lineBreak = "\\n"'),
      ]))
  })
})
