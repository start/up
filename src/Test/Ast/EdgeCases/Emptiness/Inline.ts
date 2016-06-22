import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph } from '../../Helpers'
import { DocumentNode } from '../../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../../SyntaxNodes/ParagraphNode'
import { RevisionInsertionNode } from '../../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../../SyntaxNodes/RevisionDeletionNode'
import { InlineCodeNode } from '../../../../SyntaxNodes/InlineCodeNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../../SyntaxNodes/LinkNode'
import { EmphasisNode } from '../../../../SyntaxNodes/EmphasisNode'


context('Most inline conventions produce no syntax nodes if they have no content.', () => {
  context('Specifically:', () => {

    specify('Spoilers', () => {
      expect(Up.toAst('[SPOILER:]')).to.eql(new DocumentNode())
    })

    specify('NSFW', () => {
      expect(Up.toAst('[NSFW:]')).to.eql(new DocumentNode())
    })

    specify('NSFL', () => {
      expect(Up.toAst('[NSFL:]')).to.eql(new DocumentNode())
    })

    specify('Inline code', () => {
      expect(Up.toAst('``')).to.eql(new DocumentNode())
    })

    specify('Revision insertion', () => {
      // If the revision insertion delimiters were alone on a line, they would be interpreted as a section separator streak. 
      expect(Up.toAst('Spiders.++++')).to.eql(
        new DocumentNode([
          new ParagraphNode([
            new PlainTextNode('Spiders.')
          ])
        ])
      )
    })

    specify('Revision insertion', () => {
      // If the revision deletion delimiters were alone on a line, they would be interpreted as a section separator streak.
      expect(Up.toAst('Spiders.~~~~')).to.eql(
        new DocumentNode([
          new ParagraphNode([
            new PlainTextNode('Spiders.')
          ])
        ])
      )
    })
  })

  context('Of those conventions, only a few produce syntax nodes when they contain only unescaped whitespace.', () => {
    context('Specifically:', () => {

      specify('Inline code', () => {
        expect(Up.toAst('` `')).to.eql(
          new DocumentNode([
            new ParagraphNode([
              new InlineCodeNode(' ')
            ])
          ])
        )
      })

      specify('Revision insertion', () => {
        expect(Up.toAst('no++ ++one')).to.eql(
          new DocumentNode([
            new ParagraphNode([
              new PlainTextNode('no'),
              new RevisionInsertionNode([
                new PlainTextNode(' ')
              ]),
              new PlainTextNode('one')
            ])
          ])
        )
      })

      specify('Revision insertion', () => {
        expect(Up.toAst('e~~ ~~mail')).to.eql(
          new DocumentNode([
            new ParagraphNode([
              new PlainTextNode('e'),
              new RevisionDeletionNode([
                new PlainTextNode(' ')
              ]),
              new PlainTextNode('mail')
            ])
          ])
        )
      })
    })

    context("The rest don't:", () => {

      specify('Spoilers', () => {
        expect(Up.toAst('[SPOILER:  \t  \t ]')).to.eql(new DocumentNode())
      })

      specify('NSFW', () => {
        expect(Up.toAst('[NSFW:  \t  \t ]')).to.eql(new DocumentNode())
      })

      specify('NSFL', () => {
        expect(Up.toAst('[NSFL:  \t  \t ]')).to.eql(new DocumentNode())
      })

      specify('Furthermore, these conventions produce no syntax nodes if they contain only whitespace and other "dud" inline conventions', () => {
        expect(Up.toAst('[NSFL:  \t [SPOILER:  [NSFW: ++++   ]  ] \t ]')).to.eql(new DocumentNode())
      })
    })
  })
})


describe('A link with no URL', () => {
  it("does not produce a link node, but its contents are evaulated for inline conventions and included directly in the link's place", () => {
    expect(Up.toAst('[*Yggdra Union*][]')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Yggdra Union')
        ])
      ]))
  })
})


describe('A link with a blank URL', () => {
  it("does not produce a link node, but its contents are evaulated for inline conventions and included directly in the link's place", () => {
    expect(Up.toAst('[*Yggdra Union*][  \t  ]')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Yggdra Union')
        ])
      ]))
  })
})


describe('A link with no content', () => {
  it('produces a link node with its URL for its content', () => {
    expect(Up.toAst('[][https://google.com]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('https://google.com')
        ], 'https://google.com'
        )]
      ))
  })
})


describe('A link with blank content', () => {
  it('produces a link node with its URL for its content', () => {
    expect(Up.toAst('[   \t  ][https://google.com]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('https://google.com')
        ], 'https://google.com'
        )]))
  })
})


describe('A link with no content and no URL', () => {
  it('produces no syntax nodes', () => {
    expect(Up.toAst('Hello, [][]!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, !')
      ])
    )
  })
})


describe('An empty revision insertion containing an empty revision deletion', () => {
  it('produces no syntax nodes', () => {
    expect(Up.toAst('I have nothing to add or remove: ++~~~~++')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I have nothing to add or remove: ')
      ])
    )
  })
})