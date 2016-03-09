/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('Text surrounded by (underlined and overlined) streaks of backticks', () => {
  it('produces a code block node containing the surrounded text', () => {
    const text = `
\`\`\`
const pie = 3.5
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode('const pie = 3.5'),
      ]))
  })
})


describe('A code block node', () => {
  it('can contain multiple lines', () => {
    const text = `
\`\`\`
// Escaping backticks in typescript...
// Such a pain!
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode(
`// Escaping backticks in typescript...
// Such a pain!`),
      ]))
  })
})

describe("A code block node's contents", () => {
  it('has its indentation preserved', () => {
    const text =
      `
\`\`\`
if (x < 0) {
  return false
}
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode(
`if (x < 0) {
  return false
}`),
      ]))
  })

  it('has its backslashes preserved', () => {
    const text = `
\`\`\`
const lineBreak = "\\n"
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode('const lineBreak = "\\n"'),
      ]))
  })
})