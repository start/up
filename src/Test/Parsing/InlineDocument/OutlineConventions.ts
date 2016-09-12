import { expect } from 'chai'
import { Up } from'../../../Up'
import { InlineUpDocument } from'../../../SyntaxNodes/InlineUpDocument'
import { PlainText } from'../../../SyntaxNodes/PlainText'


context('Inline documents completely ignore outline conventions. This includes:', () => {
  specify('Thematic break streaks', () => {
    expect(Up.parseInline('#~#~#~#~#')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('#~#~#~#~#')
      ]))
  })

  specify('Ordered lists', () => {
    expect(Up.parseInline('1) I agree.')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('1) I agree.')
      ]))
  })

  specify('Unordered lists', () => {
    expect(Up.parseInline('* Prices and participation may vary')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('* Prices and participation may vary')
      ]))
  })

  specify('Blockquotes', () => {
    expect(Up.parseInline('> o_o <')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('> o_o <')
      ]))
  })

  specify('Code blocks', () => {
    expect(Up.parseInline('`````````')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('`````````')
      ]))
  })

  specify('Headings', () => {
    expect(Up.parseInline('Sneaky Snek\n=~=~=~=~=~=')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('Sneaky Snek\n=~=~=~=~=~=')
      ]))
  })
})
