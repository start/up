import { expect } from 'chai'
import * as Up from '../../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../../Helpers'


context('A linified revealable can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'SPOILER: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'app:wiki/terrible-thing',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('something terrible')
          ], 'app:wiki/terrible-thing')
        ])
      ])
    })
  })


  context('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'SPOILER: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Link([
              new Up.Text('Advance Wars')
            ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.parse('[SPOILER: something terrible] (https://stackoverflow.com is nice)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('something terrible')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('('),
            new Up.Link([
              new Up.Text('stackoverflow.com')
            ], 'https://stackoverflow.com'),
            new Up.Text(' is nice)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme', () => {
      expect(Up.parse('[SPOILER: email] (mailto:)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('email')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(mailto:)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.parse('[SPOILER: local files] (file:///)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('local files')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(file:///)')
          ]),
        ]))
    })

    specify('the rest of the URL can consist solely of digits', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'SPOILER: spooky phone call',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'tel:5555555555',
        toProduce: insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Link([
              new Up.Text('spooky phone call')
            ], 'tel:5555555555')
          ])
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      expect(Up.parse('[SPOILER: email] (\\mailto:daniel@wants.email)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('email')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(mailto:daniel@wants.email)')
          ]),
        ]))
    })
  })


  specify('It starts with a slash', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'SPOILER: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '/wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('something terrible')
          ], '/wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      expect(Up.parse('[SPOILER: something terrible] (/r9k/ created it)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('something terrible')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(/r9k/ created it)')
          ]),
        ]))
    })

    it('must have something after the slash', () => {
      expect(Up.parse('[SPOILER: slash] (/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('slash')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(/)')
          ]),
        ]))
    })

    it('can consist solely of digits after the slash', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'SPOILER: Model 3 theft',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '/3',
        toProduce: insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Link([
              new Up.Text('Model 3 theft')
            ], '/3')
          ])
        ])
      })
    })

    it('must not have its slash escaped', () => {
      expect(Up.parse('[SPOILER: yeah] (\\/r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('yeah')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(/r9k/)')
          ]),
        ]))
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'SPOILER: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '#wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('something terrible')
          ], '#wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'SPOILER: Model 3 theft',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '#3',
        toProduce: insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Link([
              new Up.Text('Model 3 theft')
            ], '#3')
          ])
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.parse('[SPOILER: hash mark] (#)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('hash mark')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(#)')
          ]),
        ]))
    })

    it('must not contain any spaces', () => {
      expect(Up.parse('[SPOILER: something terrible] (#starcraft2 was never trending)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('something terrible')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(#starcraft2 was never trending)')
          ]),
        ]))
    })

    it('must not have its hashmark escaped', () => {
      expect(Up.parse('[SPOILER: yeah] (\\#starcraft2)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('yeah')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(#starcraft2)')
          ]),
        ]))
    })
  })


  specify('It has a subdomain and a top-level domain', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'SPOILER: Chrono Trigger',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'chrono-trigger.wiki',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('Chrono Trigger')
          ], 'https://chrono-trigger.wiki')
        ])
      ])
    })
  })


  describe('When the URL merely has a subdomain and a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'SPOILER: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Link([
              new Up.Text('Advance Wars')
            ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'SPOILER: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/',
        toProduce: insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Link([
              new Up.Text('Advance Wars')
            ], 'https://advancewars.wikia.com/')
          ])
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      expect(Up.parse('[SPOILER: that place] (4chan.org-terrifying)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('that place')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(4chan.org-terrifying)')
          ]),
        ]))
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'SPOILER: Good luck!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '88.8888.cn',
        toProduce: insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Link([
              new Up.Text('Good luck!')
            ], 'https://88.8888.cn')
          ])
        ])
      })
    })

    context('The top-level domain must contain only letters', () => {
      specify('No numbers', () => {
        expect(Up.parse('[SPOILER: username] (john.e.smith5)')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.InlineRevealable([
              new Up.Text('username')
            ]),
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(john.e.smith5)')
            ]),
          ]))
      })

      specify('No hyphens', () => {
        expect(Up.parse('[SPOILER: username] (john.e.smith-kline)')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.InlineRevealable([
              new Up.Text('username')
            ]),
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(john.e.smith-kline)')
            ]),
          ]))
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      expect(Up.parse('[SPOILER: top-level domain] (.co.uk)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('top-level domain')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(.co.uk)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      expect(Up.parse('[SPOILER: Ash is not his own father] (um..uh)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('Ash is not his own father')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(um…uh)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      expect(Up.parse('[SPOILER: debilitating sadness] (4chan.org../r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('debilitating sadness')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(4chan.org…/r9k/)')
          ]),
        ]))
    })

    specify('the URL may have consecutive periods before the top-level domain after the slash that indicates the start of the resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'SPOILER: rocket ship',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'example.com/321...blastoff/1',
        toProduce: insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Link([
              new Up.Text('rocket ship')
            ], 'https://example.com/321...blastoff/1')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.parse('[SPOILER: yeah] (ign.com had some hilarious forums)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('yeah')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(ign.com had some hilarious forums)')
          ]),
        ]))
    })

    specify('the domain part must not be escaped', () => {
      expect(Up.parse('[SPOILER: yeah] (\\ign.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('yeah')
          ]),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(ign.com)')
          ]),
        ]))
    })
  })


  specify('If none of the conditions are satisfied, the spoiler is not linkified', () => {
    expect(Up.parse('[SPOILER: something terrible] (really)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Text('something terrible')
        ]),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('(really)')
        ]),
      ]))
  })
})


describe('If there is nothing but whitspace between an inline revealable and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the revealable convention is not linkified', () => {
    expect(Up.parse('[SPOILER: something terrible]  \\  (https://example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Text('something terrible')
        ]),
        new Up.Text('    '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com')
          ], 'https://example.com'),
          new Up.Text(')')
        ])
      ]))
  })
})


describe("When a linkified revealable convention has whitespace between itself and its URL", () => {
  it('its URL can contain escaped whitespace', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'SPOILER: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'stackoverflow.com/search=something\\ very\\ terrible',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('something terrible')
          ], 'https://stackoverflow.com/search=something very terrible')
        ])
      ])
    })
  })
})
