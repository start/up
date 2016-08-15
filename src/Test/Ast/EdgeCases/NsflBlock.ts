import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { OutlineSeparatorNode } from '../../../SyntaxNodes/OutlineSeparatorNode'


context("A NSFL block's label line does not produce a NSFL block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.toAst('NSFL:')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('NSFL:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
NSFL:
No!
Avoid that initialism!`
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([new PlainTextNode('NSFL:')]),
          new LineBlockNode.Line([new PlainTextNode('No!')]),
          new LineBlockNode.Line([new PlainTextNode("Avoid that initialism!")]),
        ])
      ]))
  })

  specify('followed by a blank line then a non-indented line', () => {
    const markup = `
NSFL:

No!`
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('NSFL:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed by 2 blank lines then a non-indented line', () => {
    const markup = `
NSFL:


No!`
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('NSFL:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed by 3 or more blank lines then a non-indented line', () => {
    const markup = `
NSFL:




No!`
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('NSFL:')
        ]),
        new OutlineSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })
})
