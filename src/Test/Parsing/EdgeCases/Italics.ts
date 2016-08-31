import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Italic } from '../../../SyntaxNodes/Italic'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { InlineQuote } from '../../../SyntaxNodes/InlineQuote'
import { Highlight } from '../../../SyntaxNodes/Highlight'


context('Within italics, (inner) italics can be the first convention within any other inner convention.', () => {
  context('The other convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.toDocument('Luigi stood up. _Hello, my (_leetle_) Mario!_')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new Italic([
            new PlainText('Hello, my '),
            new NormalParenthetical([
              new PlainText('('),
              new Italic([
                new PlainText('leetle')
              ]),
              new PlainText(')')
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.toDocument('Luigi stood up. _Hello, my *_leetle_* Mario!_')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new Italic([
            new PlainText('Hello, my '),
            new Emphasis([
              new Italic([
                new PlainText('leetle')
              ]),
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })

    specify('Inline quotes', () => {
      expect(Up.toDocument('Luigi stood up. _Hello, my "_leetle_" Mario!_')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new Italic([
            new PlainText('Hello, my '),
            new InlineQuote([
              new Italic([
                new PlainText('leetle')
              ]),
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })

    specify('Highlights (even when there is no space after the colon)', () => {
      expect(Up.toDocument('Luigi stood up. _Hello, my [highlight:_leetle_] Mario!_')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Luigi stood up. '),
          new Italic([
            new PlainText('Hello, my '),
            new Highlight([
              new Italic([
                new PlainText('leetle')
              ])
            ]),
            new PlainText(' Mario!')
          ])
        ]))
    })
  })


  specify('The inner italics can open immediately after several conventions have just opened', () => {
    expect(Up.toDocument('Luigi stood up. _Hello, my "(*_leetle_*)" Mario!_')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Luigi stood up. '),
        new Italic([
          new PlainText('Hello, my '),
          new InlineQuote([
            new NormalParenthetical([
              new PlainText('('),
              new Emphasis([
                new Italic([
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


context('Within italics, (inner) italics can close directly after a convention inside of it has closed.', () => {
  context('The innermost convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.toDocument('_Luigi stood up. _Help me find brother (Mario)_, I heard Luigi say._')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new PlainText('Luigi stood up. '),
            new Italic([
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
      expect(Up.toDocument('_Luigi stood up. _Help me find brother *Mario*_, I heard Luigi say._')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new PlainText('Luigi stood up. '),
            new Italic([
              new PlainText('Help me find brother '),
              new Emphasis([
                new PlainText('Mario'),
              ]),
            ]),
            new PlainText(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Inline quotes', () => {
      expect(Up.toDocument('_Luigi stood up. _Help me find brother "Mario"_, I heard Luigi say._')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new PlainText('Luigi stood up. '),
            new Italic([
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
      expect(Up.toDocument('_Luigi stood up. _Help me find brother [highlight:Mario]_, I heard Luigi say._')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new PlainText('Luigi stood up. '),
            new Italic([
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


describe('An unmatched opening underscore', () => {
  it('does not create an italic node', () => {
    expect(Up.toDocument('Hello, _world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, _world!')
      ]))
  })

  it('does not create an italic node, even when following 2 matching underscores', () => {
    expect(Up.toDocument('_Hello_, _world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Hello'),
        ]),
        new PlainText(', _world!')
      ]))
  })
})


describe('Matching single underscores each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.toDocument('I believe _ will win the primary in _ easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I believe _ will win the primary in _ easily.')
      ]))
  })
})


describe('An underscore followed by whitespace with a matching underscore touching the end of a word', () => {
  it('does not produce an italic node and is preserved as plain text', () => {
    expect(Up.toDocument('I believe_ my spelling_ was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I believe_ my spelling_ was wrong.')
      ]))
  })
})


describe('An underscore touching the beginning of a word with a matching underscore preceded by whitespace', () => {
  it('does not produce an italic node and is preserved as plain text', () => {
    expect(Up.toDocument('I _believe my _spelling was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I _believe my _spelling was wrong.')
      ]))
  })
})
