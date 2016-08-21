import { expect } from 'chai'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'
import { Heading } from '../../SyntaxNodes/Heading'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { ReferenceToTableOfContentsEntry } from '../../SyntaxNodes/ReferenceToTableOfContentsEntry'


context("The `UpDocument.create` is automatically used during the normal parsing process. It returns a document object with:", () => {
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

    const document = UpDocument.create(documentChildren)

    const cerealFootnote =
      new Footnote([new PlainText('Well, I do, but I pretend not to.')], 1)

    const movieFootnote =
      new Footnote([new PlainText("And this is a fun fact.")], 2)

    expect(document).to.be.eql(
      new UpDocument([
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
            new Footnote([new PlainText("And this is a fun fact.")], 2)
          ]),
          new FootnoteBlock([
            movieFootnote,
          ])
        ])
      ]))
  })

  specify("A table of contents", () => {
    const documentChildren = [
      new Heading([new PlainText('I enjoy apples')], 1),
      new OrderedList([
        new OrderedList.Item([
          new Heading([new PlainText("They're cheap")], 2),
          new Paragraph([new PlainText("Very cheap.")])
        ]),
        new OrderedList.Item([
          new Heading([new PlainText("They're delicious")], 2),
          new Paragraph([new PlainText("Very delicious.")])
        ])
      ])
    ]

    const document = UpDocument.create(documentChildren)

    const enjoyHeading =
      new Heading([new PlainText('I enjoy apples')], 1)

    const cheapHeading =
      new Heading([new PlainText("They're cheap")], 2)

    const deliciousHeading =
      new Heading([new PlainText("They're delicious")], 2)

    expect(document).to.be.eql(
      new UpDocument([
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
      ], new UpDocument.TableOfContents([enjoyHeading, cheapHeading, deliciousHeading])))
  })

  specify("Referemces to table of contents entries associated with the appropriate entries", () => {
    const documentChildren = [
      new Heading([new PlainText('I drink soda')], 1),
      new Paragraph([
        new PlainText('Actually, I only drink milk.')
      ]),
      new Heading([new PlainText('I never lie')], 1),
      new Paragraph([
        new PlainText('Not quite true. For example, see '),
        new ReferenceToTableOfContentsEntry('soda'),
        new PlainText('.')
      ])
    ]

    const document = UpDocument.create(documentChildren)

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], 1)

    const neverLieHeading =
      new Heading([new PlainText('I never lie')], 1)

    expect(document).to.be.eql(
      new UpDocument([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Paragraph([
          new PlainText('Not quite true. For example, see '),
          new ReferenceToTableOfContentsEntry('soda', sodaHeading),
          new PlainText('.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
  })
})
