import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


describe('Emphasis overlapping a linkified spoiler', () => {
  it('splits the emphasis node', () => {
    expect(Up.toAst('After you beat the Elite Four, *only [SPOILER: you* fight Gary] (http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new EmphasisNode([
          new PlainTextNode('only ')
        ]),
        new InlineSpoilerNode([
          new LinkNode([
            new EmphasisNode([
              new PlainTextNode('you')
            ]),
            new PlainTextNode(' fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A linkified spoiler overlapping revision deletion', () => {
  it('splits the revision deletion node', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight Gary ~~Ketchum](http://example.com/finalbattle) and then the credits roll~~.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
          new LinkNode([
            new PlainTextNode('you fight Gary '),
            new RevisionDeletionNode([
              new PlainTextNode('Ketchum')
            ])
          ], 'http://example.com/finalbattle')
        ]),
        new RevisionDeletionNode([
          new PlainTextNode(' and then the credits roll')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A footnote that overlaps a linkified NSFL convention', () => {
  it("splits the NSFL convention node and its inner link node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [NSFL: and realistic) example of a] [example.com] footnote that overlaps an inline NSFL convention.'

    const footnote =
      new FootnoteNode([
        new PlainTextNode('reasonable '),
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('and realistic')
          ], 'https://example.com')
        ])
      ], 1)

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Eventually, I will think of one'),
          footnote,
          new InlineNsflNode([
            new LinkNode([
              new PlainTextNode(' example of a')
            ], 'https://example.com')
          ]),
          new PlainTextNode(' footnote that overlaps an inline NSFL convention.')
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A linkified NSFL convention that overlaps a footnote', () => {
  it("splits the NSFL convention node and its inner link node, not the footnote node", () => {
    const markup = '[NSFL: Gary loses to Ash (^Ketchum] (example.com) is his last name)'

    const footnote =
      new FootnoteNode([
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('Ketchum')
          ], 'https://example.com')
        ]),
        new PlainTextNode(' is his last name')
      ], 1)

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new InlineNsflNode([
            new LinkNode([
              new PlainTextNode('Gary loses to Ash'),
            ], 'https://example.com')
          ]),
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})
