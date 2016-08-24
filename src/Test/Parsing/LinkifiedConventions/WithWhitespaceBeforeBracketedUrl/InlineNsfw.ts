import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../../Helpers'
import { Link } from '../../../../SyntaxNodes/Link'
import { PlainText } from '../../../../SyntaxNodes/PlainText'
import { NormalParenthetical } from '../../../../SyntaxNodes/NormalParenthetical'
import { InlineNsfw } from '../../../../SyntaxNodes/InlineNsfw'


context('A linkified NSFW convention can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFW: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'app:wiki/terrible-thing',
      toProduce: insideDocumentAndParagraph([
        new InlineNsfw([
          new Link([
            new PlainText('something terrible')
          ], 'app:wiki/terrible-thing')
        ])
      ])
    })
  })


  context('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFW: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new InlineNsfw([
            new Link([
              new PlainText('Advance Wars')
            ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toDocument('[NSFW: something terrible] (https://stackoverflow.com is nice)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('something terrible')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('('),
            new Link([
              new PlainText('stackoverflow.com')
            ], 'https://stackoverflow.com'),
            new PlainText(' is nice)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme', () => {
      expect(Up.toDocument('[NSFW: email] (mailto:)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('email')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(mailto:)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.toDocument('[NSFW: local files] (file:///)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('local files')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(file:///)')
          ]),
        ]))
    })

    specify('the rest of the URL can consist solely of digits', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFW: spooky phone call',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'tel:5555555555',
        toProduce: insideDocumentAndParagraph([
          new InlineNsfw([
            new Link([
              new PlainText('spooky phone call')
            ], 'tel:5555555555')
          ])
        ])
      })
    })
  })


  specify('It starts with a slash', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFW: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '/wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new InlineNsfw([
          new Link([
            new PlainText('something terrible')
          ], '/wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      expect(Up.toDocument('[NSFW: something terrible] (/r9k/ created it)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('something terrible')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(/r9k/ created it)')
          ]),
        ]))
    })

    it('must have something after the slash', () => {
      expect(Up.toDocument('[NSFW: slash] (/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('slash')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(/)')
          ]),
        ]))
    })

    it('can consist solely of digits after the slash', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFW: Model 3 theft',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '/3',
        toProduce: insideDocumentAndParagraph([
          new InlineNsfw([
            new Link([
              new PlainText('Model 3 theft')
            ], '/3')
          ])
        ])
      })
    })

    it('must not have its slash escaped', () => {
      expect(Up.toDocument('[NSFW: yeah] (\\/r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('yeah')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(/r9k/)')
          ]),
        ]))
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFW: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '#wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new InlineNsfw([
          new Link([
            new PlainText('something terrible')
          ], '#wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFW: Model 3 theft',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '#3',
        toProduce: insideDocumentAndParagraph([
          new InlineNsfw([
            new Link([
              new PlainText('Model 3 theft')
            ], '#3')
          ])
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.toDocument('[NSFW: hash mark] (#)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('hash mark')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(#)')
          ]),
        ]))
    })

    it('must not contain any spaces', () => {
      expect(Up.toDocument('[NSFW: something terrible] (#starcraft2 was never trending)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('something terrible')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(#starcraft2 was never trending)')
          ]),
        ]))
    })

    it('must not have its hashmark escaped', () => {
      expect(Up.toDocument('[NSFW: yeah] (\\#starcraft2)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('yeah')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(#starcraft2)')
          ]),
        ]))
    })
  })


  specify('It has a top-level domain', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFW: Chrono Trigger',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'chrono-trigger.wiki',
      toProduce: insideDocumentAndParagraph([
        new InlineNsfw([
          new Link([
            new PlainText('Chrono Trigger')
          ], 'https://chrono-trigger.wiki')
        ])
      ])
    })
  })


  describe('When the URL merely has a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFW: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new InlineNsfw([
            new Link([
              new PlainText('Advance Wars')
            ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFW: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/',
        toProduce: insideDocumentAndParagraph([
          new InlineNsfw([
            new Link([
              new PlainText('Advance Wars')
            ], 'https://advancewars.wikia.com/')
          ])
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      expect(Up.toDocument('[NSFW: email] (\\mailto:daniel@wants.email)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('email')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(mailto:daniel@wants.email)')
          ]),
        ]))
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      expect(Up.toDocument('[NSFW: that place] (4chan.org-terrifying)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('that place')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(4chan.org-terrifying)')
          ]),
        ]))
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFW: Good luck!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '88.8888.cn',
        toProduce: insideDocumentAndParagraph([
          new InlineNsfw([
            new Link([
              new PlainText('Good luck!')
            ], 'https://88.8888.cn')
          ])
        ])
      })
    })

    context('The top-level domain must contain only letters', () => {
      specify('No numbers', () => {
        expect(Up.toDocument('[NSFW: username] (john.e.smith5)')).to.deep.equal(
          insideDocumentAndParagraph([
            new InlineNsfw([
              new PlainText('username')
            ]),
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(john.e.smith5)')
            ]),
          ]))
      })

      specify('No hyphens', () => {
        expect(Up.toDocument('[NSFW: username] (john.e.smith-kline)')).to.deep.equal(
          insideDocumentAndParagraph([
            new InlineNsfw([
              new PlainText('username')
            ]),
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(john.e.smith-kline)')
            ]),
          ]))
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      expect(Up.toDocument('[NSFW: top-level domain] (.co.uk)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('top-level domain')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(.co.uk)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      expect(Up.toDocument('[NSFW: Ash is not his own father] (um..uh)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('Ash is not his own father')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(um..uh)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      expect(Up.toDocument('[NSFW: debilitating sadness] (4chan.org../r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('debilitating sadness')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(4chan.org../r9k/)')
          ]),
        ]))
    })

    specify('the URL may have consecutive periods before the top-level domain after the slash that indicates the start of the resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'NSFW: rocket ship',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'example.com/321...blastoff/1',
        toProduce: insideDocumentAndParagraph([
          new InlineNsfw([
            new Link([
              new PlainText('rocket ship')
            ], 'https://example.com/321...blastoff/1')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toDocument('[NSFW: yeah] (ign.com had some hilarious forums)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('yeah')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(ign.com had some hilarious forums)')
          ]),
        ]))
    })

    specify('the domain part must not be escaped', () => {
      expect(Up.toDocument('[NSFW: yeah] (\\ign.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('yeah')
          ]),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(ign.com)')
          ]),
        ]))
    })
  })


  specify('If none of the conditions are satisfied, the NSFW convention is not linkified', () => {
    expect(Up.toDocument('[NSFW: something terrible] (really)')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineNsfw([
          new PlainText('something terrible')
        ]),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('(really)')
        ]),
      ]))
  })
})


describe('If there is nothing but whitspace between an inline NSFW convention and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the NSFW convention is not linkified', () => {
    expect(Up.toDocument('[NSFW: something terrible]  \\  (https://example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineNsfw([
          new PlainText('something terrible')
        ]),
        new PlainText('    '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com')
          ], 'https://example.com'),
          new PlainText(')')
        ])
      ]))
  })
})


describe("A linkified NSFW convention's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFW: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'stackoverflow.com/search=something\\ very\\ terrible',
      toProduce: insideDocumentAndParagraph([
        new InlineNsfw([
          new Link([
            new PlainText('something terrible')
          ], 'https://stackoverflow.com/search=something very terrible')
        ])
      ])
    })
  })
})
