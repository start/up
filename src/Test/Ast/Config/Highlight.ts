import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Highlight } from '../../../SyntaxNodes/Highlight'


describe('The "highlight" config term', () => {
  const up = new Up({
    terms: {
      markup: { highlight: 'mark' }
    }
  })

  it('is used to indicate highlighted text', () => {
    expect(up.toDocument('[mark: Ash fights Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new Highlight([
          new PlainText('Ash fights Gary')
        ])
      ]))
  })

  it('is case-insensitive, even when custom', () => {
    const lowercase = '[mark: Ash fights Gary]'
    const mixedCase = '[mArK: Ash fights Gary]'

    expect(up.toDocument(lowercase)).to.be.eql(up.toDocument(mixedCase))
  })

  it('is trimmed', () => {
    const markup = '[mark: Ash fights Gary]'

    expect(Up.toDocument(markup, { terms: { markup: { highlight: ' \t mark \t ' } } })).to.be.eql(
      insideDocumentAndParagraph([
        new Highlight([
          new PlainText('Ash fights Gary')
        ])
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = '[*mark*: Ash fights Gary]'

    expect(Up.toDocument(markup, { terms: { markup: { highlight: '*mark*' } } })).to.be.eql(
      insideDocumentAndParagraph([
        new Highlight([
          new PlainText('Ash fights Gary')
        ])
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[paint: Ash fights Gary][mark: Ash fights Gary]'

    expect(Up.toDocument(markup, { terms: { markup: { highlight: ['mark', 'paint'] } } })).to.be.eql(
      insideDocumentAndParagraph([
        new Highlight([
          new PlainText('Ash fights Gary')
        ]),
        new Highlight([
          new PlainText('Ash fights Gary')
        ])
      ]))
  })
})
