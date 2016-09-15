import { expect } from 'chai'
import { Document } from '../../SyntaxNodes/Document'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'
import { Heading } from '../../SyntaxNodes/Heading'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { SectionLink } from '../../SyntaxNodes/SectionLink'


context("The `Document.create` is automatically used during the normal parsing process. It returns a document object with:", () => {
  specify("Footnotes assigned their reference numbers (mutating them) and placed in footnote blocks (mutating any outline nodes the blocks are placed inside)", () => {
    const documentChildren = [
      new Up.Paragraph([
        new Up.PlainText("I don't eat cereal."),
        new Up.Footnote([new Up.PlainText('Well, I do, but I pretend not to.')]),
        new Up.PlainText(" Never have.")
      ]),
      new Up.SpoilerBlock([
        new Up.Paragraph([
          new Up.PlainText("This ruins the movie."),
          new Up.Footnote([new Up.PlainText("And this is a fun fact.")])
        ])
      ])
    ]

    const document = Document.create(documentChildren)

    const cerealFootnote =
      new Up.Footnote([new Up.PlainText('Well, I do, but I pretend not to.')], { referenceNumber: 1 })

    const movieFootnote =
      new Up.Footnote([new Up.PlainText("And this is a fun fact.")], { referenceNumber: 2 })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal."),
          cerealFootnote,
          new Up.PlainText(" Never have.")
        ]),
        new Up.FootnoteBlock([
          cerealFootnote,
        ]),
        new Up.SpoilerBlock([
          new Up.Paragraph([
            new Up.PlainText("This ruins the movie."),
            new Up.Footnote([new Up.PlainText("And this is a fun fact.")], { referenceNumber: 2 })
          ]),
          new Up.FootnoteBlock([
            movieFootnote,
          ])
        ])
      ]))
  })

  specify("A table of contents", () => {
    const documentChildren = [
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1 }),
      new Up.OrderedList([
        new OrderedList.Item([
          new Up.Heading([new Up.PlainText("They're cheap")], { level: 2 }),
          new Up.Paragraph([new Up.PlainText("Very cheap.")])
        ]),
        new OrderedList.Item([
          new Up.Heading([new Up.PlainText("They're delicious")], { level: 2 }),
          new Up.Paragraph([new Up.PlainText("Very delicious.")])
        ])
      ])
    ]

    const document = Document.create(documentChildren)

    const enjoyHeading =
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const cheapHeading =
      new Up.Heading([new Up.PlainText("They're cheap")], { level: 2, ordinalInTableOfContents: 2 })

    const deliciousHeading =
      new Up.Heading([new Up.PlainText("They're delicious")], { level: 2, ordinalInTableOfContents: 3 })

    expect(document).to.deep.equal(
      new Up.Document([
        enjoyHeading,
        new Up.OrderedList([
          new OrderedList.Item([
            cheapHeading,
            new Up.Paragraph([new Up.PlainText("Very cheap.")])
          ]),
          new OrderedList.Item([
            deliciousHeading,
            new Up.Paragraph([new Up.PlainText("Very delicious.")])
          ])
        ])
      ], new Document.TableOfContents([enjoyHeading, cheapHeading, deliciousHeading])))
  })

  specify("Referemces to table of contents entries associated with the appropriate entries", () => {
    const documentChildren = [
      new Up.Heading([new Up.PlainText('I drink soda')], { level: 1 }),
      new Up.Paragraph([
        new Up.PlainText('Actually, I only drink milk.')
      ]),
      new Up.Heading([new Up.PlainText('I never lie')], { level: 1 }),
      new Up.Paragraph([
        new Up.PlainText('Not quite true. For example, see '),
        new Up.SectionLink('soda'),
        new Up.PlainText('.')
      ])
    ]

    const document = Document.create(documentChildren)

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const neverLieHeading =
      new Up.Heading([new Up.PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Up.Paragraph([
          new Up.PlainText('Not quite true. For example, see '),
          new Up.SectionLink('soda', sodaHeading),
          new Up.PlainText('.')
        ])
      ], new Document.TableOfContents([sodaHeading, neverLieHeading])))
  })
})
