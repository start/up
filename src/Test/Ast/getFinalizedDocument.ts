import { expect } from 'chai'
import { getFinalizedDocument  } from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'


context("The getFinalizedDocument function is exported for users who want manually to fiddle with the abstract syntax tree. (It's automatically used during the normal parsing process.)", () => {
  specify("It assigns footnotes their reference numbers (mutating them!) and places them in footnote blocks", () => {
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
})
