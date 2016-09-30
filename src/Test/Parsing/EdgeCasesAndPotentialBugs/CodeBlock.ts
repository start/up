import { expect } from 'chai'
import * as Up from '../../../Up'


describe('A code block', () => {
  it('can directly follow a paragraph', () => {
    const markup = `
My pies never turn out quite right.
\`\`\`
const pie = 3.5
\`\`\``

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('My pies never turn out quite right.')
        ]),
        new Up.CodeBlock('const pie = 3.5')
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
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Violets are white')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('My pies just never')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Turn out quite right')
          ])
        ]),
        new Up.CodeBlock('const pie = 3.5')
      ]))
  })

  it('can be directly followed by a paragraph', () => {
    const markup = `
\`\`\`
const pie = 3.5
\`\`\`
My pies never turn out quite right.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.CodeBlock('const pie = 3.5'),
        new Up.Paragraph([
          new Up.Text('My pies never turn out quite right.')
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
      new Up.Document([
        new Up.CodeBlock(''),
      ]))
  })

  specify('when it lacks a closing streak', () => {
    expect(Up.parse('```')).to.deep.equal(
      new Up.Document([
        new Up.CodeBlock(''),
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
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Check out the code below!')
        ]),
        new Up.CodeBlock(
          `function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}`),
        new Up.CodeBlock("document.write('The factorial of 5 is: ' + factorial(5))")
      ]))
  })
})


context("For a streak of backticks to serve as a code block's fence, it must be alone on its line (ignoring any outer whitespace). This is true for:", () => {
  specify('A potential opening fence', () => {
    const markup = `
"\`\`\`"

That's what the robot wrote!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineQuote([new Up.Text('```')])
        ]),
        new Up.Paragraph([
          new Up.Text("That's what the robot wrote!")
        ])
      ]))
  })

  specify('A potential closing fence', () => {
    const markup = `
\`\`\`
"\`\`\`"`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.CodeBlock('"```"'),
      ]))
  })
})
