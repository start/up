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


  specify('It has a top-level domain', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'NSFL: Chrono Trigger',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'chrono-trigger.wiki',
      toProduce: insideDocumentAndParagraph([
        new NsflNode([
          new LinkNode([
            new PlainTextNode('Chrono Trigger')
          ], 'https://chrono-trigger.wiki')
        ])
      ])
    })
  })


  describe('When the URL merely has a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path ', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'NSFL: Advance Wars',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new NsflNode([
            new LinkNode([
              new PlainTextNode('Advance Wars')
            ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'NSFL: Advance Wars',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'advancewars.wikia.com/',
        toProduce: insideDocumentAndParagraph([
          new NsflNode([
            new LinkNode([
              new PlainTextNode('Advance Wars')
            ], 'https://advancewars.wikia.com/')
          ])
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
        expect(Up.toAst('[NSFL: that place] (4chan.org--terrifying)')).to.be.eql(
          insideDocumentAndParagraph([
            new NsflNode([
              new PlainTextNode('that place')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(4chan.org--terrifying)')
            ]),
          ])
        )
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'NSFL: Good luck!',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '88.8888.cn',
        toProduce: insideDocumentAndParagraph([
          new NsflNode([
            new LinkNode([
              new PlainTextNode('Good luck')
            ], 'https://88.8888.cn')
          ])
        ])
      })
    })

    context('The top-level domain must contain only letters ', () => {
      specify('No numbers', () => {
        expect(Up.toAst('[NSFL: username] (john.e.smith5)')).to.be.eql(
          insideDocumentAndParagraph([
            new NsflNode([
              new PlainTextNode('username')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(john.e.smith5)')
            ]),
          ])
        )
      })

      specify('No hyphens', () => {
        expect(Up.toAst('[NSFL: username] (john.e.smith-kline)')).to.be.eql(
          insideDocumentAndParagraph([
            new NsflNode([
              new PlainTextNode('username')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(john.e.smith-kline)')
            ]),
          ])
        )
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      expect(Up.toAst('[NSFL: top-level domain] (.co.uk)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsflNode([
            new PlainTextNode('top-level domain')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(.co.uk)')
          ]),
        ])
      )
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      expect(Up.toAst('[NSFL: Ash is not his own father] (um..uh)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsflNode([
            new PlainTextNode('Ash is not his own father')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(um..uh)')
          ]),
        ])
      )
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      expect(Up.toAst('[NSFL: debilitating sadness] (4chan.org../r9k/)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsflNode([
            new PlainTextNode('debilitating sadness')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(4chan.org../r9k/)')
          ]),
        ])
      )
    })

    specify('the URL may have consecutive periods before the top-level domain after the slash that indicates the start of the resource path', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'NSFL: rocket ship',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'example.com/321...blastoff/1',
        toProduce: insideDocumentAndParagraph([
          new NsflNode([
            new LinkNode([
              new PlainTextNode('rocket ship')
            ], 'https://example.com/321...blastoff/1')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toAst('[NSFL: yeah] (ign.com had some hilarious forums)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsflNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(ign.com had some hilarious forums)')
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
