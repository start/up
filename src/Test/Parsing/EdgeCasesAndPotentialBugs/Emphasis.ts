import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


context('Within emphasis, (inner) emphasis can be the first convention within any other inner convention.', () => {
  context('The other convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.parse('Luigi stood up. *Hello, my (*leetle*) Mario!*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.Emphasis([
            new Up.Text('Hello, my '),
            new Up.NormalParenthetical([
              new Up.Text('('),
              new Up.Emphasis([
                new Up.Text('leetle')
              ]),
              new Up.Text(')')
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })

    specify('Italics', () => {
      expect(Up.parse('Luigi stood up. *Hello, my _*leetle*_ Mario!*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.Emphasis([
            new Up.Text('Hello, my '),
            new Up.Italic([
              new Up.Emphasis([
                new Up.Text('leetle')
              ]),
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })

    specify('Inline quotes', () => {
      expect(Up.parse('Luigi stood up. *Hello, my "*leetle*" Mario!*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.Emphasis([
            new Up.Text('Hello, my '),
            new Up.InlineQuote([
              new Up.Emphasis([
                new Up.Text('leetle')
              ]),
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })

    specify('Highlights (even when there is no space after the colon)', () => {
      expect(Up.parse('Luigi stood up. *Hello, my [highlight:*leetle*] Mario!*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.Emphasis([
            new Up.Text('Hello, my '),
            new Up.Highlight([
              new Up.Emphasis([
                new Up.Text('leetle')
              ])
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })
  })


  specify('The inner emphasis can open immediately after several conventions have just opened', () => {
    expect(Up.parse('Luigi stood up. *Hello, my "(_*leetle*_)" Mario!*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Luigi stood up. '),
        new Up.Emphasis([
          new Up.Text('Hello, my '),
          new Up.InlineQuote([
            new Up.NormalParenthetical([
              new Up.Text('('),
              new Up.Italic([
                new Up.Emphasis([
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


context('Within emphasis, (inner) emphasis can close directly after a convention inside of it has closed.', () => {
  context('The innermost convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.parse('*Luigi stood up. *Help me find brother (Mario)*, I heard Luigi say.*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.Text('Luigi stood up. '),
            new Up.Emphasis([
              new Up.Text('Help me find brother '),
              new Up.NormalParenthetical([
                new Up.Text('(Mario)'),
              ]),
            ]),
            new Up.Text(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Italics', () => {
      expect(Up.parse('*Luigi stood up. *Help me find brother _Mario_*, I heard Luigi say.*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.Text('Luigi stood up. '),
            new Up.Emphasis([
              new Up.Text('Help me find brother '),
              new Up.Italic([
                new Up.Text('Mario'),
              ]),
            ]),
            new Up.Text(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Inline quotes', () => {
      expect(Up.parse('*Luigi stood up. *Help me find brother "Mario"*, I heard Luigi say.*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.Text('Luigi stood up. '),
            new Up.Emphasis([
              new Up.Text('Help me find brother '),
              new Up.InlineQuote([
                new Up.Text('Mario'),
              ]),
            ]),
            new Up.Text(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Highlights (even when there is no space after the colon)', () => {
      expect(Up.parse('*Luigi stood up. *Help me find brother [highlight:Mario]*, I heard Luigi say.*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.Text('Luigi stood up. '),
            new Up.Emphasis([
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


describe('An unmatched opening asterisk', () => {
  it('does not create an emphasis node', () => {
    expect(Up.parse('Hello, *world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, *world!')
      ]))
  })

  it('does not create an emphasis node, even when following 2 matching asterisks', () => {
    expect(Up.parse('*Hello*, *world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('Hello'),
        ]),
        new Up.Text(', *world!')
      ]))
  })
})


describe('Matching single asterisks each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.parse('I believe * will win the primary in * easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I believe * will win the primary in * easily.')
      ]))
  })
})


describe('An asterisk followed by whitespace with a matching asterisk touching the end of a word', () => {
  it('does not produce an emphasis node and is preserved as plain text', () => {
    expect(Up.parse('I believe* my spelling* was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I believe* my spelling* was wrong.')
      ]))
  })
})


describe('An asterisk touching the beginning of a word with a matching asterisk preceded by whitespace', () => {
  it('does not produce an emphasis node and is preserved as plain text', () => {
    expect(Up.parse('I *believe my *spelling was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I *believe my *spelling was wrong.')
      ]))
  })
})
