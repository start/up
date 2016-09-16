import { expect } from 'chai'
import * as Up from '../../index'


describe('Text surrounded (underlined and overlined) by matching streaks of backticks (of at least 3 characters long)', () => {
  it('produces a code block node', () => {
    const markup = `
\`\`\`
const pie = 3.5
\`\`\``

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.CodeBlock('const pie = 3.5'),
      ]))
  })
})


describe('A code block', () => {
  it('can contain multiple lines', () => {
    const markup = `
\`\`\`
// Escaping backticks in typescript...
// Such a pain!
\`\`\``

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.CodeBlock(
          `// Escaping backticks in typescript...
// Such a pain!`),
      ]))
  })

  it('preserves all backslashes', () => {
    const markup = `
\`\`\`
const lineBreak = "\\n"
\`\`\``

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.CodeBlock('const lineBreak = "\\n"'),
      ]))
  })

  it('can follow another code block that uses streaks of the same length', () => {
    const markup = `
\`\`\`
// Escaping backticks in typescript...
// Such a pain!
\`\`\`
\`\`\`
// Escaping backticks in typescript...
// Wait. Have I already said this?
\`\`\``

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.CodeBlock(
          `// Escaping backticks in typescript...
// Such a pain!`),
        new Up.CodeBlock(
          `// Escaping backticks in typescript...
// Wait. Have I already said this?`),
      ]))
  })


  context('can contain streaks of backticks', () => {
    specify("shorter than the code block's streaks", () => {
      const markup = `
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

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.CodeBlock(
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
      const markup = `
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

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.CodeBlock(
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
      const markup = `
\`\`\`
\`\`\`\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}
\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.CodeBlock(
            `\`\`\`\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}`)
        ]))
    })

    specify("not touching the code block's streaks", () => {
      const markup = `
\`\`\`\`\`
Wrap code in streaks of backticks! 

\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}
\`\`\`

It's easy!
\`\`\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.CodeBlock(
            `Wrap code in streaks of backticks! 

\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}
\`\`\`

It's easy!`)
        ]))
    })
  })
})


context('Any leading or trailing whitespace is ignored when matching code block fences.', () => {
  specify('Whitespace around the opening fence is ignored', () => {
    const markup = `
 \t \`\`\` \t 
const pie = 3.5
\`\`\`

Do your pies ever turn out wrong?`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.CodeBlock('const pie = 3.5'),
        new Up.Paragraph([new Up.Text('Do your pies ever turn out wrong?')])
      ]))
  })

  specify('Whitespace around the closing fence is ignored', () => {
    const markup = `
I enjoy baking.

\`\`\` 
const pie = 3.5
 \t \`\`\` \t

Do you?`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text('I enjoy baking.')]),
        new Up.CodeBlock('const pie = 3.5'),
        new Up.Paragraph([new Up.Text('Do you?')])
      ]))
  })
})


context("An unmatched streak of backticks produces a code block that extends to the end of the code block's container", () => {
  specify("If the code block isn't nested within another convention, it extends to the end of the document", () => {
    const markup = `
Check out the code below!

\`\`\`
function factorial(n: number): number {
  return (
    n <= 1
      ? 1
      : n * factorial(n - 1))
}

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
}

document.write('The factorial of 5 is: ' + factorial(5))`)
      ]))
  })

  specify('If the code block is nested with a spoiler block, it extends to the end of the spoiler block', () => {
    const markup = `
SPOILER:

  \`\`\`
  function nthFibonacci(n: number): number {
    return (
      n <= 2
        ? n - 1 
        : nthFibonacci(n - 1) + nthFibonacci(n - 2))
  }
  
I hope you were able to find a solution without cheating.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.SpoilerBlock([
          new Up.CodeBlock(
            `function nthFibonacci(n: number): number {
  return (
    n <= 2
      ? n - 1 
      : nthFibonacci(n - 1) + nthFibonacci(n - 2))
}`)
        ]),
        new Up.Paragraph([
          new Up.Text('I hope you were able to find a solution without cheating.')
        ])
      ]))
  })
})
