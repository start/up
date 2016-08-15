import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'


describe('Inline code', () => {
  it('can be the last convention in a paragraph', () => {
    expect(Up.toDocument('Dropship `harass`')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Dropship '),
        new InlineCodeNode('harass')
      ]))
  })
})


context('Unmatched streaks of backticks are preserved as plain text. This applies for any unmatched streak, including', () => {
  specify('"streaks" of 1', () => {
    expect(Up.toDocument('I don`t ever do this')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I don`t ever do this')
      ]))
  })

  specify('streaks of 2', () => {
    expect(Up.toDocument('I don``t ever do this')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I don``t ever do this')
      ]))
  })

  specify('streaks of 3', () => {
    expect(Up.toDocument('I don```t ever do this')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I don```t ever do this')
      ]))
  })

  specify('streaks that would otherwise match a previously matched start delimiter', () => {
    expect(Up.toDocument('I always use `<marquee>` elements, but I don`t ever do this.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I always use '),
        new InlineCodeNode('<marquee>'),
        new PlainTextNode(' elements, but I don`t ever do this.')
      ]))
  })
})
