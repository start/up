import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { CodeBlockNode } from '../../../SyntaxNodes/CodeBlockNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('A code block', () => {
  it('can directly follow a paragraph', () => {
    const markup = `
My pies never turn out quite right.
\`\`\`
const pie = 3.5
\`\`\``

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('My pies never turn out quite right.')
        ]),
        new CodeBlockNode('const pie = 3.5')
      ]))
  })

  it('can directly follow a line block', () => {
    const markup = `
Roses are red
Violets are white
My pies just never
Turn out quite right
\`\`\`
const pie = 3.5
\`\`\``

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Violets are white')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('My pies just never')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Turn out quite right')
          ])
        ]),
        new CodeBlockNode('const pie = 3.5')
      ]))
  })

  it('can be directly followed by a paragraph', () => {
    const markup = `
\`\`\`
const pie = 3.5
\`\`\`
My pies never turn out quite right.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new CodeBlockNode('const pie = 3.5'),
        new ParagraphNode([
          new PlainTextNode('My pies never turn out quite right.')
        ])
      ]))
  })
})


context('A code block with containing zero lines of code produces an empty code block', () => {
  specify('when it has a closing streak', () => {
    const markup = `
\`\`\`
\`\`\``
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new CodeBlockNode(''),
      ]))
  })

  specify('when it lacks a closing streak', () => {
    expect(Up.toAst('```')).to.be.eql(
      new UpDocument([
        new CodeBlockNode(''),
      ]))
  })
})


describe('An unmatched streak of backticks, following a normal "enclosed" code block whose streaks are the same length as the unmatched streak,', () => {
  it("produces a code block node containing the rest of the document", () => {
    const markup = `
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

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
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


describe('Within a code block, a streak of backticks matching the start streak but preceded by a space', () => {
  it('is preserved as code (and does not end the code block)', () => {
    const markup = `
\`\`\`
 \`\`\`
\`\`\``
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new CodeBlockNode(' ```'),
      ]))
  })
})
