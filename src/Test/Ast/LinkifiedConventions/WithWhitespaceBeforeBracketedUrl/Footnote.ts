import { expect } from 'chai'
import Up from '../../../../index'
import { expectEveryPermutationOfBracketsAroundContentAndUrl } from '../../Helpers'
import { UpDocument } from '../../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../../SyntaxNodes/Paragraph'
import { Link } from '../../../../SyntaxNodes/Link'
import { PlainText } from '../../../../SyntaxNodes/PlainText'
import { NormalParenthetical } from '../../../../SyntaxNodes/NormalParenthetical'
import { Footnote } from '../../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../../SyntaxNodes/FootnoteBlock'


context('A linkified footnote can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    const footnote = new Footnote([
      new Link([
        new PlainText('the phone was dead')
      ], 'tel:555-555-5555')
    ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'tel:555-555-5555',
      toProduce: new UpDocument([
        new Paragraph([footnote]),
        new FootnoteBlock([footnote])
      ])
    })
  })


  context('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      const footnote = new Footnote([
        new Link([
          new PlainText('Advance Wars')
        ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: new UpDocument([
          new Paragraph([footnote]),
          new FootnoteBlock([footnote])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      const footnote = new Footnote([
        new PlainText('the phone was dead')
      ], 1)

      expect(Up.toDocument('(^the phone was dead) (https://stackoverflow.com is where I learned)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('('),
              new Link([
                new PlainText('stackoverflow.com')
              ], 'https://stackoverflow.com'),
              new PlainText(' is where I learned)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('there must be somethng after the scheme', () => {
      const footnote = new Footnote([
        new PlainText('email')
      ], 1)

      expect(Up.toDocument('(^email) (mailto:)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(mailto:)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      const footnote = new Footnote([
        new PlainText('local files')
      ], 1)

      expect(Up.toDocument('(^local files) (file:///)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(file:///)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('the rest of the URL can consist solely of digits', () => {
      const footnote = new Footnote([
        new Link([
          new PlainText('the phone was dead')
        ], 'tel:5555555555')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^the phone was dead',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'tel:5555555555',
        toProduce: new UpDocument([
          new Paragraph([footnote]),
          new FootnoteBlock([footnote])
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      const footnote = new Footnote([
        new PlainText('email')
      ], 1)

      expect(Up.toDocument('(^email) (\\mailto:daniel@wants.email)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(mailto:daniel@wants.email)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })
  })


  specify('It starts with a slash', () => {
    const footnote = new Footnote([
      new Link([
        new PlainText('the phone was dead')
      ], '/wiki/dead-phone')
    ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '/wiki/dead-phone',
      toProduce: new UpDocument([
        new Paragraph([footnote]),
        new FootnoteBlock([footnote])
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      const footnote = new Footnote([
        new PlainText('the phone was dead')
      ], 1)

      expect(Up.toDocument('(^the phone was dead) (/r9k/ was talking about it)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(/r9k/ was talking about it)'),
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    it('must have something after the slash', () => {
      const footnote = new Footnote([
        new PlainText('slash')
      ], 1)

      expect(Up.toDocument('(^slash) (/)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(/)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    it('can consist solely of digits after the slash', () => {
      const footnote = new Footnote([
        new Link([
          new PlainText('the phone was dead')
        ], '/5555555555')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^the phone was dead',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '/5555555555',
        toProduce: new UpDocument([
          new Paragraph([footnote]),
          new FootnoteBlock([footnote])
        ])
      })
    })

    it('must not have its slash escaped', () => {
      const footnote = new Footnote([
        new PlainText('slash')
      ], 1)

      expect(Up.toDocument('(^slash) (\\/r9k/)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(/r9k/)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    const footnote = new Footnote([
      new Link([
        new PlainText('the phone was dead')
      ], '#wiki/dead-phone')
    ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '#wiki/dead-phone',
      toProduce: new UpDocument([
        new Paragraph([footnote]),
        new FootnoteBlock([footnote])
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits', () => {
      const footnote = new Footnote([
        new Link([
          new PlainText('the phone was dead')
        ], '#15')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^the phone was dead',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '#15',
        toProduce: new UpDocument([
          new Paragraph([footnote]),
          new FootnoteBlock([footnote])
        ])
      })
    })

    it('must not contain any spaces', () => {
      const footnote = new Footnote([
        new PlainText('the game was dead')
      ], 1)

      expect(Up.toDocument('(^the game was dead) (#starcraft2 was never trending)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(#starcraft2 was never trending)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    it('must have something after the hash mark', () => {
      const footnote = new Footnote([
        new PlainText('hash mark')
      ], 1)

      expect(Up.toDocument('(^hash mark) (#)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(#)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    it('must not have its hashmark escaped', () => {
      const footnote = new Footnote([
        new PlainText('hash mark')
      ], 1)

      expect(Up.toDocument('(^hash mark) (\\#starcraft2)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(#starcraft2)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })
  })


  specify('It has a top-level domain', () => {
    const footnote = new Footnote([
      new Link([
        new PlainText('Chrono Trigger')
      ], 'https://chrono-trigger.wiki')
    ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^Chrono Trigger',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'chrono-trigger.wiki',
      toProduce: new UpDocument([
        new Paragraph([footnote]),
        new FootnoteBlock([footnote])
      ])
    })
  })


  describe('When the URL merely has a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      const footnote = new Footnote([
        new Link([
          new PlainText('Advance Wars')
        ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: new UpDocument([
          new Paragraph([footnote]),
          new FootnoteBlock([footnote])
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      const footnote = new Footnote([
        new Link([
          new PlainText('Advance Wars!')
        ], 'https://advancewars.wikia.com/')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Advance Wars!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/',
        toProduce: new UpDocument([
          new Paragraph([footnote]),
          new FootnoteBlock([footnote])
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      const footnote = new Footnote([
        new PlainText('that place')
      ], 1)

      expect(Up.toDocument('[^that place] (4chan.org-terrifying)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(4chan.org-terrifying)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      const footnote = new Footnote([
        new Link([
          new PlainText('Good luck!')
        ], 'https://88.8888.cn')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Good luck!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '88.8888.cn',
        toProduce: new UpDocument([
          new Paragraph([footnote]),
          new FootnoteBlock([footnote])
        ])
      })
    })

    context('The top-level domain must contain only letters', () => {
      specify('No numbers', () => {
        const footnote = new Footnote([
          new PlainText('username')
        ], 1)

        expect(Up.toDocument('[^username] (john.e.smith5)')).to.be.eql(
          new UpDocument([
            new Paragraph([
              footnote,
              new PlainText(' '),
              new NormalParenthetical([
                new PlainText('(john.e.smith5)')
              ])
            ]),
            new FootnoteBlock([footnote])
          ]))
      })

      specify('No hyphens', () => {
        const footnote = new Footnote([
          new PlainText('username')
        ], 1)

        expect(Up.toDocument('[^username] (john.e.smith-kline)')).to.be.eql(
          new UpDocument([
            new Paragraph([
              footnote,
              new PlainText(' '),
              new NormalParenthetical([
                new PlainText('(john.e.smith-kline)')
              ])
            ]),
            new FootnoteBlock([footnote])
          ]))
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      const footnote = new Footnote([
        new PlainText('top-level domain')
      ], 1)

      expect(Up.toDocument('[^top-level domain] (.co.uk)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(.co.uk)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      const footnote = new Footnote([
        new PlainText('Ash is not his own father')
      ], 1)

      expect(Up.toDocument('[^Ash is not his own father] (um..uh)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(um..uh)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      const footnote = new Footnote([
        new PlainText('debilitating sadness')
      ], 1)

      expect(Up.toDocument('[^debilitating sadness] (4chan.org../r9k/)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(4chan.org../r9k/)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('the URL may have consecutive periods before the top-level domain after the slash that indicates the start of the resource path', () => {
      const footnote = new Footnote([
        new Link([
          new PlainText('Good luck!')
        ], 'https://88.8888.cn')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Good luck!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '88.8888.cn',
        toProduce: new UpDocument([
          new Paragraph([footnote]),
          new FootnoteBlock([footnote])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      const footnote = new Footnote([
        new PlainText('yeah')
      ], 1)

      expect(Up.toDocument('[^yeah] (ign.com had some hilarious forums)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(ign.com had some hilarious forums)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('the domain part must not be escaped', () => {
      const footnote = new Footnote([
        new PlainText('yeah')
      ], 1)

      expect(Up.toDocument('[^yeah] (\\ign.com)')).to.be.eql(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(ign.com)')
            ])
          ]),
          new FootnoteBlock([footnote])
        ]))
    })
  })


  specify('If none of the conditions are satisfied, the footnote is not linkified', () => {
    const footnote = new Footnote([
      new PlainText('the phone was dead')
    ], 1)

    expect(Up.toDocument('(^the phone was dead) (really)')).to.be.eql(
      new UpDocument([
        new Paragraph([
          footnote,
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(really)')
          ])
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('If there is nothing but whitspace between a footnote and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the footnote convention is not linkified', () => {
    const footnote = new Footnote([
      new PlainText('something terrible')
    ], 1)

    expect(Up.toDocument('[^something terrible]  \\  (https://example.com)')).to.be.eql(
      new UpDocument([
        new Paragraph([
          footnote,
          new PlainText('    '),
          new NormalParenthetical([
            new PlainText('('),
            new Link([
              new PlainText('example.com')
            ], 'https://example.com'),
            new PlainText(')')
          ])
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe("A linkified footnote's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    const footnote = new Footnote([
      new Link([
        new PlainText('the phone was dead')
      ], 'https://example.com/search=phone was dead')
    ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'example.com/search=phone\\ was\\ dead',
      toProduce: new UpDocument([
        new Paragraph([footnote]),
        new FootnoteBlock([footnote])
      ])
    })
  })
})
