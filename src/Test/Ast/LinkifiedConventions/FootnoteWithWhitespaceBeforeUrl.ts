import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../../SyntaxNodes/ActionNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


const FOOTNOTE_BRACKETS = [
  { open: '((', close: '))' },
  { open: '[[', close: ']]' },
  { open: '{{', close: '}}' }
]


context('A linkified footnote can have whitespace between itself and its bracketed URL, but only if the URL satisfies one of the following conditions:', () => {
  specify('It has a scheme', () => {
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('the phone was dead')
      ], 'tel:555-555-5555')
    ], 1)

    expectEveryCombinationOfBrackets({
      bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
      contentToWrapInBrackets: 'the phone was dead',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'tel:555-555-5555',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })


  describe('When the URL has a scheme, the URL', () => {
    specify('the top-level domain may be followed by a slash and a resource path ', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Advance Wars')
        ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
      ], 1)

      expectEveryCombinationOfBrackets({
        bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
        contentToWrapInBrackets: 'Advance Wars',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)',
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

      expect(Up.toAst('((the phone was dead)) (https://stackoverflow.com is where I learned)')).to.be.eql(
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
            ]),
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    specify('there must be somethng after the scheme', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('email')
      ], 1)

      expect(Up.toAst('((email)) (mailto:)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(mailto:)')
            ]),
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('local files')
      ], 1)

      expect(Up.toAst('((local files)) (file:///)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(file:///)')
            ]),
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

      expectEveryCombinationOfBrackets({
        bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
        contentToWrapInBrackets: 'the phone was dead',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'tel:5555555555',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })
  })


  specify('It starts with a slash', () => {
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('the phone was dead')
      ], '/wiki/dead-phone')
    ], 1)

    expectEveryCombinationOfBrackets({
      bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
      contentToWrapInBrackets: 'the phone was dead',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: '/wiki/dead-phone',
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

      expect(Up.toAst('((the phone was dead)) (/r9k/ was talking about it)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(/r9k/ was talking about it)'),
            ]),
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    it('must have something after the slash', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('slash')
      ], 1)

      expect(Up.toAst('((slash)) (/)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(/)')
            ]),
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

      expectEveryCombinationOfBrackets({
        bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
        contentToWrapInBrackets: 'the phone was dead',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '/5555555555',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('the phone was dead')
      ], '#wiki/dead-phone')
    ], 1)

    expectEveryCombinationOfBrackets({
      bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
      contentToWrapInBrackets: 'the phone was dead',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: '#wiki/dead-phone',
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

      expectEveryCombinationOfBrackets({
        bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
        contentToWrapInBrackets: 'the phone was dead',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '#15',
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

      expect(Up.toAst('((the game was dead)) (#starcraft2 was never trending)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(#starcraft2 was never trending)')
            ]),
          ]),
          new FootnoteBlockNode([footnote])
        ])
      )
    })

    it('must have something after the hash mark', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('hash mark')
      ], 1)

      expect(Up.toAst('((hash mark)) (#)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(#)')
            ]),
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

    expectEveryCombinationOfBrackets({
      bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
      contentToWrapInBrackets: 'Chrono Trigger',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'chrono-trigger.wiki',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote,]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })


  describe('When the URL merely has a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path ', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Advance Wars')
        ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
      ], 1)

      expectEveryCombinationOfBrackets({
        bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
        contentToWrapInBrackets: 'Advance Wars',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: 'advancewars.wikia.com/wiki/Advance_Wars_(game)',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote,]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      const footnote = new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Good luck!')
        ], 'https://88.8888.cn')
      ], 1)

      expectEveryCombinationOfBrackets({
        bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
        contentToWrapInBrackets: 'Good luck!',
        partsToPutInBetween: ['  ', '\t', ' \t '],
        urlToWrapInBrackets: '88.8888.cn',
        toProduce: new DocumentNode([
          new ParagraphNode([footnote,]),
          new FootnoteBlockNode([footnote])
        ])
      })
    })

    context('The top-level domain must contain only letters ', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('username')
      ], 1)

      specify('No numbers', () => {
        expect(Up.toAst('[[username]] (john.e.smith5)')).to.be.eql(
          new DocumentNode([
            new ParagraphNode([
              footnote,
              new PlainTextNode(' '),
              new ParenthesizedNode([
                new PlainTextNode('(john.e.smith5)')
              ]),
            ]),
            new FootnoteBlockNode([footnote])
          ])
        )
      })

      specify('No hyphens', () => {
        const footnote = new FootnoteNode([
          new PlainTextNode('username')
        ], 1)

        expect(Up.toAst('[[username]] (john.e.smith-kline)')).to.be.eql(
          new DocumentNode([
            new ParagraphNode([
              footnote,
              new PlainTextNode(' '),
              new ParenthesizedNode([
                new PlainTextNode('(john.e.smith-kline)')
              ]),
            ]),
            new FootnoteBlockNode([footnote])
          ])
        )
      })
    })

    specify('the URL must not contain any spaces', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('yeah')
      ], 1)

      expect(Up.toAst('[[yeah]] (ign.com had some hilarious forums)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(ign.com had some hilarious forums)')
            ]),
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

    expect(Up.toAst('((the phone was dead)) (really)')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote,
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(really)')
          ]),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('If there is nothing but whitspace between a footnote and a bracketed URL, but one of the whitespace characters is escaped', () => {
  it('the spoiler convention is not linkified', () => {
    const footnote = new FootnoteNode([
      new PlainTextNode('something terrible')
    ], 1)

    expect(Up.toAst('[[something terrible]]  \\  (https://example.com)')).to.be.eql(
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
  it('can itself contain whitespace if each whitespace character is escaped with a backslash ', () => {
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('the phone was dead')
      ], 'https://example.com/search=phone was dead')
    ], 1)

    expectEveryCombinationOfBrackets({
      bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
      contentToWrapInBrackets: 'the phone was dead',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'https://example.com/search=phone\\ was\\ dead',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote,]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })
})
