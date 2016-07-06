import { expect } from 'chai'
import Up from '../../../../index'
import { expectEveryPermutationOfBracketsAroundContentAndUrl } from '../../Helpers'
import { DocumentNode } from '../../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../../SyntaxNodes/ParagraphNode'
import { LinkNode } from '../../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'
import { ParenthesizedNode } from '../../../../SyntaxNodes/ParenthesizedNode'
import { FootnoteNode } from '../../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../../SyntaxNodes/FootnoteBlockNode'


context('A linkified footnote can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('the phone was dead')
      ], 'tel:555-555-5555')
    ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'tel:555-555-5555',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })


  describe('When the URL has a scheme, the URL', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Advance Wars')
        ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('the phone was dead')
      ], 1)

      expect(Up.toAst('(^the phone was dead) (https://stackoverflow.com is where I learned)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('('),
              new LinkNode([
                new PlainTextNode('stackoverflow.com')
              ], 'https://stackoverflow.com'),
              new PlainTextNode(' is where I learned)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    specify('there must be somethng after the scheme', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('email')
      ], 1)

      expect(Up.toAst('(^email) (mailto:)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(mailto:)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('local files')
      ], 1)

      expect(Up.toAst('(^local files) (file:///)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(file:///)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    specify('the rest of the URL can consist solely of digits', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('the phone was dead')
        ], 'tel:5555555555')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^the phone was dead',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'tel:5555555555',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('email')
      ], 1)

      expect(Up.toAst('(^email) (\\mailto:daniel@wants.email)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(mailto:daniel@wants.email)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })
  })


  specify('It starts with a slash', () => {
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('the phone was dead')
      ], '/wiki/dead-phone')
    ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '/wiki/dead-phone',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('the phone was dead')
      ], 1)

      expect(Up.toAst('(^the phone was dead) (/r9k/ was talking about it)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(/r9k/ was talking about it)'),
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    it('must have something after the slash', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('slash')
      ], 1)

      expect(Up.toAst('(^slash) (/)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(/)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    it('can consist solely of digits after the slash', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('the phone was dead')
        ], '/5555555555')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^the phone was dead',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '/5555555555',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })

    specify('must not have its slash escaped', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('slash')
      ], 1)

      expect(Up.toAst('(^slash) (\\/r9k/)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(/r9k/)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('the phone was dead')
      ], '#wiki/dead-phone')
    ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: '#wiki/dead-phone',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote,]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('the phone was dead')
        ], '#15')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^the phone was dead',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '#15',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote,]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })

    it('must not contain any spaces', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('the game was dead')
      ], 1)

      expect(Up.toAst('(^the game was dead) (#starcraft2 was never trending)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(#starcraft2 was never trending)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    it('must have something after the hash mark', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('hash mark')
      ], 1)

      expect(Up.toAst('(^hash mark) (#)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(#)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    it('must not have its hashmark escaped', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('hash mark')
      ], 1)

      expect(Up.toAst('(^hash mark) (\\#starcraft2)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(#starcraft2)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })
  })


  specify('It has a top-level domain', () => {
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Chrono Trigger')
      ], 'https://chrono-trigger.wiki')
    ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^Chrono Trigger',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'chrono-trigger.wiki',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote,]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })


  describe('When the URL merely has a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Advance Wars')
        ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Advance Wars',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote,]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Advance Wars!')
        ], 'https://advancewars.wikia.com/')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Advance Wars!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: 'advancewars.wikia.com/',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote,]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('that place')
      ], 1)

      expect(Up.toAst('[^that place] (4chan.org--terrifying)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(4chan.org--terrifying)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Good luck!')
        ], 'https://88.8888.cn')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Good luck!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '88.8888.cn',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote,]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })

    context('The top-level domain must contain only letters ', () => {
      specify('No numbers', () => {
        const footnote = new FootnoteNode([
          new PlainTextNode('username')
        ], 1)

        expect(Up.toAst('[^username] (john.e.smith5)')).to.be.eql(
          new DocumentNode([
            new ParagraphNode([
              footnote,
              new PlainTextNode(' '),
              new ParenthesizedNode([
                new PlainTextNode('(john.e.smith5)')
              ])
            ]),
            new FootnoteBlockNode([footnote])
          ])
        )
      })

      specify('No hyphens', () => {
        const footnote = new FootnoteNode([
          new PlainTextNode('username')
        ], 1)

        expect(Up.toAst('[^username] (john.e.smith-kline)')).to.be.eql(
          new DocumentNode([
            new ParagraphNode([
              footnote,
              new PlainTextNode(' '),
              new ParenthesizedNode([
                new PlainTextNode('(john.e.smith-kline)')
              ])
            ]),
            new FootnoteBlockNode([footnote])
          ])
        )
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('top-level domain')
      ], 1)

      expect(Up.toAst('[^top-level domain] (.co.uk)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(.co.uk)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('Ash is not his own father')
      ], 1)

      expect(Up.toAst('[^Ash is not his own father] (um..uh)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(um..uh)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('debilitating sadness')
      ], 1)

      expect(Up.toAst('[^debilitating sadness] (4chan.org../r9k/)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(4chan.org../r9k/)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    specify('the URL may have consecutive periods before the top-level domain after the slash that indicates the start of the resource path', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Good luck!')
        ], 'https://88.8888.cn')
      ], 1)

      expectEveryPermutationOfBracketsAroundContentAndUrl({
        content: '^Good luck!',
        partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
        url: '88.8888.cn',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote,]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('yeah')
      ], 1)

      expect(Up.toAst('[^yeah] (ign.com had some hilarious forums)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(ign.com had some hilarious forums)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    specify('the domain part must not be escaped', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('yeah')
      ], 1)

      expect(Up.toAst('[^yeah] (\\ign.com)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(ign.com)')
            ])
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })
  })


  specify('If none of the conditions are satisfied, the footnote is not linkified', () => {
    const footnote = new FootnoteNode([
      new PlainTextNode('the phone was dead')
    ], 1)

    expect(Up.toAst('(^the phone was dead) (really)')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote,
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(really)')
          ])
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('If there is nothing but whitspace between a footnote and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the footnote convention is not linkified', () => {
    const footnote = new FootnoteNode([
      new PlainTextNode('something terrible')
    ], 1)

    expect(Up.toAst('[^something terrible]  \\  (https://example.com)')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote,
          new PlainTextNode('    '),
          new ParenthesizedNode([
            new PlainTextNode('('),
            new LinkNode([
              new PlainTextNode('example.com')
            ], 'https://example.com'),
            new PlainTextNode(')')
          ])
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe("A linkified footnote's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('the phone was dead')
      ], 'https://example.com/search=phone was dead')
    ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^the phone was dead',
      partsBetweenContentAndUrl: ['  ', '\t', ' \t '],
      url: 'example.com/search=phone\\ was\\ dead',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote,]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })
})
