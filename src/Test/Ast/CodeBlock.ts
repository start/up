/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('Text surrounded (underlined and overlined) by streaks of backticks', () => {
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

  it('can have multiple lines', () => {
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

  it('preserves indentation', () => {
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

  it('preserves backslashes', () => {
    const text = `
\`\`\`
const lineBreak = "\\n"
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode('const lineBreak = "\\n"'),
      ]))
  })

  it('can contain a streak of backticks if the streak is preceeded by whitespace', () => {
    const text =
      `
\`\`\`
 \`\`\`
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode(' ```'),
      ]))
  })
})
