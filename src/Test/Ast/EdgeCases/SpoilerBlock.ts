import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { OutlineSeparatorNode } from '../../../SyntaxNodes/OutlineSeparatorNode'


context("A spoiler block's label line does not produce a spoiler block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.toAst('SPOILER:')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('SPOILER:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
Spoiler:
No!
Roses don't glow!`
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([new PlainTextNode('Spoiler:')]),
          new LineBlockNode.Line([new PlainTextNode('No!')]),
          new LineBlockNode.Line([new PlainTextNode("Roses don't glow!")]),
        ])
      ]))
  })

  specify('followed by a blank line then a non-indented line', () => {
    const markup = `
Spoiler:

No!`
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('Spoiler:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed by 2 blank lines then a non-indented line', () => {
    const markup = `
Spoiler:


No!`
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('Spoiler:')
        ]),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })

  specify('followed by 3 or more blank lines then a non-indented line', () => {
    const markup = `
Spoiler:




No!`
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('Spoiler:')
        ]),
        new OutlineSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('No!')
        ])
      ]))
  })
})
