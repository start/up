import { expect } from 'chai'
import * as Up from '../../../Main'


describe('A thematic break streak', () => {
  it('can directly precede a heading with a different combination of characters in its underline', () => {
    const markup = `
-------------------- 
Not me. Us!
@---------@`

    const heading =
      new Up.Heading([new Up.Text('Not me. Us!')], {
        level: 1,
        searchableMarkup: "Not me. Us!",
        ordinalInTableOfContents: 1
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.ThematicBreak(),
        heading
      ], new Up.Document.TableOfContents([heading])))
  })

  it('can directly precede a heading with the same combination of characters in its underline, as long as that heading has an overline', () => {
    const markup = `
---------------------------------
-----------
Not me. Us!
-----------`

    const heading =
      new Up.Heading([new Up.Text('Not me. Us!')], {
        level: 1,
        searchableMarkup: "Not me. Us!",
        ordinalInTableOfContents: 1
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.ThematicBreak(),
        heading
      ], new Up.Document.TableOfContents([heading])))
  })
})

