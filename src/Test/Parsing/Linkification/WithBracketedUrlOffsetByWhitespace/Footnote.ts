import { expect } from 'chai'
import * as Up from '../../../../Main'
import { expectEveryPermutationOfBracketsAroundContentAndUrl } from '../../Helpers'


context('A linkified footnote can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    const footnote = new Up.Footnote([
      new Up.Link([
        new Up.Text('the phone was dead')
      ], 'tel:555-555-5555')
    ], { referenceNumber: 1 })

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'tel:555-555-5555',
      toProduce: new Up.Document([
        new Up.Paragraph([footnote]),
        new Up.FootnoteBlock([footnote])
      ])
    })
  })


  context('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      const footnote = new Up.Footnote([
        new Up.Link([
          new Up.Text('Advance Wars')
        ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
      ], { referenceNumber: 1 })

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      const footnote = new Up.Footnote([
        new Up.Text('the phone was dead')
      ], { referenceNumber: 1 })

      expect(Up.parse('(^the phone was dead) (https://stackoverflow.com is where I learned)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('('),
              new Up.Link([
                new Up.Text('stackoverflow.com')
              ], 'https://stackoverflow.com'),
              new Up.Text(' is where I learned)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('there must be somethng after the scheme', () => {
      const footnote = new Up.Footnote([
        new Up.Text('email')
      ], { referenceNumber: 1 })

      expect(Up.parse('(^email) (mailto:)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(mailto:)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      const footnote = new Up.Footnote([
        new Up.Text('local files')
      ], { referenceNumber: 1 })

      expect(Up.parse('(^local files) (file:///)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(file:///)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('the rest of the URL can consist solely of digits', () => {
      const footnote = new Up.Footnote([
        new Up.Link([
          new Up.Text('the phone was dead')
        ], 'tel:5555555555')
      ], { referenceNumber: 1 })

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^the phone was dead',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'tel:5555555555',
        toProduce: new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      const footnote = new Up.Footnote([
        new Up.Text('email')
      ], { referenceNumber: 1 })

      expect(Up.parse('(^email) (\\mailto:daniel@wants.email)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(mailto:daniel@wants.email)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })
  })


  specify('It starts with a slash', () => {
    const footnote = new Up.Footnote([
      new Up.Link([
        new Up.Text('the phone was dead')
      ], '/wiki/dead-phone')
    ], { referenceNumber: 1 })

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '/wiki/dead-phone',
      toProduce: new Up.Document([
        new Up.Paragraph([footnote]),
        new Up.FootnoteBlock([footnote])
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      const footnote = new Up.Footnote([
        new Up.Text('the phone was dead')
      ], { referenceNumber: 1 })

      expect(Up.parse('(^the phone was dead) (/r9k/ was talking about it)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(/r9k/ was talking about it)'),
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    it('must have something after the slash', () => {
      const footnote = new Up.Footnote([
        new Up.Text('slash')
      ], { referenceNumber: 1 })

      expect(Up.parse('(^slash) (/)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(/)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    it('can consist solely of digits after the slash', () => {
      const footnote = new Up.Footnote([
        new Up.Link([
          new Up.Text('the phone was dead')
        ], '/5555555555')
      ], { referenceNumber: 1 })

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^the phone was dead',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '/5555555555',
        toProduce: new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ])
      })
    })

    it('must not have its slash escaped', () => {
      const footnote = new Up.Footnote([
        new Up.Text('slash')
      ], { referenceNumber: 1 })

      expect(Up.parse('(^slash) (\\/r9k/)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(/r9k/)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    const footnote = new Up.Footnote([
      new Up.Link([
        new Up.Text('the phone was dead')
      ], '#wiki/dead-phone')
    ], { referenceNumber: 1 })

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '#wiki/dead-phone',
      toProduce: new Up.Document([
        new Up.Paragraph([footnote]),
        new Up.FootnoteBlock([footnote])
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits', () => {
      const footnote = new Up.Footnote([
        new Up.Link([
          new Up.Text('the phone was dead')
        ], '#15')
      ], { referenceNumber: 1 })

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^the phone was dead',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '#15',
        toProduce: new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ])
      })
    })

    it('must not contain any spaces', () => {
      const footnote = new Up.Footnote([
        new Up.Text('the game was dead')
      ], { referenceNumber: 1 })

      expect(Up.parse('(^the game was dead) (#starcraft2 was never trending)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(#starcraft2 was never trending)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    it('must have something after the hash mark', () => {
      const footnote = new Up.Footnote([
        new Up.Text('hash mark')
      ], { referenceNumber: 1 })

      expect(Up.parse('(^hash mark) (#)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(#)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    it('must not have its hashmark escaped', () => {
      const footnote = new Up.Footnote([
        new Up.Text('hash mark')
      ], { referenceNumber: 1 })

      expect(Up.parse('(^hash mark) (\\#starcraft2)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(#starcraft2)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })
  })


  specify('It has a subdomain and a top-level domain', () => {
    const footnote = new Up.Footnote([
      new Up.Link([
        new Up.Text('Chrono Trigger')
      ], 'https://chrono-trigger.wiki')
    ], { referenceNumber: 1 })

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^Chrono Trigger',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'chrono-trigger.wiki',
      toProduce: new Up.Document([
        new Up.Paragraph([footnote]),
        new Up.FootnoteBlock([footnote])
      ])
    })
  })


  describe('When the URL merely has a subdomain and a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      const footnote = new Up.Footnote([
        new Up.Link([
          new Up.Text('Advance Wars')
        ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
      ], { referenceNumber: 1 })

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      const footnote = new Up.Footnote([
        new Up.Link([
          new Up.Text('Advance Wars!')
        ], 'https://advancewars.wikia.com/')
      ], { referenceNumber: 1 })

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Advance Wars!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/',
        toProduce: new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      const footnote = new Up.Footnote([
        new Up.Text('that place')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^that place] (4chan.org-terrifying)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(4chan.org-terrifying)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      const footnote = new Up.Footnote([
        new Up.Link([
          new Up.Text('Good luck!')
        ], 'https://88.8888.cn')
      ], { referenceNumber: 1 })

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Good luck!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '88.8888.cn',
        toProduce: new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ])
      })
    })

    context('The top-level domain must contain only letters', () => {
      specify('No numbers', () => {
        const footnote = new Up.Footnote([
          new Up.Text('username')
        ], { referenceNumber: 1 })

        expect(Up.parse('[^username] (john.e.smith5)')).to.deep.equal(
          new Up.Document([
            new Up.Paragraph([
              footnote,
              new Up.Text(' '),
              new Up.NormalParenthetical([
                new Up.Text('(john.e.smith5)')
              ])
            ]),
            new Up.FootnoteBlock([footnote])
          ]))
      })

      specify('No hyphens', () => {
        const footnote = new Up.Footnote([
          new Up.Text('username')
        ], { referenceNumber: 1 })

        expect(Up.parse('[^username] (john.e.smith-kline)')).to.deep.equal(
          new Up.Document([
            new Up.Paragraph([
              footnote,
              new Up.Text(' '),
              new Up.NormalParenthetical([
                new Up.Text('(john.e.smith-kline)')
              ])
            ]),
            new Up.FootnoteBlock([footnote])
          ]))
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      const footnote = new Up.Footnote([
        new Up.Text('top-level domain')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^top-level domain] (.co.uk)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(.co.uk)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      const footnote = new Up.Footnote([
        new Up.Text('Ash is not his own father')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^Ash is not his own father] (um..uh)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(um…uh)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      const footnote = new Up.Footnote([
        new Up.Text('debilitating sadness')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^debilitating sadness] (4chan.org../r9k/)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(4chan.org…/r9k/)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('the URL may have consecutive periods before the top-level domain after the slash that indicates the start of the resource path', () => {
      const footnote = new Up.Footnote([
        new Up.Link([
          new Up.Text('Good luck!')
        ], 'https://88.8888.cn')
      ], { referenceNumber: 1 })

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Good luck!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '88.8888.cn',
        toProduce: new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      const footnote = new Up.Footnote([
        new Up.Text('yeah')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^yeah] (ign.com had some hilarious forums)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(ign.com had some hilarious forums)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('the domain part must not be escaped', () => {
      const footnote = new Up.Footnote([
        new Up.Text('yeah')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^yeah] (\\ign.com)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(ign.com)')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })
  })


  specify('If none of the conditions are satisfied, the footnote is not linkified', () => {
    const footnote = new Up.Footnote([
      new Up.Text('the phone was dead')
    ], { referenceNumber: 1 })

    expect(Up.parse('(^the phone was dead) (really)')).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote,
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(really)')
          ])
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('If there is nothing but whitspace between a footnote and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the footnote convention is not linkified', () => {
    const footnote = new Up.Footnote([
      new Up.Text('something terrible')
    ], { referenceNumber: 1 })

    expect(Up.parse('[^something terrible]  \\  (https://example.com)')).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote,
          new Up.Text('    '),
          new Up.NormalParenthetical([
            new Up.Text('('),
            new Up.Link([
              new Up.Text('example.com')
            ], 'https://example.com'),
            new Up.Text(')')
          ])
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe("A linkified footnote's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    const footnote = new Up.Footnote([
      new Up.Link([
        new Up.Text('the phone was dead')
      ], 'https://example.com/search=phone was dead')
    ], { referenceNumber: 1 })

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'example.com/search=phone\\ was\\ dead',
      toProduce: new Up.Document([
        new Up.Paragraph([footnote]),
        new Up.FootnoteBlock([footnote])
      ])
    })
  })
})
