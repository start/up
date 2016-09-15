import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'


context("A NSFW block's label line does not produce a NSFW block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.parse('NSFW:')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('NSFW:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
NSFW:
No!
Avoid that initialism!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([new Up.PlainText('NSFW:')]),
          new Up.LineBlock.Line([new Up.PlainText('No!')]),
          new Up.LineBlock.Line([new Up.PlainText("Avoid that initialism!")]),
        ])
      ]))
  })

  specify('followed by a blank line then a non-indented line', () => {
    const markup = `
NSFW:

No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('NSFW:')
        ]),
        new Up.Paragraph([
          new Up.PlainText('No!')
        ])
      ]))
  })

  specify('followed by 2 blank lines then a non-indented line', () => {
    const markup = `
NSFW:


No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('NSFW:')
        ]),
        new Up.Paragraph([
          new Up.PlainText('No!')
        ])
      ]))
  })

  specify('followed by 3 or more blank lines then a non-indented line', () => {
    const markup = `
NSFW:




No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('NSFW:')
        ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.PlainText('No!')
        ])
      ]))
  })
})
