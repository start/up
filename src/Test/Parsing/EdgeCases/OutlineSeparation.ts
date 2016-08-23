import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { UnorderedList } from '../../../SyntaxNodes/UnorderedList'
import { OrderedList } from '../../../SyntaxNodes/OrderedList'
import { ThematicBreak } from '../../../SyntaxNodes/ThematicBreak'
import { Heading } from '../../../SyntaxNodes/Heading'


describe('An outline separator streak', () => {
  it('can directly precede a heading with different characters in its underline', () => {
    const markup = `
- - - - - - - - - - - 
Not me. Us!
@---------@`

    const heading =
      new Heading([new PlainText('Not me. Us!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.eql(
      new UpDocument([
        new ThematicBreak(),
        heading
      ], new UpDocument.TableOfContents([heading])))
  })

  it('can directly precede a heading with the same characters in its underline, as long as that heading has an overline', () => {
    const markup = `
---------------------------------
-----------
Not me. Us!
-----------`

    const heading =
      new Heading([new PlainText('Not me. Us!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.eql(
      new UpDocument([
        new ThematicBreak(),
        heading
      ], new UpDocument.TableOfContents([heading])))
  })
})


describe('A streak of asterisks with spaces between', () => {
  it('produces a single outline separator node rather than a heavily nested list', () => {
    expect(Up.toDocument('* * * * * *')).to.be.eql(
      new UpDocument([
        new ThematicBreak()
      ]))
  })
})


describe('A streak of number signs with spaces between', () => {
  it('produces a single outline separator node rather than a heavily nested list', () => {
    expect(Up.toDocument('# # # # # #')).to.be.eql(
      new UpDocument([
        new ThematicBreak()
      ]))
  })
})


describe('A streak of asterisks with spaces between', () => {
  it('can directly follow an unordered list', () => {
    const markup = `
* Mittens
* Gloves
* * * * * *`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Mittens')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Gloves')
            ])
          ])
        ]),
        new ThematicBreak()
      ]))
  })
})


describe('A streak of number signs with spaces between', () => {
  it('can directly follow an ordered list', () => {
    const markup = `
# Mittens
# Gloves
# # # # # #`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Mittens')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Gloves')
            ])
          ])
        ]),
        new ThematicBreak()
      ]))
  })
})
