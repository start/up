import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { Line } from '../../../SyntaxNodes/Line'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


context("A spoiler block's label line does not produce a spoiler block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.toAst('SPOILER:')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('SPOILER:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const text = `
Spoiler:
No!
Roses don't glow!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([new PlainTextNode('Spoiler:')]),
          new Line([new PlainTextNode('No!')]),
          new Line([new PlainTextNode("Roses don't glow!")]),
        ])
      ]))
  })

  specify('followed a blank line then non-indented text', () => {
    const text = `
Spoiler:

No!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Spoiler:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed 2 blank lines then non-indented text', () => {
    const text = `
Spoiler:


No!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Spoiler:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed 3 or more blank lines then non-indented text', () => {
    const text = `
Spoiler:




No!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Spoiler:')
        ]),
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })
})