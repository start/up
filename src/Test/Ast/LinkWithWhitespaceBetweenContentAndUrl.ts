import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'


context('A link can have whitespace between its bracketed content and bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'email me',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'mailto:daniel@wants.email',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('email me')
        ], 'mailto:daniel@wants.email')
      ])
    })
  })


  describe('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path ', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'Advance Wars',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('Advance Wars')
          ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
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

    specify('there must be somethng after the scheme', () => {
      expect(Up.toAst('[email] (mailto:)')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[email]')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(mailto:)')
          ]),
        ])
      )
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.toAst('[local files] (file:///)')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[local files]')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(file:///)')
          ]),
        ])
      )
    })

    specify('the rest of the URL can consisting solely of digits', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'call me',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'tel:5555555555',
        toProduce: insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('call me')
          ], 'tel:5555555555')
        ])
      })
    })
  })


  specify('It starts with a slash', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'Chrono Trigger',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: '/wiki/chrono-trigger',
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

    it('must have something after the slash', () => {
      expect(Up.toAst('[slash] (/)')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[slash]')
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
        contentToWrapInBrackets: 'Model 3',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '/3',
        toProduce: insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('Model 3')
          ], '/3')
        ])
      })
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'Chrono Trigger',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: '#wiki/chrono-trigger',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Trigger')
        ], '#wiki/chrono-trigger')
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'Model 3 theft',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '#3',
        toProduce: insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('Model 3 theft')
          ], '#3')
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.toAst('[hash mark] (#)')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[hash mark]')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#)')
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


  specify('It has a top-level domain', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'Chrono Trigger',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'chrono-trigger.wiki',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Trigger')
        ], '#wiki/chrono-trigger')
      ])
    })
  })


  describe('When the URL merely has a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path ', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'Advance Wars',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('Advance Wars')
          ], 'advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the URL may consist solely of digits before the top-level domain', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'Good luck!',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '88.8888.cn',
        toProduce: insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('Model 3 theft')
          ], '#3')
        ])
      })
    })

    context('The top-level domain must contain only letters ', () => {
      specify('No numbers', () => {
        expect(Up.toAst('[username] (john.e.smith5)')).to.be.eql(
          insideDocumentAndParagraph([
            new SquareBracketedNode([
              new PlainTextNode('[hash mark]')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(john.e.smith5)')
            ]),
          ])
        )
      })

      specify('No hyphens', () => {
        expect(Up.toAst('[username] (john.e.smith-kline)')).to.be.eql(
          insideDocumentAndParagraph([
            new SquareBracketedNode([
              new PlainTextNode('[hash mark]')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(john.e.smith-kline)')
            ]),
          ])
        )
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toAst('[yeah] (ign.com had some hilarious forums)')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[yeah]')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(ign.com had some hilarious forums)')
          ]),
        ])
      )
    })
  })


  specify('If none of the conditions are satisfied, no link node is produced', () => {
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


describe('If there is nothing but whitspace between a spoiler and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the spoiler convention is not linkified', () => {
    expect(Up.toAst('[something terrible]  \\  (https://example.com)')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[something terrible]')
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


describe("A link's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped with a backslash ', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'this search',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'https://stackoverflow.com/search=see\\ plus\\ plus',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this search')
        ], 'https://stackoverflow.com/search=see plus plus')
      ])
    })
  })
})
