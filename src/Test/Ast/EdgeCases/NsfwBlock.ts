import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { Line } from '../../../SyntaxNodes/Line'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


context("A NSFW block's label line does not produce a NSFW block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.toAst('NSFW:')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('NSFW:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const text = `
NSFW:
No!
Avoid that initialism!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([new PlainTextNode('NSFW:')]),
          new Line([new PlainTextNode('No!')]),
          new Line([new PlainTextNode("Avoid that initialism!")]),
        ])
      ]))
  })

  specify('followed a blank line then non-indented text', () => {
    const text = `
NSFW:

No!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('NSFW:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed 2 blank lines then non-indented text', () => {
    const text = `
NSFW:


No!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('NSFW:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed 3 or more blank lines then non-indented text', () => {
    const text = `
NSFW:




No!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('NSFW:')
        ]),
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })
})