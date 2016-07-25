import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../../Helpers'
import { LinkNode } from '../../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'
import { ParenthesizedNode } from '../../../../SyntaxNodes/ParenthesizedNode'
import { InlineNsflNode } from '../../../../SyntaxNodes/InlineNsflNode'


context('A linkified NSFL convention can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFL: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'app:wiki/terrible-thing',
      toProduce: insideDocumentAndParagraph([
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], 'app:wiki/terrible-thing')
        ])
      ])
    })
  })


  describe('When the URL has a scheme, the URL', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFL: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new InlineNsflNode([
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
          new InlineNsflNode([
            new PlainTextNode('something terrible')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('('),
            new LinkNode([
              new PlainTextNode('stackoverflow.com')
            ], 'https://stackoverflow.com'),
            new PlainTextNode(' is nice)')
          ])
        ]))
    })

    specify('there must be somethng after the scheme', () => {
      expect(Up.toAst('[NSFL: email] (mailto:)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('email')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(mailto:)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.toAst('[NSFL: local files] (file:///)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('local files')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(file:///)')
          ])
        ]))
    })

    specify('the rest of the URL can consist solely of digits', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFL: spooky phone call',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'tel:5555555555',
        toProduce: insideDocumentAndParagraph([
          new InlineNsflNode([
            new LinkNode([
              new PlainTextNode('spooky phone call')
            ], 'tel:5555555555')
          ])
        ])
      })
    })
  })


  specify('It starts with a slash', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFL: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '/wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new InlineNsflNode([
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
          new InlineNsflNode([
            new PlainTextNode('something terrible')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(/r9k/ created it)')
          ])
        ]))
    })

    it('must have something after the slash', () => {
      expect(Up.toAst('[NSFL: slash] (/)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('slash')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(/)')
          ])
        ]))
    })

    it('can consist solely of digits after the slash', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFL: Model 3 theft',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '/3',
        toProduce: insideDocumentAndParagraph([
          new InlineNsflNode([
            new LinkNode([
              new PlainTextNode('Model 3 theft')
            ], '/3')
          ])
        ])
      })
    })

    specify('must not have its slash escaped', () => {
      expect(Up.toAst('[NSFL: yeah] (\\/r9k/)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(/r9k/)')
          ]),
        ]))
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFL: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '#wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], '#wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFL: Model 3 theft',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '#3',
        toProduce: insideDocumentAndParagraph([
          new InlineNsflNode([
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
          new InlineNsflNode([
            new PlainTextNode('hash mark')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#)')
          ])
        ]))
    })

    it('must not contain any spaces', () => {
      expect(Up.toAst('[NSFL: something terrible] (#starcraft2 was never trending)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('something terrible')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#starcraft2 was never trending)')
          ])
        ]))
    })

    it('must not have its hashmark escaped', () => {
      expect(Up.toAst('[NSFL: yeah] (\\#starcraft2)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#starcraft2)')
          ])
        ]))
    })
  })


  specify('It has a top-level domain', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFL: Chrono Trigger',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'chrono-trigger.wiki',
      toProduce: insideDocumentAndParagraph([
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('Chrono Trigger')
          ], 'https://chrono-trigger.wiki')
        ])
      ])
    })
  })


  describe('When the URL merely has a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFL: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new InlineNsflNode([
            new LinkNode([
              new PlainTextNode('Advance Wars')
            ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFL: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/',
        toProduce: insideDocumentAndParagraph([
          new InlineNsflNode([
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
          new InlineNsflNode([
            new PlainTextNode('that place')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(4chan.org--terrifying)')
          ])
        ]))
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFL: Good luck!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '88.8888.cn',
        toProduce: insideDocumentAndParagraph([
          new InlineNsflNode([
            new LinkNode([
              new PlainTextNode('Good luck!')
            ], 'https://88.8888.cn')
          ])
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      expect(Up.toAst('[NSFL: email] (\\mailto:daniel@wants.email)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('email')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(mailto:daniel@wants.email)')
          ])
        ]))
    })


    context('The top-level domain must contain only letters ', () => {
      specify('No numbers', () => {
        expect(Up.toAst('[NSFL: username] (john.e.smith5)')).to.be.eql(
          insideDocumentAndParagraph([
            new InlineNsflNode([
              new PlainTextNode('username')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(john.e.smith5)')
            ]),
          ]))
      })

      specify('No hyphens', () => {
        expect(Up.toAst('[NSFL: username] (john.e.smith-kline)')).to.be.eql(
          insideDocumentAndParagraph([
            new InlineNsflNode([
              new PlainTextNode('username')
            ]),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(john.e.smith-kline)')
            ])
          ]))
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      expect(Up.toAst('[NSFL: top-level domain] (.co.uk)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('top-level domain')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(.co.uk)')
          ])
        ]))
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      expect(Up.toAst('[NSFL: Ash is not his own father] (um..uh)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('Ash is not his own father')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(um..uh)')
          ])
        ]))
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      expect(Up.toAst('[NSFL: debilitating sadness] (4chan.org../r9k/)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('debilitating sadness')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(4chan.org../r9k/)')
          ])
        ]))
    })

    specify('the URL may have consecutive periods before the top-level domain after the slash that indicates the start of the resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFL: rocket ship',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'example.com/321...blastoff/1',
        toProduce: insideDocumentAndParagraph([
          new InlineNsflNode([
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
          new InlineNsflNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(ign.com had some hilarious forums)')
          ])
        ]))
    })

    specify('the domain part must not be escaped', () => {
      expect(Up.toAst('[NSFL: yeah] (\\ign.com)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('yeah')
          ]),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(ign.com)')
          ]),
        ]))
    })
  })


  specify('If none of the conditions are satisfied, the NSFL convention is not linkified', () => {
    expect(Up.toAst('[NSFL: something terrible] (really)')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineNsflNode([
          new PlainTextNode('something terrible')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('(really)')
        ])
      ]))
  })
})


describe('If there is nothing but whitspace between an inline NSFL convention and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the NSFL convention is not linkified', () => {
    expect(Up.toAst('[NSFL: something terrible]  \\  (https://example.com)')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineNsflNode([
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


describe("A linkified NSFL convention's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFL: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'stackoverflow.com/search=something\\ very\\ terrible',
      toProduce: insideDocumentAndParagraph([
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('something terrible')
          ], 'https://stackoverflow.com/search=something very terrible')
        ])
      ])
    })
  })
})
