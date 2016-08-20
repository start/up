import { expect } from 'chai'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'
import { Heading } from '../../SyntaxNodes/Heading'
import { OrderedList } from '../../SyntaxNodes/OrderedList'


context("The UpDocument.create function is for users who want help manually fiddling with the abstract syntax tree. (It's automatically used during the normal parsing process.)", () => {
  specify("It assigns footnotes their reference numbers (mutating them) and places them in footnote blocks (mutating any outline nodes they're placed inside)", () => {
    const document = UpDocument.create([
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
    ])

    expect(document).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          new Footnote([new PlainText('Well, I do, but I pretend not to.')], 1),
          new PlainText(" Never have.")
        ]),
        new FootnoteBlock([
          new Footnote([new PlainText('Well, I do, but I pretend not to.')], 1),
        ]),
        new SpoilerBlock([
          new Paragraph([
            new PlainText("This ruins the movie."),
            new Footnote([new PlainText("And this is a fun fact.")], 2)
          ]),
          new FootnoteBlock([
            new Footnote([new PlainText('And this is a fun fact.')], 2),
          ])
        ])
      ]))
  })

  specify("It produces a table of contents", () => {
    const document = UpDocument.create([
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
    ])

    expect(document).to.be.eql(
      new UpDocument([
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
      ],
        new UpDocument.TableOfContents([
          new Heading([new PlainText('I enjoy apples')], 1),
          new Heading([new PlainText("They're cheap")], 2),
          new Heading([new PlainText("They're delicious")], 2)
        ])))
  })

  specify("To be clear, it can both produce footnote blocks and create a table of contents at the same time.", () => {
    const document = UpDocument.create([
      new Heading([new PlainText('I enjoy apples')], 1),
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
    ])

    expect(document).to.be.eql(
      new UpDocument([
        new Heading([new PlainText('I enjoy apples')], 1),
        new Paragraph([
          new PlainText("I don't eat cereal."),
          new Footnote([new PlainText('Well, I do, but I pretend not to.')], 1),
          new PlainText(" Never have.")
        ]),
        new FootnoteBlock([
          new Footnote([new PlainText('Well, I do, but I pretend not to.')], 1),
        ]),
        new SpoilerBlock([
          new Paragraph([
            new PlainText("This ruins the movie."),
            new Footnote([new PlainText("And this is a fun fact.")], 2)
          ]),
          new FootnoteBlock([
            new Footnote([new PlainText('And this is a fun fact.')], 2),
          ])
        ])
      ],
        new UpDocument.TableOfContents([
          new Heading([new PlainText('I enjoy apples')], 1)
        ])))
  })
})
