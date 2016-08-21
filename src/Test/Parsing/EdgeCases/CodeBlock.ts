import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { CodeBlock } from '../../../SyntaxNodes/CodeBlock'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'
import { PlainText } from '../../../SyntaxNodes/PlainText'


describe('A code block', () => {
  it('can directly follow a paragraph', () => {
    const markup = `
My pies never turn out quite right.
\`\`\`
const pie = 3.5
\`\`\``

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('My pies never turn out quite right.')
        ]),
        new CodeBlock('const pie = 3.5')
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Violets are white')
          ]),
          new LineBlock.Line([
            new PlainText('My pies just never')
          ]),
          new LineBlock.Line([
            new PlainText('Turn out quite right')
          ])
        ]),
        new CodeBlock('const pie = 3.5')
      ]))
  })

  it('can be directly followed by a paragraph', () => {
    const markup = `
\`\`\`
const pie = 3.5
\`\`\`
My pies never turn out quite right.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new CodeBlock('const pie = 3.5'),
        new Paragraph([
          new PlainText('My pies never turn out quite right.')
        ])
      ]))
  })
})


context('A code block with containing zero lines of code produces an empty code block', () => {
  specify('when it has a closing streak', () => {
    const markup = `
\`\`\`
\`\`\``
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new CodeBlock(''),
      ]))
  })

  specify('when it lacks a closing streak', () => {
    expect(Up.toDocument('```')).to.be.eql(
      new UpDocument([
        new CodeBlock(''),
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('Check out the code below!')
        ]),
        new CodeBlock(
          `function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}`),
        new CodeBlock("document.write('The factorial of 5 is: ' + factorial(5))")
      ]))
  })
})


describe('Within a code block, a streak of backticks matching the start streak but preceded by a space', () => {
  it('is preserved as code (and does not end the code block)', () => {
    const markup = `
\`\`\`
 \`\`\`
\`\`\``
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new CodeBlock(' ```'),
      ]))
  })
})
