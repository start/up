import { expect } from 'chai'
import { Up } from '../../../Up'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { ThematicBreak } from '../../../SyntaxNodes/ThematicBreak'
import { Heading } from '../../../SyntaxNodes/Heading'


describe('A thematic break streak', () => {
  it('can directly precede a heading with a different combination of characters in its underline', () => {
    const markup = `
-------------------- 
Not me. Us!
@---------@`

    const heading =
      new Heading([new PlainText('Not me. Us!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.parse(markup)).to.eql(
      new UpDocument([
        new ThematicBreak(),
        heading
      ], new UpDocument.TableOfContents([heading])))
  })

  it('can directly precede a heading with the same combination of characters in its underline, as long as that heading has an overline', () => {
    const markup = `
---------------------------------
-----------
Not me. Us!
-----------`

    const heading =
      new Heading([new PlainText('Not me. Us!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.parse(markup)).to.eql(
      new UpDocument([
        new ThematicBreak(),
        heading
      ], new UpDocument.TableOfContents([heading])))
  })
})

