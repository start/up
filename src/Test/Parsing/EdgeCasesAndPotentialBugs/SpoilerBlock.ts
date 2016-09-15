import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'


context("A spoiler block's label line does not produce a spoiler block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.parse('SPOILER:')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('SPOILER:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
Spoiler:
No!
Roses don't glow!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([new Up.PlainText('Spoiler:')]),
          new Up.LineBlock.Line([new Up.PlainText('No!')]),
          new Up.LineBlock.Line([new Up.PlainText("Roses don't glow!")]),
        ])
      ]))
  })

  specify('followed by a blank line then a non-indented line', () => {
    const markup = `
Spoiler:

No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('Spoiler:')
        ]),
        new Up.Paragraph([
          new Up.PlainText('No!')
        ])
      ]))
  })

  specify('followed by 2 blank lines then a non-indented line', () => {
    const markup = `
Spoiler:


No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('Spoiler:')
        ]),
        new Up.Paragraph([
          new Up.PlainText('No!')
        ])
      ]))
  })

  specify('followed by 3 or more blank lines then a non-indented line', () => {
    const markup = `
Spoiler:




No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('Spoiler:')
        ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.PlainText('No!')
        ])
      ]))
  })
})
