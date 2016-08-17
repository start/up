import { expect } from 'chai'
import Up from'../../../index'
import { InlineUpDocument } from'../../../SyntaxNodes/InlineUpDocument'
import { PlainTextNode } from'../../../SyntaxNodes/PlainTextNode'


context('Inline documents completely ignore outline conventions. This includes:', () => {
  specify('Outline separation streaks', () => {
    expect(Up.toInlineDocument('#~#~#~#~#')).to.be.eql(
      new InlineUpDocument([
        new PlainTextNode('#~#~#~#~#')
      ]))
  })

  specify('Ordered lists', () => {
    expect(Up.toInlineDocument('1) I agree.')).to.be.eql(
      new InlineUpDocument([
        new PlainTextNode('1) I agree.')
      ]))
  })

  specify('Unordered lists', () => {
    expect(Up.toInlineDocument('* Prices and participation may vary')).to.be.eql(
      new InlineUpDocument([
        new PlainTextNode('* Prices and participation may vary')
      ]))
  })

  specify('Blockquotes', () => {
    expect(Up.toInlineDocument('> o_o <')).to.be.eql(
      new InlineUpDocument([
        new PlainTextNode('> o_o <')
      ]))
  })

  specify('Code blocks', () => {
    expect(Up.toInlineDocument('`````````')).to.be.eql(
      new InlineUpDocument([
        new PlainTextNode('`````````')
      ]))
  })

  specify('Headings', () => {
    expect(Up.toInlineDocument('Sneaky Snek\n=~=~=~=~=~=')).to.be.eql(
      new InlineUpDocument([
        new PlainTextNode('Sneaky Snek\n=~=~=~=~=~=')
      ]))
  })
})
