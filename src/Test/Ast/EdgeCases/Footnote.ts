import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'
import { ActionNode } from '../../../SyntaxNodes/ActionNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../../SyntaxNodes/UnorderedListItem'


describe('A footnote reference at the end of a paragraph', () => {
  it('produces the expected syntax nodes', () => {
    const text = "I don't eat cereal. (^Well, I do, but I pretend not to.)"

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote reference directly following parenthesized text', () => {
  it('does not produce a link node', () => {
    const text = "I don't eat cereal (or oatmeal)(^Well, I do, but I pretend not to.) on Mondays."

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal "),
          new ParenthesizedNode([
            new PlainTextNode('(or oatmeal)')
          ]),
          footnote,
          new PlainTextNode(" on Mondays."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote produced by parentheses that contains nested parenthesized text ending together with "))"', () => {
  it('produces a footnote containing the nested parenthesized text', () => {
    const text = "((I'm normal. (I don't eat cereal. (Well, I do, but I pretend not to.)) See?))"

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

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote produced by square brackets that contains nested square bracketed text ending together', () => {
  it('produces a footnote containing the nested square bracketed text', () => {
    const text = "[^I'm normal. [I don't eat cereal. [Well, I do, but I pretend not to.]] See?]"

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

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote produced by curly brackets that contains nested action text ending together', () => {
  it('produces a footnote containing the nested action text', () => {
    const text = "{^I'm normal. {eats {dies}} See?}"

    const footnote = new FootnoteNode([
      new PlainTextNode("I'm normal. "),
      new ActionNode([
        new PlainTextNode("eats "),
        new ActionNode([
          new PlainTextNode("dies"),
        ])
      ]),
      new PlainTextNode(' See?')
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('Nested parenthesized text ending together with "))"', () => {
  it('does not produce any footnote nodes', () => {
    const text = "(I don't eat cereal. (Well, I do, but I pretend not to.))"

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new ParenthesizedNode([
            new PlainTextNode("(I don't eat cereal. "),
            new ParenthesizedNode([
              new PlainTextNode("(Well, I do, but I pretend not to.)"),
            ]),
            new PlainTextNode(')')
          ])
        ]),
      ]))
  })
})


describe('Nested square bracketed text ending together with "]]"', () => {
  it('does not produce any footnote nodes', () => {
    const text = "[I don't eat cereal. [Well, I do, but I pretend not to.]]"

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new SquareBracketedNode([
            new PlainTextNode("[I don't eat cereal. "),
            new SquareBracketedNode([
              new PlainTextNode("[Well, I do, but I pretend not to.]"),
            ]),
            new PlainTextNode(']')
          ])
        ]),
      ]))
  })
})


describe('Nested action text ending together with "}}"', () => {
  it('does not produce any footnote nodes', () => {
    const text = "{eats {dies}}"

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new ActionNode([
            new PlainTextNode("eats "),
            new ActionNode([
              new PlainTextNode("dies"),
            ])
          ])
        ]),
      ]))
  })
})


describe('Inside an outline convention, blockquoted footnote references', () => {
  it('produce footnote blocks directly after each appropriate convention within the blockquote', () => {
    const text = `
* > I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.`

    const footnote = new FootnoteNode([
      new PlainTextNode("Well, I do, but I pretend not to."),
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
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

describe('Within an outline convention, a blockquoted footnote reference that follows a non-blockquoted footnote reference', () => {
  it("has a reference number greater than that of the preceding reference, but it produces footnote block that appears before the footnote block of the preceding reference", () => {
    const text = `
* I regularly drink water. ((When it's in other beverages.))

* > I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.`

    const footnoteInFirstListItem = new FootnoteNode([
      new PlainTextNode("When it's in other beverages."),
    ], 1)

    const footnoteInBlockquote = new FootnoteNode([
      new PlainTextNode("Well, I do, but I pretend not to."),
    ], 2)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode("I regularly drink water."),
              footnoteInFirstListItem
            ])
          ]),
          new UnorderedListItem([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                footnoteInBlockquote,
                new PlainTextNode(" Never have."),
              ]),
              new FootnoteBlockNode([footnoteInBlockquote])
            ]),
          ]),
        ]),
        new FootnoteBlockNode([footnoteInFirstListItem])
      ]))
  })
})


describe('A footnote with inner footnotes followed by another footnote with inner footnotes', () => {
  it('produces no duplicate reference numbers', () => {
    const text =
      "Me? I'm totally normal. ((That said, I don't eat cereal. ((Well, I *do*, but I pretend not to.)) Never have.)) Really. ((Probably. ((No.))))"

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

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = "((I would never eat cereal.)) I'm a normal breakfast eater, just like you."

    const footnote = new FootnoteNode([
      new PlainTextNode('I would never eat cereal.')
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote,
          new PlainTextNode(" I'm a normal breakfast eater, just like you.")
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})
