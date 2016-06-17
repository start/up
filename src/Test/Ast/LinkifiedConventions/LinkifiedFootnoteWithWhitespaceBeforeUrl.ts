import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../../SyntaxNodes/ActionNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'



const FOOTNOTE_BRACKETS = [
  { open: '((', close: '))' },
  { open: '[[', close: ']]' },
  { open: '{{', close: '}}' }
]


context('A linkified footnote can have whitespace between its content and bracketed URL under certain conditions.', () => {

  context('If the URL does not have a scheme, does not start with a slash, or does not start with a hash mark ("#")', () => {
    specify('we assume the author did not indent to produce a link, so the footnote is not linkified', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('the phone was dead')
      ], 1)

      expect(Up.toAst('((the phone was dead)) (really)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(really)')
            ]),
          ]),
          new FootnoteBlockNode([footnote])
        ]))
    })
  })


  context('More specifically, the URL must satisfy one of the following conditions:', () => {
    context('It has a scheme', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('the phone was dead')
        ], 'tel:555-555-5555')
      ], 1)

      expectEveryCombinationOfBrackets({
        bracketsForFirstPart: FOOTNOTE_BRACKETS,
        firstPartToWrapInBrackets: 'the phone was dead',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        secondPartToWrapInBrackets: 'tel:555-555-5555',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote]),
          new FootnoteBlockNode([footnote])
        ])
      })

      specify('and does not contain any spaces', () => {
        const footnote = new FootnoteNode([
          new PlainTextNode('the phone was dead')
        ], 1)

        expect(Up.toAst('((the phone was dead)) (https://stackoverflow.com is where I learned)')).to.be.eql(
          new DocumentNode([
            new ParagraphNode([
              footnote,
              new PlainTextNode(' '),
              new ParenthesizedNode([
                new PlainTextNode('('),
                new LinkNode([
                  new PlainTextNode('stackoverflow.com')
                ], 'https://stackoverflow.com'),
                new PlainTextNode(' is nice)')
              ]),
            ]),
            new FootnoteBlockNode([footnote])
          ])
        )
      })

      specify('but it can consisting solely of digits after the scheme', () => {
        const footnote = new FootnoteNode([
          new LinkNode([
            new PlainTextNode('the phone was dead')
          ], 'tel:5555555555')
        ], 1)

        expectEveryCombinationOfBrackets({
          bracketsForFirstPart: FOOTNOTE_BRACKETS,
          firstPartToWrapInBrackets: 'the phone was dead',
          partsToPutInBetween: ['  ', '\t', ' \t '],
          secondPartToWrapInBrackets: 'tel:5555555555',
          toProduce: new DocumentNode([
            new ParagraphNode([footnote]),
            new FootnoteBlockNode([footnote])
          ])
        })
      })
    })


    context('It starts with a slash', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('the phone was dead')
        ], '/wiki/dead-phone')
      ], 1)

      expectEveryCombinationOfBrackets({
        bracketsForFirstPart: FOOTNOTE_BRACKETS,
        firstPartToWrapInBrackets: 'Chrono Trigger',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        secondPartToWrapInBrackets: '/wiki/dead-phone',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote]),
          new FootnoteBlockNode([footnote])
        ])
      })

      specify('and does not contain any spaces', () => {
        const footnote = new FootnoteNode([
          new PlainTextNode('the phone was dead')
        ], 1)

        expect(Up.toAst('((the phone was dead)) (/r9k/ was talking about it)')).to.be.eql(
          new DocumentNode([
            new ParagraphNode([
              footnote,
              new PlainTextNode(' '),
              new ParenthesizedNode([
                new PlainTextNode('(/r9k/ was talking about it)'),
              ]),
            ]),
            new FootnoteBlockNode([footnote])
          ])
        )
      })

      specify('but it can consist solely of digits after the slash', () => {
        expectEveryCombinationOfBrackets({
          bracketsForFirstPart: FOOTNOTE_BRACKETS,
          firstPartToWrapInBrackets: 'the phone was dead',
          partsToPutInBetween: ['  ', '\t', ' \t '],
          secondPartToWrapInBrackets: '/5555555555',
          toProduce: insideDocumentAndParagraph([
            new LinkNode([
              new PlainTextNode('Model 3')
            ], '/3')
          ])
        })
      })
    })


    context('It starts with a hash mark ("#")', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('the phone was dead')
        ], '#wiki/dead-phone')
      ], 1)

      expectEveryCombinationOfBrackets({
        bracketsForFirstPart: FOOTNOTE_BRACKETS,
        firstPartToWrapInBrackets: 'the phone was dead',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        secondPartToWrapInBrackets: '#wiki/dead-phone',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote,]),
          new FootnoteBlockNode([footnote])
        ])
      })

      specify('and does not otherwise consist solely of digits', () => {
        const footnote = new FootnoteNode([
          new PlainTextNode('the phone was dead')
        ], 1)

        expect(Up.toAst('((the phone was dead)) (#14)')).to.be.eql(
          new DocumentNode([
            new ParagraphNode([
              footnote,
              new ParenthesizedNode([
                new PlainTextNode('(#14)')
              ]),
            ]),
            new FootnoteBlockNode([footnote])
          ])
        )
      })

      specify('and does not contain any spaces', () => {
        const footnote = new FootnoteNode([
          new PlainTextNode('the game was dead')
        ], 1)

        expect(Up.toAst('((the game was dead)) (#starcraft2 was never trending)')).to.be.eql(
          new DocumentNode([
            new ParagraphNode([
              footnote,
              new PlainTextNode(' '),
              new ParenthesizedNode([
                new PlainTextNode('(#starcraft2 was never trending)')
              ]),
            ]),
            new FootnoteBlockNode([footnote])
          ])
        )
      })
    })
  })
})


describe("A linkified footnote's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped with a backslash ', () => {
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('the phone was dead')
      ], 'https://example.com/search=phone was dead')
    ], 1)

    expectEveryCombinationOfBrackets({
      bracketsForFirstPart: FOOTNOTE_BRACKETS,
      firstPartToWrapInBrackets: 'the phone was dead',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      secondPartToWrapInBrackets: 'https://example.com/search=phone\\ was\\ dead',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote,]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })
})