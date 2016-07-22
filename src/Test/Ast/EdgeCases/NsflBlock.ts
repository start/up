import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


context("A NSFL block's label line does not produce a NSFL block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.toAst('NSFL:')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('NSFL:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const text = `
NSFL:
No!
Avoid that initialism!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new LineBlockNode.Line([new PlainTextNode('NSFL:')]),
          new LineBlockNode.Line([new PlainTextNode('No!')]),
          new LineBlockNode.Line([new PlainTextNode("Avoid that initialism!")]),
        ])
      ]))
  })

  specify('followed a blank line then non-indented text', () => {
    const text = `
NSFL:

No!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('NSFL:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed 2 blank lines then non-indented text', () => {
    const text = `
NSFL:


No!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('NSFL:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed 3 or more blank lines then non-indented text', () => {
    const text = `
NSFL:




No!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('NSFL:')
        ]),
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })
})