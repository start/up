import { expect } from 'chai'
import { Up } from '../../../Up'
import { Document } from '../../../SyntaxNodes/Document'
import { Blockquote } from '../../../SyntaxNodes/Blockquote'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { ThematicBreak } from '../../../SyntaxNodes/ThematicBreak'


describe('A single blank blockquoted line', () => {
  it('does not require any trailing whitespace after the blockquote delimiter', () => {
    expect(Up.parse('>')).to.deep.equal(
      new Document([
        new Blockquote([])
      ]))
  })

  it('may have a trailing space after the blockquote delimiter', () => {
    expect(Up.parse('> ')).to.deep.equal(
      new Document([
        new Blockquote([])
      ]))
  })

  it('may have a trailing tab after the blockquote delimiter', () => {
    expect(Up.parse('>\t')).to.deep.equal(
      new Document([
        new Blockquote([])
      ]))
  })
})


describe('A single line blockquote', () => {
  it('can be sandwched by identical thematic break streaks without producing a heading', () => {
    const markup = `
---------------
> I choose you!
---------------`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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
