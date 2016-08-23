import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Blockquote } from '../../../SyntaxNodes/Blockquote'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { ThematicBreak } from '../../../SyntaxNodes/ThematicBreak'


describe('A single blank blockquoted line', () => {
  it('does not require any trailing whitespace after the blockquote delimiter', () => {
    expect(Up.toDocument('>')).to.be.eql(
      new UpDocument([
        new Blockquote([])
      ]))
  })

  it('may have a trailing space after the blockquote delimiter', () => {
    expect(Up.toDocument('> ')).to.be.eql(
      new UpDocument([
        new Blockquote([])
      ]))
  })

  it('may have a trailing tab after the blockquote delimiter', () => {
    expect(Up.toDocument('>\t')).to.be.eql(
      new UpDocument([
        new Blockquote([])
      ]))
  })
})


describe('A single line blockquote', () => {
  it('can be sandwched by identical outline separator streaks without producing a heading', () => {
    const markup = `
---------------
> I choose you!
---------------`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ThematicBreak(),
        new Blockquote([
          new Paragraph([
            new PlainText('I choose you!')
          ])
        ]),
        new ThematicBreak()
      ]))
  })
})
