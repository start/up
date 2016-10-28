import { expect } from 'chai'
import * as Up from '../../../Up'
import { insideDocumentAndParagraph } from '../Helpers'


context('Within an inline quote, an (inner) inline quote can be the first convention within any other inner convention.', () => {
  context('The other convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.parse('Luigi stood up. "Hello, my ("leetle") Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.InlineQuote([
            new Up.Text('Hello, my '),
            new Up.NormalParenthetical([
              new Up.Text('('),
              new Up.InlineQuote([
                new Up.Text('leetle')
              ]),
              new Up.Text(')')
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.parse('Luigi stood up. "Hello, my *"leetle"* Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.InlineQuote([
            new Up.Text('Hello, my '),
            new Up.Emphasis([
              new Up.InlineQuote([
                new Up.Text('leetle')
              ]),
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })

    specify('Italics', () => {
      expect(Up.parse('Luigi stood up. "Hello, my _"leetle"_ Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.InlineQuote([
            new Up.Text('Hello, my '),
            new Up.Italic([
              new Up.InlineQuote([
                new Up.Text('leetle')
              ]),
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })

    specify('Inline revealables (even when there is no space after the colon)', () => {
      expect(Up.parse('Luigi stood up. "Hello, my [spoiler:"leetle"] Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.InlineQuote([
            new Up.Text('Hello, my '),
            new Up.InlineRevealable([
              new Up.InlineQuote([
                new Up.Text('leetle')
              ])
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })
  })


  specify('The inner inline quote can open immediately after several conventions have just opened', () => {
    expect(Up.parse('Luigi stood up. "Hello, my _(*"leetle"*)_ Mario!"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Luigi stood up. '),
        new Up.InlineQuote([
          new Up.Text('Hello, my '),
          new Up.Italic([
            new Up.NormalParenthetical([
              new Up.Text('('),
              new Up.Emphasis([
                new Up.InlineQuote([
                  new Up.Text('leetle')
                ])
              ]),
              new Up.Text(')')
            ])
          ]),
          new Up.Text(' Mario!')
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
            new Up.Text('Luigi stood up. '),
            new Up.InlineQuote([
              new Up.Text('Help me find brother '),
              new Up.NormalParenthetical([
                new Up.Text('(Mario)'),
              ]),
            ]),
            new Up.Text(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.parse('"Luigi stood up. "Help me find brother *Mario*", I heard Luigi say."')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.Text('Luigi stood up. '),
            new Up.InlineQuote([
              new Up.Text('Help me find brother '),
              new Up.Emphasis([
                new Up.Text('Mario'),
              ]),
            ]),
            new Up.Text(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Italics', () => {
      expect(Up.parse('"Luigi stood up. "Help me find brother _Mario_", I heard Luigi say."')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.Text('Luigi stood up. '),
            new Up.InlineQuote([
              new Up.Text('Help me find brother '),
              new Up.Italic([
                new Up.Text('Mario'),
              ]),
            ]),
            new Up.Text(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Inline revealables (even when there is no space after the colon)', () => {
      expect(Up.parse('"Luigi stood up. "Help me find brother [spoiler:Mario]", I heard Luigi say."')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.Text('Luigi stood up. '),
            new Up.InlineQuote([
              new Up.Text('Help me find brother '),
              new Up.Highlight([
                new Up.Text('Mario'),
              ]),
            ]),
            new Up.Text(', I heard Luigi say.')
          ])
        ]))
    })
  })
})
