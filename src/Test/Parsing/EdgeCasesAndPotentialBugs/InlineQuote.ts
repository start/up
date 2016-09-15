import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


context('Within an inline quote, an (inner) inline quote can be the first convention within any other inner convention.', () => {
  context('The other convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.parse('Luigi stood up. "Hello, my ("leetle") Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Luigi stood up. '),
          new Up.InlineQuote([
            new Up.PlainText('Hello, my '),
            new Up.NormalParenthetical([
              new Up.PlainText('('),
              new Up.InlineQuote([
                new Up.PlainText('leetle')
              ]),
              new Up.PlainText(')')
            ]),
            new Up.PlainText(' Mario!')
          ])
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.parse('Luigi stood up. "Hello, my *"leetle"* Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Luigi stood up. '),
          new Up.InlineQuote([
            new Up.PlainText('Hello, my '),
            new Up.Emphasis([
              new Up.InlineQuote([
                new Up.PlainText('leetle')
              ]),
            ]),
            new Up.PlainText(' Mario!')
          ])
        ]))
    })

    specify('Italics', () => {
      expect(Up.parse('Luigi stood up. "Hello, my _"leetle"_ Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Luigi stood up. '),
          new Up.InlineQuote([
            new Up.PlainText('Hello, my '),
            new Up.Italic([
              new Up.InlineQuote([
                new Up.PlainText('leetle')
              ]),
            ]),
            new Up.PlainText(' Mario!')
          ])
        ]))
    })

    specify('Highlights (even when there is no space after the colon)', () => {
      expect(Up.parse('Luigi stood up. "Hello, my [highlight:"leetle"] Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Luigi stood up. '),
          new Up.InlineQuote([
            new Up.PlainText('Hello, my '),
            new Up.Highlight([
              new Up.InlineQuote([
                new Up.PlainText('leetle')
              ])
            ]),
            new Up.PlainText(' Mario!')
          ])
        ]))
    })
  })


  specify('The inner inline quote can open immediately after several conventions have just opened', () => {
    expect(Up.parse('Luigi stood up. "Hello, my _(*"leetle"*)_ Mario!"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Luigi stood up. '),
        new Up.InlineQuote([
          new Up.PlainText('Hello, my '),
          new Up.Italic([
            new Up.NormalParenthetical([
              new Up.PlainText('('),
              new Up.Emphasis([
                new Up.InlineQuote([
                  new Up.PlainText('leetle')
                ])
              ]),
              new Up.PlainText(')')
            ])
          ]),
          new Up.PlainText(' Mario!')
        ])
      ]))
  })
})


context('Within an inline quote, an (inner) inline quote can close directly after a convention inside of it has closed.', () => {
  context('The innermost convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.parse('"Luigi stood up. "Help me find brother (Mario)", I heard Luigi say."')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.PlainText('Luigi stood up. '),
            new Up.InlineQuote([
              new Up.PlainText('Help me find brother '),
              new Up.NormalParenthetical([
                new Up.PlainText('(Mario)'),
              ]),
            ]),
            new Up.PlainText(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.parse('"Luigi stood up. "Help me find brother *Mario*", I heard Luigi say."')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.PlainText('Luigi stood up. '),
            new Up.InlineQuote([
              new Up.PlainText('Help me find brother '),
              new Up.Emphasis([
                new Up.PlainText('Mario'),
              ]),
            ]),
            new Up.PlainText(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Revision insertion', () => {
      expect(Up.parse('"Luigi stood up. "Help me find brother _Mario_", I heard Luigi say."')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.PlainText('Luigi stood up. '),
            new Up.InlineQuote([
              new Up.PlainText('Help me find brother '),
              new Up.Italic([
                new Up.PlainText('Mario'),
              ]),
            ]),
            new Up.PlainText(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Highlights (even when there is no space after the colon)', () => {
      expect(Up.parse('"Luigi stood up. "Help me find brother [highlight:Mario]", I heard Luigi say."')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.PlainText('Luigi stood up. '),
            new Up.InlineQuote([
              new Up.PlainText('Help me find brother '),
              new Up.Highlight([
                new Up.PlainText('Mario'),
              ]),
            ]),
            new Up.PlainText(', I heard Luigi say.')
          ])
        ]))
    })
  })
})
