import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { OutlineSeparator } from '../../../SyntaxNodes/OutlineSeparator'


context("A NSFL block's label line does not produce a NSFL block node if it is", () => {
  specify('the last line of the document', () => {
    expect(Up.toDocument('NSFL:')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('NSFL:')
      ]))
  })

  specify('immediately followed by non-indented text', () => {
    const markup = `
NSFL:
No!
Avoid that initialism!`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([new PlainText('NSFL:')]),
          new LineBlock.Line([new PlainText('No!')]),
          new LineBlock.Line([new PlainText("Avoid that initialism!")]),
        ])
      ]))
  })

  specify('followed by a blank line then a non-indented line', () => {
    const markup = `
NSFL:

No!`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('NSFL:')
        ]),
        new Paragraph([
          new PlainText('No!')
        ])
      ]))
  })

  specify('followed by 2 blank lines then a non-indented line', () => {
    const markup = `
NSFL:


No!`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('NSFL:')
        ]),
        new Paragraph([
          new PlainText('No!')
        ])
      ]))
  })

  specify('followed by 3 or more blank lines then a non-indented line', () => {
    const markup = `
NSFL:




No!`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('NSFL:')
        ]),
        new OutlineSeparator(),
        new Paragraph([
          new PlainText('No!')
        ])
      ]))
  })
})
