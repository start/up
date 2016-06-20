import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../../SyntaxNodes/ActionNode'


context('A linkified spoiler can have whitespace between itself and its bracketed URL only under certain conditions.', () => {

  context('If the URL does not have a scheme, does not start with a slash, or does not start with a hash mark ("#")', () => {
    specify('we assume the author did not indent to produce a link, so the spoiler node is not linkified', () => {
      expect(Up.toAst('[SPOILER: something terrible] (really)')).to.be.eql(
        insideDocumentAndParagraph([
          new SpoilerNode([
            new PlainTextNode('something terrible')
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
        firstPartToWrapInBrackets: 'SPOILER: something terrible',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        secondPartToWrapInBrackets: 'app:wiki/terrible-thing',
        toProduce: insideDocumentAndParagraph([
          new SpoilerNode([
            new LinkNode([
              new PlainTextNode('something terrible')
            ], 'app:wiki/terrible-thing')
          ])
        ])
      })
    })


    describe('When the URL has a scheme, the URL', () => {
      it('must not contain any spaces', () => {
        expect(Up.toAst('[SPOILER: something terrible] (https://stackoverflow.com is nice)')).to.be.eql(
          insideDocumentAndParagraph([
            new SpoilerNode([
              new PlainTextNode('something terrible')
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
          firstPartToWrapInBrackets: 'SPOILER: spooky phone call',
          partsToPutInBetween: ['  ', '\t', ' \t '],
          secondPartToWrapInBrackets: 'tel:5555555555',
          toProduce: insideDocumentAndParagraph([
            new SpoilerNode([
              new LinkNode([
                new PlainTextNode('spooky phone call')
              ], 'tel:5555555555')
            ])
          ])
        })
      })
    })


    specify('it starts with a slash', () => {
      expectEveryCombinationOfBrackets({
        firstPartToWrapInBrackets: 'SPOILER: something terrible',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        secondPartToWrapInBrackets: '/wiki/something-terrible',
        toProduce: insideDocumentAndParagraph([
          new SpoilerNode([
            new LinkNode([
              new PlainTextNode('something terrible')
            ], '/wiki/something-terrible')
          ])
        ])
      })
    })


    describe('When the URL starts with a slash, the URL', () => {
      it('must not contain any spaces', () => {
        expect(Up.toAst('[SPOILER: something terrible] (/r9k/ created it)')).to.be.eql(
          insideDocumentAndParagraph([
            new SpoilerNode([
              new PlainTextNode('something terrible')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(/r9k/ created it)')
            ]),
          ])
        )
      })

      specify('can consist solely of digits after the slash', () => {
        expectEveryCombinationOfBrackets({
          firstPartToWrapInBrackets: 'SPOILER: Model 3 theft',
          partsToPutInBetween: ['  ', '\t', ' \t '],
          secondPartToWrapInBrackets: '/3',
          toProduce: insideDocumentAndParagraph([
            new SpoilerNode([
              new LinkNode([
                new PlainTextNode('Model 3 theft')
              ], '/3')
            ])
          ])
        })
      })
    })


    specify('it starts with a hash mark ("#")', () => {
      expectEveryCombinationOfBrackets({
        firstPartToWrapInBrackets: 'SPOILER: something terrible',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        secondPartToWrapInBrackets: '#wiki/something-terrible',
        toProduce: insideDocumentAndParagraph([
          new SpoilerNode([
            new LinkNode([
              new PlainTextNode('something terrible')
            ], '#wiki/something-terrible')
          ])
        ])
      })
    })


    describe('When the URL starts with a hash mark ("#"), the URL', () => {
      it('must not otherwise consist solely of digits', () => {
        expect(Up.toAst('[SPOILER: something terrible] (#14)')).to.be.eql(
          insideDocumentAndParagraph([
            new SpoilerNode([
              new PlainTextNode('something terrible')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(#14)')
            ]),
          ])
        )
      })

      it('must not contain any spaces', () => {
        expect(Up.toAst('[SPOILER: something terrible] (#starcraft2 was never trending)')).to.be.eql(
          insideDocumentAndParagraph([
            new SpoilerNode([
              new PlainTextNode('something terrible')
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


describe("A spoiler's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped with a backslash ', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'SPOILER: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      secondPartToWrapInBrackets: 'https://stackoverflow.com/search=something\\ very\\ terrible',
      toProduce: insideDocumentAndParagraph([
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], 'https://stackoverflow.com/search=something very terrible')
        ])
      ])
    })
  })
})