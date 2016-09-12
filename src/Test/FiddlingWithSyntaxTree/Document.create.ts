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
      new Paragraph([
        new PlainText("I don't eat cereal."),
        new Footnote([new PlainText('Well, I do, but I pretend not to.')]),
        new PlainText(" Never have.")
      ]),
      new SpoilerBlock([
        new Paragraph([
          new PlainText("This ruins the movie."),
          new Footnote([new PlainText("And this is a fun fact.")])
        ])
      ])
    ]

    const document = Document.create(documentChildren)

    const cerealFootnote =
      new Footnote([new PlainText('Well, I do, but I pretend not to.')], { referenceNumber: 1 })

    const movieFootnote =
      new Footnote([new PlainText("And this is a fun fact.")], { referenceNumber: 2 })

    expect(document).to.deep.equal(
      new Document([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          cerealFootnote,
          new PlainText(" Never have.")
        ]),
        new FootnoteBlock([
          cerealFootnote,
        ]),
        new SpoilerBlock([
          new Paragraph([
            new PlainText("This ruins the movie."),
            new Footnote([new PlainText("And this is a fun fact.")], { referenceNumber: 2 })
          ]),
          new FootnoteBlock([
            movieFootnote,
          ])
        ])
      ]))
  })

  specify("A table of contents", () => {
    const documentChildren = [
      new Heading([new PlainText('I enjoy apples')], { level: 1 }),
      new OrderedList([
        new OrderedList.Item([
          new Heading([new PlainText("They're cheap")], { level: 2 }),
          new Paragraph([new PlainText("Very cheap.")])
        ]),
        new OrderedList.Item([
          new Heading([new PlainText("They're delicious")], { level: 2 }),
          new Paragraph([new PlainText("Very delicious.")])
        ])
      ])
    ]

    const document = Document.create(documentChildren)

    const enjoyHeading =
      new Heading([new PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const cheapHeading =
      new Heading([new PlainText("They're cheap")], { level: 2, ordinalInTableOfContents: 2 })

    const deliciousHeading =
      new Heading([new PlainText("They're delicious")], { level: 2, ordinalInTableOfContents: 3 })

    expect(document).to.deep.equal(
      new Document([
        enjoyHeading,
        new OrderedList([
          new OrderedList.Item([
            cheapHeading,
            new Paragraph([new PlainText("Very cheap.")])
          ]),
          new OrderedList.Item([
            deliciousHeading,
            new Paragraph([new PlainText("Very delicious.")])
          ])
        ])
      ], new Document.TableOfContents([enjoyHeading, cheapHeading, deliciousHeading])))
  })

  specify("Referemces to table of contents entries associated with the appropriate entries", () => {
    const documentChildren = [
      new Heading([new PlainText('I drink soda')], { level: 1 }),
      new Paragraph([
        new PlainText('Actually, I only drink milk.')
      ]),
      new Heading([new PlainText('I never lie')], { level: 1 }),
      new Paragraph([
        new PlainText('Not quite true. For example, see '),
        new SectionLink('soda'),
        new PlainText('.')
      ])
    ]

    const document = Document.create(documentChildren)

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const neverLieHeading =
      new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new Document([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Paragraph([
          new PlainText('Not quite true. For example, see '),
          new SectionLink('soda', sodaHeading),
          new PlainText('.')
        ])
      ], new Document.TableOfContents([sodaHeading, neverLieHeading])))
  })
})
