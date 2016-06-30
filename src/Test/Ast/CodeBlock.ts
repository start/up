import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


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


describe('An unmatched streak of backticks', () => {
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

document.write('The factorial of 5 is: ' + factorial(5))`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, fence!')
        ]),
        new CodeBlockNode(
`function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}

document.write('The factorial of 5 is: ' + factorial(5))`)
      ]))
  })
})
