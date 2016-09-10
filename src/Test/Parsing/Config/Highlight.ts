import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Highlight } from '../../../SyntaxNodes/Highlight'


describe('The "highlight" settings term', () => {
  const up = new Up({
    parsing: {
      terms: { highlight: 'mark' }
    }
  })

  it('is used to indicate highlighted text', () => {
    expect(up.parse('[mark: Ash fights Gary]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Highlight([
          new PlainText('Ash fights Gary')
        ])
      ]))
  })

  it('is case-insensitive', () => {
    const lowercase = '[mark: Ash fights Gary]'
    const mixedCase = '[mArK: Ash fights Gary]'

    expect(up.parse(lowercase)).to.deep.equal(up.parse(mixedCase))
  })

  it('is trimmed', () => {
    const markup = '[mark: Ash fights Gary]'

    expect(Up.parse(markup, { terms: { highlight: ' \t mark \t ' } })).to.deep.equal(
      insideDocumentAndParagraph([
        new Highlight([
          new PlainText('Ash fights Gary')
        ])
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = '[*mark*: Ash fights Gary]'

    expect(Up.parse(markup, { terms: { highlight: '*mark*' } })).to.deep.equal(
      insideDocumentAndParagraph([
        new Highlight([
          new PlainText('Ash fights Gary')
        ])
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[paint: Ash fights Gary][mark: Ash fights Gary]'

    expect(Up.parse(markup, { terms: { highlight: ['mark', 'paint'] } })).to.deep.equal(
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
