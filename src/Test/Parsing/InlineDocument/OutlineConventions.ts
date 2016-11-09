import { expect } from 'chai'
import * as Up from '../../../Main'


context('Inline documents completely ignore outline conventions. This includes:', () => {
  specify('Thematic break streaks', () => {
    expect(Up.parseInline('#~#~#~#~#')).to.deep.equal(
      new Up.InlineDocument([
        new Up.Text('#~#~#~#~#')
      ]))
  })

  specify('Numbered lists', () => {
    expect(Up.parseInline('1) I agree.')).to.deep.equal(
      new Up.InlineDocument([
        new Up.Text('1) I agree.')
      ]))
  })

  specify('Bulleted lists', () => {
    expect(Up.parseInline('* Prices and participation may vary')).to.deep.equal(
      new Up.InlineDocument([
        new Up.Text('* Prices and participation may vary')
      ]))
  })

  specify('Blockquotes', () => {
    expect(Up.parseInline('> o_o <')).to.deep.equal(
      new Up.InlineDocument([
        new Up.Text('> o_o <')
      ]))
  })

  specify('Code blocks', () => {
    expect(Up.parseInline('`````````')).to.deep.equal(
      new Up.InlineDocument([
        new Up.Text('`````````')
      ]))
  })

  specify('Headings', () => {
    expect(Up.parseInline('Sneaky Snek\n=~=~=~=~=~=')).to.deep.equal(
      new Up.InlineDocument([
        new Up.Text('Sneaky Snek\n=~=~=~=~=~=')
      ]))
  })
})
