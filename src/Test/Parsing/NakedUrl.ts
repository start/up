import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { Link } from '../../SyntaxNodes/Link'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'
import { RevisionInsertion } from '../../SyntaxNodes/RevisionInsertion'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'


context("Some naked URLs produce links. The content of those links is the URL without its scheme.", () => {
  context('For a naked URL to produce a link, it must either:', () => {
    specify('Start with "https://', () => {
      expect(Up.toDocument('Check out https://archive.org')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Check out '),
          new Link([
            new PlainText('archive.org')
          ], 'https://archive.org')
        ]))
    })

    specify('Start with "http://', () => {
      expect(Up.toDocument('Check out https://archive.org')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Check out '),
          new Link([
            new PlainText('archive.org')
          ], 'https://archive.org')
        ]))
    })
  })


  context('A naked URL will not produce a link if:', () => {
    specify("It consists solely of 'http://'", () => {
      expect(Up.toDocument('http://')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('http://')
        ]))
    })

    specify("It consists solely of 'https://'", () => {
      expect(Up.toDocument('https://')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('https://')
        ]))
    })
  })


  specify("It has a scheme other than 'https://' or 'http://", () => {
    expect(Up.toDocument('ftp://google.com')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('ftp://google.com')
      ]))
  })

  specify("It doesn't have both forward slashes", () => {
    expect(Up.toDocument('In the homepage field, you can use either http:/mailto:')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('In the homepage field, you can use either http:/mailto:')
      ]))
  })
})


describe('A naked URL', () => {
  it('is terminated by a space', () => {
    expect(Up.toDocument('https://archive.org is exciting')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org')
        ], 'https://archive.org'),
        new PlainText(' is exciting')
      ]))
  })

  it('can contain escaped spaces', () => {
    expect(Up.toDocument('https://archive.org/fake\\ url')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org/fake url')
        ], 'https://archive.org/fake url')
      ]))
  })

  it('is terminated by a parenthesized convention closing', () => {
    expect(Up.toDocument('(https://archive.org/fake)')).to.deep.equal(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainText(')')
        ])
      ]))
  })

  it('is terminated by a square bracketed convention closing', () => {
    expect(Up.toDocument('[https://archive.org/fake]')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('['),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainText(']')
        ])
      ]))
  })

  it('can contain matching parentheses', () => {
    expect(Up.toDocument('https://archive.org/fake(url)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org/fake(url)')
        ], 'https://archive.org/fake(url)')
      ]))
  })

  it('can contain matching square brackets', () => {
    expect(Up.toDocument('https://archive.org/fake[url]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org/fake[url]')
        ], 'https://archive.org/fake[url]')
      ]))
  })

  it("can be inside a link", () => {
    expect(Up.toDocument('[https://inner.example.com/fake][https://outer.example.com/real]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new Link([
            new PlainText('inner.example.com/fake')
          ], 'https://inner.example.com/fake')
        ], 'https://outer.example.com/real')
      ]))
  })

  it("is terminated by revision insertion closing", () => {
    expect(Up.toDocument('++I love... https://archive.org/fake++!')).to.deep.equal(
      insideDocumentAndParagraph([
        new RevisionInsertion([
          new PlainText('I love... '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainText('!')
      ]))
  })

  it('is terminated by emphasis closing', () => {
    expect(Up.toDocument('*I love... https://archive.org/fake*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('I love... '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainText('!')
      ]))
  })

  it('is closed by stress closing', () => {
    expect(Up.toDocument('**I love https://archive.org/fake**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainText('!')
      ]))
  })

  it('is closed by shouting closing', () => {
    expect(Up.toDocument('***I love https://archive.org/fake***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Stress([
          new Emphasis([
            new PlainText('I love '),
            new Link([
              new PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ])
        ]),
        new PlainText('!')
      ]))
  })

  it('is closed by 3 or more asterisks closing emphasis', () => {
    expect(Up.toDocument('*I love https://archive.org/fake***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainText('!')
      ]))
  })

  it('is closed by 3 or more asterisks closing emphasis', () => {
    expect(Up.toDocument('**I love https://archive.org/fake***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainText('!')
      ]))
  })

  it('is closed by emphasis (starting with 2 asterisks) closing with 1 asterisk', () => {
    expect(Up.toDocument('**I love https://archive.org/fake*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainText('!')
      ]))
  })

  it('is closed by emphasis (starting with 3+ asterisks) closing with 1 asterisk', () => {
    expect(Up.toDocument('***I love https://archive.org/fake*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainText('!')
      ]))
  })

  it('is closed by stress (starting with 3+ asterisks) closing with 2 asterisks', () => {
    expect(Up.toDocument('***I love https://archive.org/fake**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainText('!')
      ]))
  })

  it("can contain unescaped asterisks if not inside an emphasis convention", () => {
    expect(Up.toDocument('https://example.org/a*normal*url')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('example.org/a*normal*url')
        ], 'https://example.org/a*normal*url')
      ]))
  })
})


describe('Inside parantheses, a naked URL', () => {
  it('can contain matching parentheses', () => {
    expect(Up.toDocument('(https://archive.org/fake(url))')).to.deep.equal(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('archive.org/fake(url)')
          ], 'https://archive.org/fake(url)'),
          new PlainText(')')
        ])
      ]))
  })
})


describe('Inside square brackets, a naked URL', () => {
  it('can contain matching square brackets', () => {
    expect(Up.toDocument('[https://archive.org/fake[url]]')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('['),
          new Link([
            new PlainText('archive.org/fake[url]')
          ], 'https://archive.org/fake[url]'),
          new PlainText(']')
        ])
      ]))
  })
})
