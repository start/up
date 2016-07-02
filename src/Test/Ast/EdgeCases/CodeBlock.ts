import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { CodeBlockNode } from '../../../SyntaxNodes/CodeBlockNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('Within a code block, a streak of backticks matching the start streak but preceded by a space', () => {
  it('is preserved as code (and does not end the code block)', () => {
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


describe('A code block with containing zero lines of code', () => {
  it('produces an empty code block', () => {
    const text = `
\`\`\`
\`\`\``
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode(''),
      ]))
  })
})


describe('A code block', () => {
  it('can directly follow a paragraph', () => {
    const text = `
My pies never turn out quite right.
\`\`\`
const pie = 3.5
\`\`\``

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('My pies never turn out quite right.')
        ]),
        new CodeBlockNode('const pie = 3.5')
      ]))
  })

  it('can be directly followed by a paragraph', () => {
    const text = `
\`\`\`
const pie = 3.5
\`\`\`
My pies never turn out quite right.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode('const pie = 3.5'),
        new ParagraphNode([
          new PlainTextNode('My pies never turn out quite right.')
        ])
      ]))
  })
})


describe('An unmatched streak of backticks, following a normal "enclosed" code block whose streaks are the same length as the unmatched streak,', () => {
  it("produces a code block node containing the rest of the document", () => {
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