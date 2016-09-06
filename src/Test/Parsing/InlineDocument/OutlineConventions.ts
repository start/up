import { expect } from 'chai'
import Up from'../../../index'
import { InlineUpDocument } from'../../../SyntaxNodes/InlineUpDocument'
import { PlainText } from'../../../SyntaxNodes/PlainText'


context('Inline documents completely ignore outline conventions. This includes:', () => {
  specify('Thematic break streaks', () => {
    expect(Up.parseInlineDocument('#~#~#~#~#')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('#~#~#~#~#')
      ]))
  })

  specify('Ordered lists', () => {
    expect(Up.parseInlineDocument('1) I agree.')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('1) I agree.')
      ]))
  })

  specify('Unordered lists', () => {
    expect(Up.parseInlineDocument('* Prices and participation may vary')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('* Prices and participation may vary')
      ]))
  })

  specify('Blockquotes', () => {
    expect(Up.parseInlineDocument('> o_o <')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('> o_o <')
      ]))
  })

  specify('Code blocks', () => {
    expect(Up.parseInlineDocument('`````````')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('`````````')
      ]))
  })

  specify('Headings', () => {
    expect(Up.parseInlineDocument('Sneaky Snek\n=~=~=~=~=~=')).to.deep.equal(
      new InlineUpDocument([
        new PlainText('Sneaky Snek\n=~=~=~=~=~=')
      ]))
  })
})
