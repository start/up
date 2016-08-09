import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { OutlineSeparatorNode } from '../../../SyntaxNodes/OutlineSeparatorNode'


context("A NSFW block's label line does not produce a NSFW block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.toAst('NSFW:')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('NSFW:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
NSFW:
No!
Avoid that initialism!`
    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new LineBlockNode.Line([new PlainTextNode('NSFW:')]),
          new LineBlockNode.Line([new PlainTextNode('No!')]),
          new LineBlockNode.Line([new PlainTextNode("Avoid that initialism!")]),
        ])
      ]))
  })

  specify('followed by a blank line then a non-indented line', () => {
    const markup = `
NSFW:

No!`
    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('NSFW:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed by 2 blank lines then a non-indented line', () => {
    const markup = `
NSFW:


No!`
    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('NSFW:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed by 3 or more blank lines then a non-indented line', () => {
    const markup = `
NSFW:




No!`
    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('NSFW:')
        ]),
        new OutlineSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })
})
