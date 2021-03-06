import { expect } from 'chai'
import * as Up from '../../../Main'
import { insideDocumentAndParagraph } from '../Helpers'


context('Within italics, (inner) italics can be the first convention within any other inner convention.', () => {
  context('The other convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.parse('Luigi stood up. _Hello, my (_leetle_) Mario!_')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.Italic([
            new Up.Text('Hello, my '),
            new Up.NormalParenthetical([
              new Up.Text('('),
              new Up.Italic([
                new Up.Text('leetle')
              ]),
              new Up.Text(')')
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.parse('Luigi stood up. _Hello, my *_leetle_* Mario!_')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.Italic([
            new Up.Text('Hello, my '),
            new Up.Emphasis([
              new Up.Italic([
                new Up.Text('leetle')
              ])
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })

    specify('Inline quotes', () => {
      expect(Up.parse('Luigi stood up. _Hello, my "_leetle_" Mario!_')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.Italic([
            new Up.Text('Hello, my '),
            new Up.InlineQuote([
              new Up.Italic([
                new Up.Text('leetle')
              ])
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })

    specify('Inline revealables (even when there is no space after the colon)', () => {
      expect(Up.parse('Luigi stood up. _Hello, my [spoiler:_leetle_] Mario!_')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Luigi stood up. '),
          new Up.Italic([
            new Up.Text('Hello, my '),
            new Up.InlineRevealable([
              new Up.Italic([
                new Up.Text('leetle')
              ])
            ]),
            new Up.Text(' Mario!')
          ])
        ]))
    })
  })


  specify('The inner italics can open immediately after several conventions have just opened', () => {
    expect(Up.parse('Luigi stood up. _Hello, my "(*_leetle_*)" Mario!_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Luigi stood up. '),
        new Up.Italic([
          new Up.Text('Hello, my '),
          new Up.InlineQuote([
            new Up.NormalParenthetical([
              new Up.Text('('),
              new Up.Emphasis([
                new Up.Italic([
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


context('Within italics, (inner) italics can close directly after a convention inside of it has closed.', () => {
  context('The innermost convention can be (but is not limited to):', () => {
    specify('Normal parentheticals', () => {
      expect(Up.parse('_Luigi stood up. _Help me find brother (Mario)_, I heard Luigi say._')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.Text('Luigi stood up. '),
            new Up.Italic([
              new Up.Text('Help me find brother '),
              new Up.NormalParenthetical([
                new Up.Text('(Mario)')
              ])
            ]),
            new Up.Text(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.parse('_Luigi stood up. _Help me find brother *Mario*_, I heard Luigi say._')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.Text('Luigi stood up. '),
            new Up.Italic([
              new Up.Text('Help me find brother '),
              new Up.Emphasis([
                new Up.Text('Mario')
              ])
            ]),
            new Up.Text(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Inline quotes', () => {
      expect(Up.parse('_Luigi stood up. _Help me find brother "Mario"_, I heard Luigi say._')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.Text('Luigi stood up. '),
            new Up.Italic([
              new Up.Text('Help me find brother '),
              new Up.InlineQuote([
                new Up.Text('Mario')
              ])
            ]),
            new Up.Text(', I heard Luigi say.')
          ])
        ]))
    })

    specify('Inline revealables (even when there is no space after the colon)', () => {
      expect(Up.parse('_Luigi stood up. _Help me find brother [spoiler:Mario]_, I heard Luigi say._')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.Text('Luigi stood up. '),
            new Up.Italic([
              new Up.Text('Help me find brother '),
              new Up.InlineRevealable([
                new Up.Text('Mario')
              ])
            ]),
            new Up.Text(', I heard Luigi say.')
          ])
        ]))
    })
  })
})


describe('An unmatched opening underscore', () => {
  it('does not create an italics node', () => {
    expect(Up.parse('Hello, _world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, _world!')
      ]))
  })

  it('does not create an italics node, even when following 2 matching underscores', () => {
    expect(Up.parse('_Hello_, _world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('Hello')
        ]),
        new Up.Text(', _world!')
      ]))
  })
})


describe('Matching single underscores each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.parse('I believe _ will win the primary in _ easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I believe _ will win the primary in _ easily.')
      ]))
  })
})


describe('An underscore followed by whitespace with a matching underscore touching the end of a word', () => {
  it('does not produce an italics node and is preserved as plain text', () => {
    expect(Up.parse('I believe_ my spelling_ was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I believe_ my spelling_ was wrong.')
      ]))
  })
})


describe('An underscore touching the beginning of a word with a matching underscore preceded by whitespace', () => {
  it('does not produce an italics node and is preserved as plain text', () => {
    expect(Up.parse('I _believe my _spelling was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I _believe my _spelling was wrong.')
      ]))
  })
})
