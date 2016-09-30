import { expect } from 'chai'
import * as Up from '../../Up'


context("The `Document.create` method is automatically used during the normal parsing process. It returns a document object with:", () => {
  specify("A table of contents", () => {
    const documentChildren = [
      new Up.Heading([new Up.Text('I enjoy apples')], { level: 1 }),
      new Up.OrderedList([
        new Up.OrderedList.Item([
          new Up.Heading([new Up.Text("They're cheap")], { level: 2 }),
          new Up.Paragraph([new Up.Text("Very cheap.")])
        ]),
        new Up.OrderedList.Item([
          new Up.Heading([new Up.Text("They're delicious")], { level: 2 }),
          new Up.Paragraph([new Up.Text("Very delicious.")])
        ])
      ])
    ]

    const document =
      Up.Document.create(documentChildren)

    const enjoyHeading =
      new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const cheapHeading =
      new Up.Heading([new Up.Text("They're cheap")], { level: 2, ordinalInTableOfContents: 2 })

    const deliciousHeading =
      new Up.Heading([new Up.Text("They're delicious")], { level: 2, ordinalInTableOfContents: 3 })

    expect(document).to.deep.equal(
      new Up.Document([
        enjoyHeading,
        new Up.OrderedList([
          new Up.OrderedList.Item([
            cheapHeading,
            new Up.Paragraph([new Up.Text("Very cheap.")])
          ]),
          new Up.OrderedList.Item([
            deliciousHeading,
            new Up.Paragraph([new Up.Text("Very delicious.")])
          ])
        ])
      ], new Up.Document.TableOfContents([enjoyHeading, cheapHeading, deliciousHeading])))
  })

  specify("Section links matched with the appropriate table of contents entries", () => {
    const documentChildren = [
      new Up.Heading([new Up.Text('I drink soda')], { level: 1 }),
      new Up.Paragraph([
        new Up.Text('Actually, I only drink milk.')
      ]),
      new Up.Heading([new Up.Text('I never lie')], { level: 1 }),
      new Up.Paragraph([
        new Up.Text('Not quite true. For example, see '),
        new Up.SectionLink('soda'),
        new Up.Text('.')
      ])
    ]

    const document =
      Up.Document.create(documentChildren)

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Up.Paragraph([
          new Up.Text('Not quite true. For example, see '),
          new Up.SectionLink('soda', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify("Any footnotes assigned their reference numbers (mutating them) and placed in footnote blocks (mutating any outline nodes the blocks are placed inside)", () => {
    const documentChildren = [
      new Up.Paragraph([
        new Up.Text("I don't eat cereal."),
        new Up.Footnote([new Up.Text('Well, I do, but I pretend not to.')]),
        new Up.Text(" Never have.")
      ]),
      new Up.RevealableBlock([
        new Up.Paragraph([
          new Up.Text("This ruins the movie."),
          new Up.Footnote([new Up.Text("And this is a fun fact.")])
        ])
      ])
    ]

    const document =
      Up.Document.create(documentChildren)

    const cerealFootnote =
      new Up.Footnote([new Up.Text('Well, I do, but I pretend not to.')], { referenceNumber: 1 })

    const movieFootnote =
      new Up.Footnote([new Up.Text("And this is a fun fact.")], { referenceNumber: 2 })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I don't eat cereal."),
          cerealFootnote,
          new Up.Text(" Never have.")
        ]),
        new Up.FootnoteBlock([
          cerealFootnote,
        ]),
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text("This ruins the movie."),
            new Up.Footnote([new Up.Text("And this is a fun fact.")], { referenceNumber: 2 })
          ]),
          new Up.FootnoteBlock([
            movieFootnote,
          ])
        ])
      ]))
  })
})
