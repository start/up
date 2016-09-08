import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { ThematicBreak } from '../../../SyntaxNodes/ThematicBreak'


context("A spoiler block's label line does not produce a spoiler block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.parse('SPOILER:')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('SPOILER:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
Spoiler:
No!
Roses don't glow!`
    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([new PlainText('Spoiler:')]),
          new LineBlock.Line([new PlainText('No!')]),
          new LineBlock.Line([new PlainText("Roses don't glow!")]),
        ])
      ]))
  })

  specify('followed by a blank line then a non-indented line', () => {
    const markup = `
Spoiler:

No!`
    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Spoiler:')
        ]),
        new Paragraph([
          new PlainText('No!')
        ])
      ]))
  })

  specify('followed by 2 blank lines then a non-indented line', () => {
    const markup = `
Spoiler:


No!`
    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Spoiler:')
        ]),
        new Paragraph([
          new PlainText('No!')
        ])
      ]))
  })

  specify('followed by 3 or more blank lines then a non-indented line', () => {
    const markup = `
Spoiler:




No!`
    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Spoiler:')
        ]),
        new ThematicBreak(),
        new Paragraph([
          new PlainText('No!')
        ])
      ]))
  })
})
