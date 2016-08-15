import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'


describe('A footnote reference at the end of a paragraph', () => {
  it('produces the expected syntax nodes', () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)"

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote produced by parentheses that contains nested parenthesized text ending together', () => {
  it('produces a footnote containing the nested parenthesized text', () => {
    const markup = "(^I'm normal. (I don't eat cereal. (Well, I do, but I pretend not to.)) See?)"

    const footnote = new FootnoteNode([
      new PlainTextNode("I'm normal. "),
      new ParenthesizedNode([
        new PlainTextNode("(I don't eat cereal. "),
        new ParenthesizedNode([
          new PlainTextNode("(Well, I do, but I pretend not to.)"),
        ]),
        new PlainTextNode(')')
      ]),
      new PlainTextNode(' See?')
    ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote produced by square brackets that contains nested square bracketed text ending together', () => {
  it('produces a footnote containing the nested square bracketed text', () => {
    const markup = "[^I'm normal. [I don't eat cereal. [Well, I do, but I pretend not to.]] See?]"

    const footnote = new FootnoteNode([
      new PlainTextNode("I'm normal. "),
      new SquareBracketedNode([
        new PlainTextNode("[I don't eat cereal. "),
        new SquareBracketedNode([
          new PlainTextNode("[Well, I do, but I pretend not to.]"),
        ]),
        new PlainTextNode(']')
      ]),
      new PlainTextNode(' See?')
    ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('Inside an outline convention, blockquoted footnote references', () => {
  it('produce footnote blocks directly after each appropriate convention within the blockquote', () => {
    const markup = `
* > I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.`

    const footnote = new FootnoteNode([
      new PlainTextNode("Well, I do, but I pretend not to."),
    ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                footnote,
                new PlainTextNode(" Never have."),
              ]),
              new FootnoteBlockNode([footnote])
            ])
          ])
        ])
      ]))
  })
})


describe('A footnote with inner footnotes followed by another footnote with inner footnotes', () => {
  it('produces no duplicate reference numbers', () => {
    const markup =
      "Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.) Really. (^Probably. (^No.))"

    const footnoteInsideFirstFootnote = new FootnoteNode([
      new PlainTextNode('Well, I '),
      new EmphasisNode([
        new PlainTextNode('do')
      ]),
      new PlainTextNode(', but I pretend not to.'),
    ], 3)

    const firstFootnote = new FootnoteNode([
      new PlainTextNode("That said, I don't eat cereal."),
      footnoteInsideFirstFootnote,
      new PlainTextNode(" Never have."),
    ], 1)

    const footnoteInsideSecondFootnote = new FootnoteNode([
      new PlainTextNode("No."),
    ], 4)

    const secondFootnote = new FootnoteNode([
      new PlainTextNode("Probably."),
      footnoteInsideSecondFootnote
    ], 2)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("Me? I'm totally normal."),
          firstFootnote,
          new PlainTextNode(" Really."),
          secondFootnote,
        ]),
        new FootnoteBlockNode([
          firstFootnote,
          secondFootnote,
          footnoteInsideFirstFootnote,
          footnoteInsideSecondFootnote
        ])
      ]))
  })
})


describe('A footnote reference at the beginning of a paragraph', () => {
  it('produces the expected syntax nodes', () => {
    const markup = "(^I would never eat cereal.) I'm a normal breakfast eater, just like you."

    const footnote = new FootnoteNode([
      new PlainTextNode('I would never eat cereal.')
    ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          footnote,
          new PlainTextNode(" I'm a normal breakfast eater, just like you.")
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})
