import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { InlineQuote } from '../../../SyntaxNodes/InlineQuote'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Highlight } from '../../../SyntaxNodes/Highlight'
import { RevisionInsertion } from '../../../SyntaxNodes/RevisionInsertion'


context('Within an inline quote, an (inner) inline quote can be the first convention within any other inner convention.', () => {
  context('The other convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.toDocument('Luigi stood up. "Hello, my ("leetle") Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new InlineQuote([
            new PlainText('Hello, my '),
            new NormalParenthetical([
              new PlainText('('),
              new InlineQuote([
                new PlainText('leetle')
              ]),
              new PlainText(')')
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.toDocument('Luigi stood up. "Hello, my *"leetle"* Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new InlineQuote([
            new PlainText('Hello, my '),
            new Emphasis([
              new InlineQuote([
                new PlainText('leetle')
              ]),
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })

    specify('Revision insertion', () => {
      expect(Up.toDocument('Luigi stood up. "Hello, my ++"leetle"++ Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new InlineQuote([
            new PlainText('Hello, my '),
            new RevisionInsertion([
              new InlineQuote([
                new PlainText('leetle')
              ]),
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })

    specify('Highlights (even when there is no space after the colon)', () => {
      expect(Up.toDocument('Luigi stood up. "Hello, my [highlight:"leetle"] Mario!"')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new InlineQuote([
            new PlainText('Hello, my '),
            new Highlight([
              new InlineQuote([
                new PlainText('leetle')
              ])
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })
  })


  specify('The inner inline quote can open immediately after several conventions have just opened', () => {
    expect(Up.toDocument('Luigi stood up. "Hello, my ++(*"leetle"*)++ Mario!"')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Luigi stood up. '),
        new InlineQuote([
          new PlainText('Hello, my '),
          new RevisionInsertion([
            new NormalParenthetical([
              new PlainText('('),
              new Emphasis([
                new InlineQuote([
                  new PlainText('leetle')
                ])
              ]),
              new PlainText(')')
            ])
          ]),
          new PlainText(' Mario!')
        ])
      ]))
  })
})


context('Within an inline quote, an (inner) inline quote can close directly after a convention inside of it has closed.', () => {
  context('The innermost convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.toDocument('"Luigi stood up. "Help me find brother (Mario)", I heard Luigi say."')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineQuote([
            new PlainText('Luigi stood up. '),
            new InlineQuote([
              new PlainText('Help me find brother '),
              new NormalParenthetical([
                new PlainText('(Mario)'),
              ]),
            ]),
            new PlainText(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.toDocument('"Luigi stood up. "Help me find brother *Mario*", I heard Luigi say."')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineQuote([
            new PlainText('Luigi stood up. '),
            new InlineQuote([
              new PlainText('Help me find brother '),
              new Emphasis([
                new PlainText('Mario'),
              ]),
            ]),
            new PlainText(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Revision insertion', () => {
      expect(Up.toDocument('"Luigi stood up. "Help me find brother ++Mario++", I heard Luigi say."')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineQuote([
            new PlainText('Luigi stood up. '),
            new InlineQuote([
              new PlainText('Help me find brother '),
              new RevisionInsertion([
                new PlainText('Mario'),
              ]),
            ]),
            new PlainText(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Highlights (even when there is no space after the colon)', () => {
      expect(Up.toDocument('"Luigi stood up. "Help me find brother [highlight:Mario]", I heard Luigi say."')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineQuote([
            new PlainText('Luigi stood up. '),
            new InlineQuote([
              new PlainText('Help me find brother '),
              new Highlight([
                new PlainText('Mario'),
              ]),
            ]),
            new PlainText(', I heard Luigi say.')
          ])
        ]))
    })
  })
})
