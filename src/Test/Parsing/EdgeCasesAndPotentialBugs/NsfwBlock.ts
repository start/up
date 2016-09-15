import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'
import { Document } from '../../../SyntaxNodes/Document'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { ThematicBreak } from '../../../SyntaxNodes/ThematicBreak'


context("A NSFW block's label line does not produce a NSFW block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.parse('NSFW:')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('NSFW:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
NSFW:
No!
Avoid that initialism!`
    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new LineBlock([
          new LineBlock.Line([new PlainText('NSFW:')]),
          new LineBlock.Line([new PlainText('No!')]),
          new LineBlock.Line([new PlainText("Avoid that initialism!")]),
        ])
      ]))
  })

  specify('followed by a blank line then a non-indented line', () => {
    const markup = `
NSFW:

No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Paragraph([
          new PlainText('NSFW:')
        ]),
        new Paragraph([
          new PlainText('No!')
        ])
      ]))
  })

  specify('followed by 2 blank lines then a non-indented line', () => {
    const markup = `
NSFW:


No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Paragraph([
          new PlainText('NSFW:')
        ]),
        new Paragraph([
          new PlainText('No!')
        ])
      ]))
  })

  specify('followed by 3 or more blank lines then a non-indented line', () => {
    const markup = `
NSFW:




No!`
    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Paragraph([
          new PlainText('NSFW:')
        ]),
        new ThematicBreak(),
        new Paragraph([
          new PlainText('No!')
        ])
      ]))
  })
})
