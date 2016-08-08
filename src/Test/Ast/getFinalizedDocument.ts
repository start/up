import { expect } from 'chai'
import { getFinalizedDocument  } from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'


context("The getFinalizedDocument function is exported for users who want help manually fiddling with the abstract syntax tree. (It's automatically used during the normal parsing process.)", () => {
  specify("It assigns footnotes their reference numbers (mutating them) and places them in footnote blocks (mutating any outline nodes they're placed inside)", () => {
    const documentNode = getFinalizedDocument({
      documentChildren: [
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          new FootnoteNode([new PlainTextNode('Well, I do, but I pretend not to.')]),
          new PlainTextNode(" Never have.")
        ]),
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode("This ruins the movie."),
            new FootnoteNode([new PlainTextNode("And this is a fun fact.")])
          ])
        ])
      ],
      createTableOfContents: false
    })

    expect(documentNode).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          new FootnoteNode([new PlainTextNode('Well, I do, but I pretend not to.')], 1),
          new PlainTextNode(" Never have.")
        ]),
        new FootnoteBlockNode([
          new FootnoteNode([new PlainTextNode('Well, I do, but I pretend not to.')], 1),
        ]),
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode("This ruins the movie."),
            new FootnoteNode([new PlainTextNode("And this is a fun fact.")], 2)
          ]),
          new FootnoteBlockNode([
            new FootnoteNode([new PlainTextNode('And this is a fun fact.')], 2),
          ])
        ])
      ]))
  })

  specify("It produces a table of contents if the 'createTableOfContents' argument is set to true.", () => {
    const documentNode = getFinalizedDocument({
      documentChildren: [
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1),
        new OrderedListNode([
          new OrderedListNode.Item([
            new HeadingNode([new PlainTextNode("They're cheap")], 2),
            new ParagraphNode([new PlainTextNode("Very cheap.")])
          ]),
          new OrderedListNode.Item([
            new HeadingNode([new PlainTextNode("They're delicious")], 2),
            new ParagraphNode([new PlainTextNode("Very delicious.")])
          ])
        ])
      ],
      createTableOfContents: true
    })

    expect(documentNode).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1),
        new OrderedListNode([
          new OrderedListNode.Item([
            new HeadingNode([new PlainTextNode("They're cheap")], 2),
            new ParagraphNode([new PlainTextNode("Very cheap.")])
          ]),
          new OrderedListNode.Item([
            new HeadingNode([new PlainTextNode("They're delicious")], 2),
            new ParagraphNode([new PlainTextNode("Very delicious.")])
          ])
        ])
      ],
        new DocumentNode.TableOfContents([
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1),
          new HeadingNode([new PlainTextNode("They're cheap")], 2),
          new HeadingNode([new PlainTextNode("They're delicious")], 2)
        ])))
  })

  specify("It does not produce a table of contents if the 'createTableOfContents' argument is set to false.", () => {
    const documentNode = getFinalizedDocument({
      documentChildren: [
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1),
        new OrderedListNode([
          new OrderedListNode.Item([
            new HeadingNode([new PlainTextNode("They're cheap")], 2),
            new ParagraphNode([new PlainTextNode("Very cheap.")])
          ]),
          new OrderedListNode.Item([
            new HeadingNode([new PlainTextNode("They're delicious")], 2),
            new ParagraphNode([new PlainTextNode("Very delicious.")])
          ])
        ])
      ],
      createTableOfContents: false
    })

    expect(documentNode).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1),
        new OrderedListNode([
          new OrderedListNode.Item([
            new HeadingNode([new PlainTextNode("They're cheap")], 2),
            new ParagraphNode([new PlainTextNode("Very cheap.")])
          ]),
          new OrderedListNode.Item([
            new HeadingNode([new PlainTextNode("They're delicious")], 2),
            new ParagraphNode([new PlainTextNode("Very delicious.")])
          ])
        ])
      ]))
  })

  specify("To be clear, it can both produce footnote blocks and create a table of contents at the same time.", () => {
    const documentNode = getFinalizedDocument({
      documentChildren: [
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1),
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          new FootnoteNode([new PlainTextNode('Well, I do, but I pretend not to.')]),
          new PlainTextNode(" Never have.")
        ]),
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode("This ruins the movie."),
            new FootnoteNode([new PlainTextNode("And this is a fun fact.")])
          ])
        ])
      ],
      createTableOfContents: true
    })

    expect(documentNode).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1),
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          new FootnoteNode([new PlainTextNode('Well, I do, but I pretend not to.')], 1),
          new PlainTextNode(" Never have.")
        ]),
        new FootnoteBlockNode([
          new FootnoteNode([new PlainTextNode('Well, I do, but I pretend not to.')], 1),
        ]),
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode("This ruins the movie."),
            new FootnoteNode([new PlainTextNode("And this is a fun fact.")], 2)
          ]),
          new FootnoteBlockNode([
            new FootnoteNode([new PlainTextNode('And this is a fun fact.')], 2),
          ])
        ])
      ],
        new DocumentNode.TableOfContents([
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1)
        ])))
  })
})
