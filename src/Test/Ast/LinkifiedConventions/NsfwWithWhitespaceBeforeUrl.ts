import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'


context('A linkified NSFW convention can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'NSFW: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'app:wiki/terrible-thing',
      toProduce: insideDocumentAndParagraph([
        new NsfwNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], 'app:wiki/terrible-thing')
        ])
      ])
    })
  })


  describe('When the URL has a scheme, the URL', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'NSFW: Advance Wars',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new NsfwNode([
            new LinkNode([
              new PlainTextNode('Advance Wars')
            ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toAst('[NSFW: something terrible] (https://stackoverflow.com is nice)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
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
      expect(Up.toAst('[NSFW: email] (mailto:)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
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
      expect(Up.toAst('[NSFW: local files] (file:///)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
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
        contentToWrapInBrackets: 'NSFW: spooky phone call',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'tel:5555555555',
        toProduce: insideDocumentAndParagraph([
          new NsfwNode([
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
      contentToWrapInBrackets: 'NSFW: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: '/wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new NsfwNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], '/wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      expect(Up.toAst('[NSFW: something terrible] (/r9k/ created it)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
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
      expect(Up.toAst('[NSFW: slash] (/)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
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
        contentToWrapInBrackets: 'NSFW: Model 3 theft',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '/3',
        toProduce: insideDocumentAndParagraph([
          new NsfwNode([
            new LinkNode([
              new PlainTextNode('Model 3 theft')
            ], '/3')
          ])
        ])
      })
    })

    specify('must not have its slash escaped', () => {
      expect(Up.toAst('[NSFW: yeah] (\\/r9k/)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(/r9k/)')
          ]),
        ])
      )
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'NSFW: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: '#wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new NsfwNode([
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
        contentToWrapInBrackets: 'NSFW: Model 3 theft',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '#3',
        toProduce: insideDocumentAndParagraph([
          new NsfwNode([
            new LinkNode([
              new PlainTextNode('Model 3 theft')
            ], '#3')
          ])
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.toAst('[NSFW: hash mark] (#)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
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
      expect(Up.toAst('[NSFW: something terrible] (#starcraft2 was never trending)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
            new PlainTextNode('something terrible')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#starcraft2 was never trending)')
          ]),
        ])
      )
    })

    it('must not have its hashmark escaped', () => {
      expect(Up.toAst('[NSFW: yeah] (\\#starcraft2)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#starcraft2)')
          ]),
        ])
      )
    })
  })


  specify('It has a top-level domain', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'NSFW: Chrono Trigger',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'chrono-trigger.wiki',
      toProduce: insideDocumentAndParagraph([
        new NsfwNode([
          new LinkNode([
            new PlainTextNode('Chrono Trigger')
          ], 'https://chrono-trigger.wiki')
        ])
      ])
    })
  })


  describe('When the URL merely has a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'NSFW: Advance Wars',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new NsfwNode([
            new LinkNode([
              new PlainTextNode('Advance Wars')
            ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryCombinationOfBrackets({
        contentToWrapInBrackets: 'NSFW: Advance Wars',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'advancewars.wikia.com/',
        toProduce: insideDocumentAndParagraph([
          new NsfwNode([
            new LinkNode([
              new PlainTextNode('Advance Wars')
            ], 'https://advancewars.wikia.com/')
          ])
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      expect(Up.toAst('[NSFW: email] (\\mailto:daniel@wants.email)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
            new PlainTextNode('email')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(mailto:daniel@wants.email)')
          ]),
        ])
      )
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      expect(Up.toAst('[NSFW: that place] (4chan.org--terrifying)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
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
        contentToWrapInBrackets: 'NSFW: Good luck!',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '88.8888.cn',
        toProduce: insideDocumentAndParagraph([
          new NsfwNode([
            new LinkNode([
              new PlainTextNode('Good luck!')
            ], 'https://88.8888.cn')
          ])
        ])
      })
    })

    context('The top-level domain must contain only letters ', () => {
      specify('No numbers', () => {
        expect(Up.toAst('[NSFW: username] (john.e.smith5)')).to.be.eql(
          insideDocumentAndParagraph([
            new NsfwNode([
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
        expect(Up.toAst('[NSFW: username] (john.e.smith-kline)')).to.be.eql(
          insideDocumentAndParagraph([
            new NsfwNode([
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
      expect(Up.toAst('[NSFW: top-level domain] (.co.uk)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
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
      expect(Up.toAst('[NSFW: Ash is not his own father] (um..uh)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
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
      expect(Up.toAst('[NSFW: debilitating sadness] (4chan.org../r9k/)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
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
        contentToWrapInBrackets: 'NSFW: rocket ship',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'example.com/321...blastoff/1',
        toProduce: insideDocumentAndParagraph([
          new NsfwNode([
            new LinkNode([
              new PlainTextNode('rocket ship')
            ], 'https://example.com/321...blastoff/1')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toAst('[NSFW: yeah] (ign.com had some hilarious forums)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(ign.com had some hilarious forums)')
          ]),
        ])
      )
    })

    specify('the domain part must not be escaped', () => {
      expect(Up.toAst('[NSFW: yeah] (\\ign.com)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(ign.com)')
          ]),
        ])
      )
    })
  })


  specify('If none of the conditions are satisfied, the NSFW convention is not linkified', () => {
    expect(Up.toAst('[NSFW: something terrible] (really)')).to.be.eql(
      insideDocumentAndParagraph([
        new NsfwNode([
          new PlainTextNode('something terrible')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('(really)')
        ]),
      ]))
  })
})


describe('If there is nothing but whitspace between a NSFW convention and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the NSFW convention is not linkified', () => {
    expect(Up.toAst('[NSFW: something terrible]  \\  (https://example.com)')).to.be.eql(
      insideDocumentAndParagraph([
        new NsfwNode([
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


describe("A NSFW convention's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped with a backslash ', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'NSFW: something terrible',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'https://stackoverflow.com/search=something\\ very\\ terrible',
      toProduce: insideDocumentAndParagraph([
        new NsfwNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], 'https://stackoverflow.com/search=something very terrible')
        ])
      ])
    })
  })
})
