/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


function insideDocument(syntaxNodes: SyntaxNode[]): DocumentNode {
  return new DocumentNode(syntaxNodes);
}


describe('Text surrounded (underlined and overlined) by streaks of backticks', function() {
  it('produces a code block node containing the surrounded text', function() {
    const text = `
\`\`\`
const pie = 3.5
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new CodeBlockNode([
          new PlainTextNode('const pie = 3.5')
        ]),
      ]))
  })

  it('can have multiple lines', function() {
    const text = `
\`\`\`
// Escaping backticks in typescript...
// Such a pain!
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new CodeBlockNode([
          new PlainTextNode(
 `// Escaping backticks in typescript...
// Such a pain!`
          )
        ]),
      ]))
  })

  it('preserves indentation', function() {
    const text =
      `
\`\`\`
if (x < 0) {
  return false
}
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new CodeBlockNode([
          new PlainTextNode(
`if (x < 0) {
  return false
}`
          )
        ]),
      ]))
  })

  it('preserves backslashes', function() {
    const text = `
\`\`\`
const lineBreak = "\\n"
\`\`\``
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new CodeBlockNode([
          new PlainTextNode('const lineBreak = "\\n"')
        ]),
      ]))
  })
})
