import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { CodeBlockNode } from '../../../SyntaxNodes/CodeBlockNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('A code block', () => {
  it('can contain a streak of backticks if the streak is preceeded by some whitespace', () => {
    const text = `
\`\`\`
 \`\`\`
\`\`\``
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode(' ```'),
      ]))
  })
})


describe('An unmatched streak of backticks following a normal "enclosed" code block', () => {
  it("produces a code block node whose contents are the rest of the document", () => {
    const text = `
Check out the code below!

\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}
\`\`\`

\`\`\`
document.write('The factorial of 5 is: ' + factorial(5))`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Check out the code below!')
        ]),
        new CodeBlockNode(
`function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}`),
        new CodeBlockNode("document.write('The factorial of 5 is: ' + factorial(5))")
      ]))
  })
})



describe('Two consecutive streaks of backticks', () => {
  it('produce an empty code block', () => {
    const text = `
\`\`\`
\`\`\``
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode(''),
      ]))
  })
})
