import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { OutlineSeparator } from '../../../SyntaxNodes/OutlineSeparator'


context("A NSFW block's label line does not produce a NSFW block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.toDocument('NSFW:')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('NSFW:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
NSFW:
No!
Avoid that initialism!`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('NSFW:')
        ]),
        new OutlineSeparator(),
        new Paragraph([
          new PlainText('No!')
        ])
      ]))
  })
})
