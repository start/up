import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('Text surrounded (underlined and overlined) by matching streaks of backticks (of at least 3 characters long)', () => {
  it('produces a code block node', () => {
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

  context('can contain streaks of backticks', () => {
    specify("shorter than the code block's streaks", () => {
      const text = `
\`\`\`\`\`
\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}
\`\`\`
\`\`\`\`\``
      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new CodeBlockNode(
            `\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}
\`\`\``)
        ]))
    })

    specify("longer than the code block's streaks", () => {
      const text = `
\`\`\`\`\`
\`\`\`\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}
\`\`\`\`\`\`
\`\`\`\`\``
      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new CodeBlockNode(
            `\`\`\`\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}
\`\`\`\`\`\``)
        ]))
    })

    specify("that are unmatched", () => {
      const text = `
\`\`\`
\`\`\`\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}
\`\`\``
      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new CodeBlockNode(
            `\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}`)
        ]))
    })
  })
})


describe('An unmatched streak of backticks', () => {
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
}

document.write('The factorial of 5 is: ' + factorial(5))`)
      ]))
  })
})
