import { expect } from 'chai'
import Up = require('../../../../index')
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../../Helpers'


context('A linkified highlight can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'app:wiki/terrible-thing',
      toProduce: insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Link([
            new Up.PlainText('something terrible')
          ], 'app:wiki/terrible-thing')
        ])
      ])
    })
  })


  context('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.Link([
              new Up.PlainText('Advance Wars')
            ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.parse('[highlight: something terrible] (https://stackoverflow.com is nice)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('something terrible')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('('),
            new Up.Link([
              new Up.PlainText('stackoverflow.com')
            ], 'https://stackoverflow.com'),
            new Up.PlainText(' is nice)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme', () => {
      expect(Up.parse('[highlight: email] (mailto:)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('email')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(mailto:)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.parse('[highlight: local files] (file:///)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('local files')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(file:///)')
          ]),
        ]))
    })

    specify('the rest of the URL can consist solely of digits', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: spooky phone call',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'tel:5555555555',
        toProduce: insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.Link([
              new Up.PlainText('spooky phone call')
            ], 'tel:5555555555')
          ])
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      expect(Up.parse('[highlight: email] (\\mailto:daniel@wants.email)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('email')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(mailto:daniel@wants.email)')
          ]),
        ]))
    })
  })


  specify('It starts with a slash', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '/wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Link([
            new Up.PlainText('something terrible')
          ], '/wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      expect(Up.parse('[highlight: something terrible] (/r9k/ created it)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('something terrible')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(/r9k/ created it)')
          ]),
        ]))
    })

    it('must have something after the slash', () => {
      expect(Up.parse('[highlight: slash] (/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('slash')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(/)')
          ]),
        ]))
    })

    it('can consist solely of digits after the slash', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Model 3 theft',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '/3',
        toProduce: insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.Link([
              new Up.PlainText('Model 3 theft')
            ], '/3')
          ])
        ])
      })
    })

    it('must not have its slash escaped', () => {
      expect(Up.parse('[highlight: yeah] (\\/r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('yeah')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(/r9k/)')
          ]),
        ]))
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '#wiki/something-terrible',
      toProduce: insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Link([
            new Up.PlainText('something terrible')
          ], '#wiki/something-terrible')
        ])
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Model 3 theft',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '#3',
        toProduce: insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.Link([
              new Up.PlainText('Model 3 theft')
            ], '#3')
          ])
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.parse('[highlight: hash mark] (#)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('hash mark')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(#)')
          ]),
        ]))
    })

    it('must not contain any spaces', () => {
      expect(Up.parse('[highlight: something terrible] (#starcraft2 was never trending)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('something terrible')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(#starcraft2 was never trending)')
          ]),
        ]))
    })

    it('must not have its hashmark escaped', () => {
      expect(Up.parse('[highlight: yeah] (\\#starcraft2)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('yeah')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(#starcraft2)')
          ]),
        ]))
    })
  })


  specify('It has a subdomain and a top-level domain', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: Chrono Trigger',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'chrono-trigger.wiki',
      toProduce: insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Link([
            new Up.PlainText('Chrono Trigger')
          ], 'https://chrono-trigger.wiki')
        ])
      ])
    })
  })


  describe('When the URL merely has a subdomain and a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.Link([
              new Up.PlainText('Advance Wars')
            ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
          ])
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/',
        toProduce: insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.Link([
              new Up.PlainText('Advance Wars')
            ], 'https://advancewars.wikia.com/')
          ])
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      expect(Up.parse('[highlight: that place] (4chan.org-terrifying)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('that place')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(4chan.org-terrifying)')
          ]),
        ]))
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: Good luck!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '88.8888.cn',
        toProduce: insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.Link([
              new Up.PlainText('Good luck!')
            ], 'https://88.8888.cn')
          ])
        ])
      })
    })

    context('The top-level domain must contain only letters', () => {
      specify('No numbers', () => {
        expect(Up.parse('[highlight: username] (john.e.smith5)')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.Highlight([
              new Up.PlainText('username')
            ]),
            new Up.PlainText(' '),
            new Up.NormalParenthetical([
              new Up.PlainText('(john.e.smith5)')
            ]),
          ]))
      })

      specify('No hyphens', () => {
        expect(Up.parse('[highlight: username] (john.e.smith-kline)')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.Highlight([
              new Up.PlainText('username')
            ]),
            new Up.PlainText(' '),
            new Up.NormalParenthetical([
              new Up.PlainText('(john.e.smith-kline)')
            ]),
          ]))
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      expect(Up.parse('[highlight: top-level domain] (.co.uk)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('top-level domain')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(.co.uk)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      expect(Up.parse('[highlight: Ash is not his own father] (um..uh)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('Ash is not his own father')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(um…uh)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      expect(Up.parse('[highlight: debilitating sadness] (4chan.org../r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('debilitating sadness')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(4chan.org…/r9k/)')
          ]),
        ]))
    })

    specify('the URL may have consecutive periods before the top-level domain after the slash that indicates the start of the resource path', () => {
      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: 'highlight: rocket ship',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'example.com/321...blastoff/1',
        toProduce: insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.Link([
              new Up.PlainText('rocket ship')
            ], 'https://example.com/321...blastoff/1')
          ])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.parse('[highlight: yeah] (ign.com had some hilarious forums)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('yeah')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(ign.com had some hilarious forums)')
          ]),
        ]))
    })

    specify('the domain part must not be escaped', () => {
      expect(Up.parse('[highlight: yeah] (\\ign.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('yeah')
          ]),
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('(ign.com)')
          ]),
        ]))
    })
  })


  specify('If none of the conditions are satisfied, the highlight is not linkified', () => {
    expect(Up.parse('[highlight: something terrible] (really)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.PlainText('something terrible')
        ]),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('(really)')
        ]),
      ]))
  })
})


describe('If there is nothing but whitspace between a highlight and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the highlight is not linkified', () => {
    expect(Up.parse('[highlight: something terrible]  \\  (https://example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.PlainText('something terrible')
        ]),
        new Up.PlainText('    '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com')
          ], 'https://example.com'),
          new Up.PlainText(')')
        ])
      ]))
  })
})


describe("A linkified highlight's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: something terrible',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'stackoverflow.com/search=something\\ very\\ terrible',
      toProduce: insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Link([
            new Up.PlainText('something terrible')
          ], 'https://stackoverflow.com/search=something very terrible')
        ])
      ])
    })
  })
})
