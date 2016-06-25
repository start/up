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


context('A linkified spoiler can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'SPOILER: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'app:wiki/terrible-thing',
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

    it('must have something after the scheme', () => {
      expect(Up.toAst('[SPOILER: email] (mailto:)')).to.be.eql(
        insideDocumentAndParagraph([
          new SpoilerNode([
            new PlainTextNode('email')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(mailto:)')
          ]),
        ])
      )
    })

    it('must have something after the scheme beyond only slashes', () => {
      expect(Up.toAst('[SPOILER: local files] (file:///)')).to.be.eql(
        insideDocumentAndParagraph([
          new SpoilerNode([
            new PlainTextNode('local files')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(file:///)')
          ]),
        ])
      )
    })

    it('can consisting solely of digits after the scheme', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'SPOILER: spooky phone call',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'tel:5555555555',
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


  specify('It starts with a slash', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'SPOILER: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: '/wiki/something-terrible',
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

    it('must have something after the slash', () => {
      expect(Up.toAst('[SPOILER: slash] (/)')).to.be.eql(
        insideDocumentAndParagraph([
          new SpoilerNode([
            new PlainTextNode('slash')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(/)')
          ]),
        ])
      )
    })

    it('can consist solely of digits after the slash', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'SPOILER: Model 3 theft',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '/3',
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


  specify('It starts with a hash mark ("#")', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'SPOILER: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: '#wiki/something-terrible',
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

    it('may consist solely of digits if one of the digits is escaped', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'SPOILER: something terrible',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '#1\\50',
        toProduce: insideDocumentAndParagraph([
          new SpoilerNode([
            new LinkNode([
              new PlainTextNode('something terrible')
            ], '#150')
          ])
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.toAst('[SPOILER: hash mark] (#)')).to.be.eql(
        insideDocumentAndParagraph([
          new SpoilerNode([
            new PlainTextNode('hash mark')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#)')
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


  specify('If none of the conditions are satisfied, the spoiler is not linkified', () => {
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


describe('If there is nothing but whitspace between a spoiler and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the SPOILER convention is not linkified', () => {
    expect(Up.toAst('[SPOILER: something terrible]  \\  (https://example.com)')).to.be.eql(
      insideDocumentAndParagraph([
        new SpoilerNode([
          new PlainTextNode('something terrible')
        ]),
        new PlainTextNode('    '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')')
        ])
      ]))
  })
})


describe("A spoiler's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped with a backslash ', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'SPOILER: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'https://stackoverflow.com/search=something\\ very\\ terrible',
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
