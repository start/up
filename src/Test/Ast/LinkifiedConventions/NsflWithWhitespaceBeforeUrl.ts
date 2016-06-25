import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { NsflNode } from '../../../SyntaxNodes/NsflNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../../SyntaxNodes/ActionNode'


context('A linkified NSFL convention can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'NSFL: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'app:wiki/terrible-thing',
      toProduce: insideDocumentAndParagraph([
        new NsflNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], 'app:wiki/terrible-thing')
        ])
      ])
    })
  })


  describe('When the URL has a scheme, the URL', () => {
    specify('the top-level domain may be followed by a slash and a resource path ', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'NSFL: Advance Wars',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new NsflNode([
            new LinkNode([
              new PlainTextNode('Advance Wars')
            ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toAst('[NSFL: something terrible] (https://stackoverflow.com is nice)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsflNode([
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

    specify('there must be somethng after the scheme', () => {
      expect(Up.toAst('[NSFL: email] (mailto:)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsflNode([
            new PlainTextNode('email')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(mailto:)')
          ]),
        ])
      )
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.toAst('[NSFL: local files] (file:///)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsflNode([
            new PlainTextNode('local files')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(file:///)')
          ]),
        ])
      )
    })

    specify('the rest of the URL can consist solely of digits', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'NSFL: spooky phone call',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'tel:5555555555',
        toProduce: insideDocumentAndParagraph([
          new NsflNode([
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
      contentToWrapInBrackets: 'NSFL: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: '/wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new NsflNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], '/wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      expect(Up.toAst('[NSFL: something terrible] (/r9k/ created it)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsflNode([
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
      expect(Up.toAst('[NSFL: slash] (/)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsflNode([
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
        contentToWrapInBrackets: 'NSFL: Model 3 theft',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '/3',
        toProduce: insideDocumentAndParagraph([
          new NsflNode([
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
      contentToWrapInBrackets: 'NSFL: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: '#wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new NsflNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], '#wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'NSFL: Model 3 theft',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '#3',
        toProduce: insideDocumentAndParagraph([
          new NsflNode([
            new LinkNode([
              new PlainTextNode('Model 3 theft')
            ], '#3')
          ])
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.toAst('[NSFL: hash mark] (#)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsflNode([
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
      expect(Up.toAst('[NSFL: something terrible] (#starcraft2 was never trending)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsflNode([
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


  specify('If none of the conditions are satisfied, the NSFL convention is not linkified', () => {
    expect(Up.toAst('[NSFL: something terrible] (really)')).to.be.eql(
      insideDocumentAndParagraph([
        new NsflNode([
          new PlainTextNode('something terrible')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('(really)')
        ]),
      ]))
  })
})


describe('If there is nothing but whitspace between a NSFL convention and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the NSFL convention is not linkified', () => {
    expect(Up.toAst('[NSFL: something terrible]  \\  (https://example.com)')).to.be.eql(
      insideDocumentAndParagraph([
        new NsflNode([
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


describe("A NSFL convention's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped with a backslash ', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'NSFL: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'https://stackoverflow.com/search=something\\ very\\ terrible',
      toProduce: insideDocumentAndParagraph([
        new NsflNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], 'https://stackoverflow.com/search=something very terrible')
        ])
      ])
    })
  })
})
