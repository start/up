import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'


context('A link can have whitespace between its bracketed content and bracketed URL only under certain conditions.', () => {

  context('If the URL does not have a scheme, does not start with a slash, and does not start with a hash mark ("#")', () => {
    specify('we assume the author did not indent to produce a link, so no link node is produced', () => {
      expect(Up.toAst('[no] (really)')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[no]')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(really)')
          ]),
        ]))
    })
  })


  context('More specifically, the URL must satisfy one of the following conditions:', () => {
    specify('it has a scheme', () => {
      expectEveryCombinationOfBrackets({
        firstPartToWrapInBrackets: 'email me',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        secondPartToWrapInBrackets: 'mailto:daniel@wants.email',
        toProduce: insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('email me')
          ], 'mailto:daniel@wants.email')
        ])
      })
    })


    describe('When the URL has a scheme, the URL', () => {
      it('must not contain any spaces', () => {
        expect(Up.toAst('[agreed] (https://stackoverflow.com is nice)')).to.be.eql(
          insideDocumentAndParagraph([
            new SquareBracketedNode([
              new PlainTextNode('[agreed]')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('('),
              new LinkNode([
                new PlainTextNode('stackoverflow.com')
              ], 'https://stackoverflow.com'),
              new PlainTextNode(' is nice)')
            ]),
          ])
        )
      })

      it('can consisting solely of digits after the scheme', () => {
        expectEveryCombinationOfBrackets({
          firstPartToWrapInBrackets: 'call me',
          partsToPutInBetween: ['  ', '\t', ' \t '],
          secondPartToWrapInBrackets: 'tel:5555555555',
          toProduce: insideDocumentAndParagraph([
            new LinkNode([
              new PlainTextNode('call me')
            ], 'tel:5555555555')
          ])
        })
      })
    })


    specify('it starts with a slash', () => {
      expectEveryCombinationOfBrackets({
        firstPartToWrapInBrackets: 'Chrono Trigger',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        secondPartToWrapInBrackets: '/wiki/chrono-trigger',
        toProduce: insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('Chrono Trigger')
          ], '/wiki/chrono-trigger')
        ])
      })
    })


    describe('When the URL starts with a slash, the URL', () => {
      it('must not contain any spaces', () => {
        expect(Up.toAst('[yeah] (/r9k/ inspires geniune pity)')).to.be.eql(
          insideDocumentAndParagraph([
            new SquareBracketedNode([
              new PlainTextNode('[yeah]')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(/r9k/ inspires geniune pity)')
            ]),
          ])
        )
      })

      specify('can consist solely of digits after the slash', () => {
        expectEveryCombinationOfBrackets({
          firstPartToWrapInBrackets: 'Model 3',
          partsToPutInBetween: ['  ', '\t', ' \t '],
          secondPartToWrapInBrackets: '/3',
          toProduce: insideDocumentAndParagraph([
            new LinkNode([
              new PlainTextNode('Model 3')
            ], '/3')
          ])
        })
      })
    })


    specify('it starts with a hash mark ("#")', () => {
      expectEveryCombinationOfBrackets({
        firstPartToWrapInBrackets: 'Chrono Trigger',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        secondPartToWrapInBrackets: '#wiki/chrono-trigger',
        toProduce: insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('Chrono Trigger')
          ], '#wiki/chrono-trigger')
        ])
      })
    })


    describe('When the URL starts with a hash mark ("#"), the URL', () => {
      it('must not otherwise consist solely of digits', () => {
        expect(Up.toAst('[sic] (#14)')).to.be.eql(
          insideDocumentAndParagraph([
            new SquareBracketedNode([
              new PlainTextNode('[sic]')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(#14)')
            ]),
          ])
        )
      })

      it('must not contain any spaces', () => {
        expect(Up.toAst('[yeah] (#starcraft2 was never trending)')).to.be.eql(
          insideDocumentAndParagraph([
            new SquareBracketedNode([
              new PlainTextNode('[yeah]')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(#starcraft2 was never trending)')
            ]),
          ])
        )
      })
    })
  })
})


describe("A link's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped with a backslash ', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'this search',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      secondPartToWrapInBrackets: 'https://stackoverflow.com/search=see\\ plus\\ plus',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this search')
        ], 'https://stackoverflow.com/search=see plus plus')
      ])
    })
  })
})