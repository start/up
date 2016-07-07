import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph } from '../../Helpers'
import { DocumentNode } from '../../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../../SyntaxNodes/ParagraphNode'
import { RevisionInsertionNode } from '../../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../../SyntaxNodes/RevisionDeletionNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../../SyntaxNodes/LinkNode'
import { EmphasisNode } from '../../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../../SyntaxNodes/StressNode'
import { ParenthesizedNode } from '../../../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../../../SyntaxNodes/SquareBracketedNode'


context('Most inline conventions are not applied if they have no content', () => {
  context('Specifically:', () => {
    specify('Spoilers', () => {
      expect(Up.toAst('[SPOILER:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('SPOILER:')
          ])
        ]))
    })

    specify('NSFW', () => {
      expect(Up.toAst('[NSFW:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('NSFW:')
          ])
        ]))
    })

    specify('NSFL', () => {
      expect(Up.toAst('[NSFL:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('NSFL:')
          ])
        ]))
    })

    specify('Parentheses', () => {
      expect(Up.toAst('()')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('()')
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toAst('[]')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[]')
        ]))
    })

    specify('Actions', () => {
      expect(Up.toAst('{}')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('{}')
        ]))
    })

    specify('Revision insertion', () => {
      // If the revision insertion delimiters were alone on a line, they would be interpreted as a section separator streak. 
      expect(Up.toAst('Spiders.++++')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Spiders.++++')
        ])
      )
    })

    specify('Revision insertion', () => {
      // If the revision deletion delimiters were alone on a line, they would be interpreted as a section separator streak.
      expect(Up.toAst('Spiders.~~~~')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Spiders.~~~~')
        ])
      )
    })


    context('Of those conventions, only the revision conventions apply when containing only unescaped whitespace.', () => {
      specify('Revision insertion applies.', () => {
        expect(Up.toAst('no++ ++one')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('no'),
            new RevisionInsertionNode([
              new PlainTextNode(' ')
            ]),
            new PlainTextNode('one')
          ])
        )
      })

      specify('Revision deletion applies.', () => {
        expect(Up.toAst('e~~ ~~mail')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('e'),
            new RevisionDeletionNode([
              new PlainTextNode(' ')
            ]),
            new PlainTextNode('mail')
          ])
        )
      })


      context("These don't:", () => {
        specify('Spoilers', () => {
          expect(Up.toAst('[SPOILER:  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('[SPOILER:  \t  \t ]')
            ]))
        })

        specify('NSFW', () => {
          expect(Up.toAst('[NSFW:  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('[NSFW:  \t  \t ]')
            ]))
        })

        specify('NSFL', () => {
          expect(Up.toAst('[NSFL:  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('[NSFL:  \t  \t ]')
            ]))
        })

        specify('Parentheses', () => {
          expect(Up.toAst('(  \t  \t )')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('(  \t  \t )')
            ]))
        })

        specify('Square brackets', () => {
          expect(Up.toAst('[  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('[  \t  \t ]')
            ]))
        })

        specify('Actions', () => {
          expect(Up.toAst('{  \t  \t }')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('{  \t  \t }')
            ]))
        })

        specify('Furthermore, these conventions produce no syntax nodes if they contain only whitespace and other empty "void" inline conventions', () => {
          expect(Up.toAst('[NSFL:  \t [SPOILER: {} [NSFW: ++++   ]  ] \t ]')).to.eql(new DocumentNode())
        })
      })
    })
  })


  context('Links are handled a bit differently, because they also have a URL.', () => {
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
            ], 'https://google.com')
          ]))
      })
    })


    context('The content of a link cannot start or end with whitespace, so it can only be blank if the whitespace is escaped.', () => {
      specify('When this is the case, its URL is its content', () => {
        expect(Up.toAst('[\\ ][https://google.com]')).to.be.eql(
          insideDocumentAndParagraph([
            new LinkNode([
              new PlainTextNode('https://google.com')
            ], 'https://google.com')
          ]))
      })
    })


    describe('A link with no content and no URL', () => {
      it('produces no syntax nodes', () => {
        expect(Up.toAst('Hello, [][]!')).to.be.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('Hello, !')
          ]))
      })
    })
  })


  context("Due to the nature of the raised voice syntax, raised voices cannot be empty.", () => {
    context("Delimiters containing only whitespace are preserved as plain text", () => {
      specify('Emphasis', () => {
        expect(Up.toAst('* \t \t *')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('* \t \t *')
          ]))
      })

      specify('Stress', () => {
        expect(Up.toAst('**\t  \t**')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('**\t  \t**')
          ]))
      })

      specify('Shouting (emphasis and stress together)', () => {
        expect(Up.toAst('*** \t \t ***')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('*** \t \t ***')
          ]))
      })

      specify('Shouting with imbalanced delimiters', () => {
        expect(Up.toAst('*****\t  \t***')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('*****\t  \t***')
          ]))
      })
    })

    context("Lone unmatched delimiters are preserved as plain text, too. This includes delimiters of", () => {

      specify('1 character', () => {
        expect(Up.toAst('*')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('*')
          ]))
      })

      specify('2 characters', () => {
        expect(Up.toAst('**')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('**')
          ]))
      })

      specify('3 characters', () => {
        expect(Up.toAst('***')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('***')
          ]))
      })

      specify('4 characters', () => {
        expect(Up.toAst('****')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('****')
          ]))
      })
    })
  })
})


describe('Revision insertion containing an empty revision deletion', () => {
  it('produces a revision insertion convention containing the plain text delimiters of revision deletion', () => {
    expect(Up.toAst('I built a trail: ++~~~~++')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I built a trail: '),
        new RevisionInsertionNode([
          new PlainTextNode('~~~~')
        ])
      ])
    )
  })
})