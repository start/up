import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { InlineQuote } from '../../../SyntaxNodes/InlineQuote'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Highlight } from '../../../SyntaxNodes/Highlight'
import { RevisionInsertion } from '../../../SyntaxNodes/RevisionInsertion'


context('Within an inline quote, an (inner) inline quote can be be the first convention within another any other inner convention, including (but not limited to):', () => {
  specify('Normal parentheticals', () => {
    expect(Up.toDocument('John stood up. "Hello, my ("little") world!"')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('John stood up. '),
        new InlineQuote([
          new PlainText('Hello, my '),
          new NormalParenthetical([
            new PlainText('('),
            new InlineQuote([
              new PlainText('little')
            ]),
            new PlainText(')')
          ]),
          new PlainText(' world!')
        ])
      ]))
  })

  specify('Emphasis', () => {
    expect(Up.toDocument('John stood up. "Hello, my *"little"* world!"')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('John stood up. '),
        new InlineQuote([
          new PlainText('Hello, my '),
          new Emphasis([
            new InlineQuote([
              new PlainText('little')
            ]),
          ]),
          new PlainText(' world!')
        ])
      ]))
  })

  specify('Revision insertion', () => {
    expect(Up.toDocument('John stood up. "Hello, my ++"little"++ world!"')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('John stood up. '),
        new InlineQuote([
          new PlainText('Hello, my '),
          new RevisionInsertion([
            new InlineQuote([
              new PlainText('little')
            ]),
          ]),
          new PlainText(' world!')
        ])
      ]))
  })

  specify('Highlights (even when there is no space after the colon)', () => {
    expect(Up.toDocument('John stood up. "Hello, my [highlight:"little"] world!"')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('John stood up. '),
        new InlineQuote([
          new PlainText('Hello, my '),
          new Highlight([
            new InlineQuote([
              new PlainText('little')
            ])
          ]),
          new PlainText(' world!')
        ])
      ]))
  })
})
