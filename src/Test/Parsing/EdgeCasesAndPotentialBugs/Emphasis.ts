import { expect } from 'chai'
import { Up } from '../../../Up'
import { insideDocumentAndParagraph } from '../Helpers'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Italic } from '../../../SyntaxNodes/Italic'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Highlight } from '../../../SyntaxNodes/Highlight'
import { InlineQuote } from '../../../SyntaxNodes/InlineQuote'


context('Within emphasis, (inner) emphasis can be the first convention within any other inner convention.', () => {
  context('The other convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.parse('Luigi stood up. *Hello, my (*leetle*) Mario!*')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new Emphasis([
            new PlainText('Hello, my '),
            new NormalParenthetical([
              new PlainText('('),
              new Emphasis([
                new PlainText('leetle')
              ]),
              new PlainText(')')
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })

    specify('Italics', () => {
      expect(Up.parse('Luigi stood up. *Hello, my _*leetle*_ Mario!*')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new Emphasis([
            new PlainText('Hello, my '),
            new Italic([
              new Emphasis([
                new PlainText('leetle')
              ]),
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })

    specify('Inline quotes', () => {
      expect(Up.parse('Luigi stood up. *Hello, my "*leetle*" Mario!*')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new Emphasis([
            new PlainText('Hello, my '),
            new InlineQuote([
              new Emphasis([
                new PlainText('leetle')
              ]),
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })

    specify('Highlights (even when there is no space after the colon)', () => {
      expect(Up.parse('Luigi stood up. *Hello, my [highlight:*leetle*] Mario!*')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new Emphasis([
            new PlainText('Hello, my '),
            new Highlight([
              new Emphasis([
                new PlainText('leetle')
              ])
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })
  })


  specify('The inner emphasis can open immediately after several conventions have just opened', () => {
    expect(Up.parse('Luigi stood up. *Hello, my "(_*leetle*_)" Mario!*')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Luigi stood up. '),
        new Emphasis([
          new PlainText('Hello, my '),
          new InlineQuote([
            new NormalParenthetical([
              new PlainText('('),
              new Italic([
                new Emphasis([
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


context('Within emphasis, (inner) emphasis can close directly after a convention inside of it has closed.', () => {
  context('The innermost convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.parse('*Luigi stood up. *Help me find brother (Mario)*, I heard Luigi say.*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Emphasis([
            new PlainText('Luigi stood up. '),
            new Emphasis([
              new PlainText('Help me find brother '),
              new NormalParenthetical([
                new PlainText('(Mario)'),
              ]),
            ]),
            new PlainText(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Italics', () => {
      expect(Up.parse('*Luigi stood up. *Help me find brother _Mario_*, I heard Luigi say.*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Emphasis([
            new PlainText('Luigi stood up. '),
            new Emphasis([
              new PlainText('Help me find brother '),
              new Italic([
                new PlainText('Mario'),
              ]),
            ]),
            new PlainText(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Inline quotes', () => {
      expect(Up.parse('*Luigi stood up. *Help me find brother "Mario"*, I heard Luigi say.*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Emphasis([
            new PlainText('Luigi stood up. '),
            new Emphasis([
              new PlainText('Help me find brother '),
              new InlineQuote([
                new PlainText('Mario'),
              ]),
            ]),
            new PlainText(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Highlights (even when there is no space after the colon)', () => {
      expect(Up.parse('*Luigi stood up. *Help me find brother [highlight:Mario]*, I heard Luigi say.*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Emphasis([
            new PlainText('Luigi stood up. '),
            new Emphasis([
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


describe('An unmatched opening asterisk', () => {
  it('does not create an emphasis node', () => {
    expect(Up.parse('Hello, *world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, *world!')
      ]))
  })

  it('does not create an emphasis node, even when following 2 matching asterisks', () => {
    expect(Up.parse('*Hello*, *world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('Hello'),
        ]),
        new PlainText(', *world!')
      ]))
  })
})


describe('Matching single asterisks each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.parse('I believe * will win the primary in * easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I believe * will win the primary in * easily.')
      ]))
  })
})


describe('An asterisk followed by whitespace with a matching asterisk touching the end of a word', () => {
  it('does not produce an emphasis node and is preserved as plain text', () => {
    expect(Up.parse('I believe* my spelling* was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I believe* my spelling* was wrong.')
      ]))
  })
})


describe('An asterisk touching the beginning of a word with a matching asterisk preceded by whitespace', () => {
  it('does not produce an emphasis node and is preserved as plain text', () => {
    expect(Up.parse('I *believe my *spelling was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I *believe my *spelling was wrong.')
      ]))
  })
})
