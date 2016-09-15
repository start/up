import { expect } from 'chai'
import Up = require('../../../index')
import { Document } from '../../../SyntaxNodes/Document'
import { CodeBlock } from '../../../SyntaxNodes/CodeBlock'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'
import { InlineQuote } from '../../../SyntaxNodes/InlineQuote'
import { PlainText } from '../../../SyntaxNodes/PlainText'


describe('A code block', () => {
  it('can directly follow a paragraph', () => {
    const markup = `
My pies never turn out quite right.
\`\`\`
const pie = 3.5
\`\`\``

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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
    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new CodeBlock(''),
      ]))
  })

  specify('when it lacks a closing streak', () => {
    expect(Up.parse('```')).to.deep.equal(
      new Document([
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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


context("For a streak of backticks to serve as a code block's fence, it must be alone on its line (ignoring any outer whitespace). This is true for:", () => {
  specify('A potential opening fence', () => {
    const markup = `
"\`\`\`"

That's what the robot wrote!`
    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Paragraph([
          new InlineQuote([new PlainText('```')])
        ]),
        new Paragraph([
          new PlainText("That's what the robot wrote!")
        ])
      ]))
  })

  specify('A potential closing fence', () => {
    const markup = `
\`\`\`
"\`\`\`"`
    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new CodeBlock('"```"'),
      ]))
  })
})
