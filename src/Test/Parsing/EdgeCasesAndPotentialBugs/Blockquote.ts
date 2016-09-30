import { expect } from 'chai'
import * as Up from '../../../Up'


describe('A single blank blockquoted line', () => {
  it('does not require any trailing whitespace after the blockquote delimiter', () => {
    expect(Up.parse('>')).to.deep.equal(
      new Up.Document([
        new Up.Blockquote([])
      ]))
  })

  it('may have a trailing space after the blockquote delimiter', () => {
    expect(Up.parse('> ')).to.deep.equal(
      new Up.Document([
        new Up.Blockquote([])
      ]))
  })

  it('may have a trailing tab after the blockquote delimiter', () => {
    expect(Up.parse('>\t')).to.deep.equal(
      new Up.Document([
        new Up.Blockquote([])
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
      new Up.Document([
        new Up.ThematicBreak(),
        new Up.Blockquote([
          new Up.Paragraph([
            new Up.Text('I choose you!')
          ])
        ]),
        new Up.ThematicBreak()
      ]))
  })
})
