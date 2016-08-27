import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { Link } from '../../SyntaxNodes/Link'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'
import { RevisionInsertion } from '../../SyntaxNodes/RevisionInsertion'
import { RevisionDeletion } from '../../SyntaxNodes/RevisionDeletion'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { Highlight } from '../../SyntaxNodes/Highlight'
import { InlineNsfw } from '../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../SyntaxNodes/InlineNsfl'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'


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


context('Naked URLs are terminated by whitespace:', () => {
  specify('Spaces', () => {
    expect(Up.toDocument('https://archive.org is exciting')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org')
        ], 'https://archive.org'),
        new PlainText(' is exciting')
      ]))
  })

  specify('Tabs', () => {
    expect(Up.toDocument('https://archive.org\tis exciting')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org')
        ], 'https://archive.org'),
        new PlainText('\tis exciting')
      ]))
  })
})


context('Naked URLs are terminated by certain common punctuation', () => {
  specify('Spaces', () => {
    expect(Up.toDocument('https://archive.org is exciting')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org')
        ], 'https://archive.org'),
        new PlainText(' is exciting')
      ]))
  })

  specify('Tabs', () => {
    expect(Up.toDocument('https://archive.org\tis exciting')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org')
        ], 'https://archive.org'),
        new PlainText('\tis exciting')
      ]))
  })
})


describe('A naked URL', () => {
  it('can have multiple subdomains', () => {
    expect(Up.toDocument('https://this.is.a.very.real.url.co.uk')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('this.is.a.very.real.url.co.uk')
        ], 'https://this.is.a.very.real.url.co.uk')
      ]))
  })

  it('can contain non-consecutive periods in its path)', () => {
    expect(Up.toDocument('https://this.is.a.very.real.url.co.uk/and.i.love.full.stops')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('this.is.a.very.real.url.co.uk/and.i.love.full.stops')
        ], 'https://this.is.a.very.real.url.co.uk/and.i.love.full.stops')
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

  it('can contain matching parentheses', () => {
    expect(Up.toDocument('https://archive.org/fake(url)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org/fake(url)')
        ], 'https://archive.org/fake(url)')
      ]))
  })

  it('can contain any number of nested matching parentheses', () => {
    expect(Up.toDocument('https://archive.org/a(fake(url))is(((very)))fun')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org/a(fake(url))is(((very)))fun')
        ], 'https://archive.org/a(fake(url))is(((very)))fun')
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

  it('can contain any number of nested matching square brackets', () => {
    expect(Up.toDocument('https://archive.org/a[fake[url]]is[[[very]]]fun')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org/a[fake[url]]is[[[very]]]fun')
        ], 'https://archive.org/a[fake[url]]is[[[very]]]fun')
      ]))
  })

  it("can be inside a link", () => {
    expect(Up.toDocument('[Visit https://inner.example.com/fake right now!](https://outer.example.com/real)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Visit '),
          new Link([
            new PlainText('inner.example.com/fake')
          ], 'https://inner.example.com/fake'),
          new PlainText(' right now!')
        ], 'https://outer.example.com/real')
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


context('Naked URLs are terminated when any outer convention closes. This includes:', () => {
  specify('Inline quotes', () => {
    expect(Up.toDocument('"https://archive.org/fake"')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineQuote([
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
        ])
      ]))
  })

  specify('Parentheses', () => {
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

  specify('Square brackets', () => {
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

  specify("Revision insertion", () => {
    expect(Up.toDocument('++I love https://archive.org/fake++!')).to.deep.equal(
      insideDocumentAndParagraph([
        new RevisionInsertion([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainText('!')
      ]))
  })

  specify("Revision deletion", () => {
    expect(Up.toDocument('~~I love https://archive.org/fake~~!')).to.deep.equal(
      insideDocumentAndParagraph([
        new RevisionDeletion([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainText('!')
      ]))
  })

  specify("Highlights", () => {
    expect(Up.toDocument('[highlight: I love https://archive.org/fake]!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Highlight([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new PlainText('!')
      ]))
  })

  specify("Inline spoilers", () => {
    expect(Up.toDocument('[SPOILER: I love https://archive.org/fake and you should too!]')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainText(' and you should too!')
        ]),
      ]))
  })

  specify("Inline NSFW", () => {
    expect(Up.toDocument('[NSFW: I love https://archive.org/fake and you should too!]')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineNsfw([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainText(' and you should too!')
        ]),
      ]))
  })

  specify("Inline NSFL", () => {
    expect(Up.toDocument('[NSFL: I love https://archive.org/fake and you should too!]')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineNsfl([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainText(' and you should too!')
        ]),
      ]))
  })

  context('Emphasis', () => {
    specify('Surrounded by 1 asterisk on either side', () => {
      expect(Up.toDocument('*I love https://archive.org/fake*!')).to.deep.equal(
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

    specify('Starting with 1 asterisk and closed with 3+)', () => {
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

    it('Starting with 2 asterisk and closing with 1', () => {
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

    it('Starting with 3+ asterisk and closing with 1', () => {
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
  })

  context('Stress', () => {
    specify('Surrounded by 2 asterisks on either side', () => {
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

    specify('Starting with 2 asterisk and closed with 3+)', () => {
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

    it('Starting with 3+ asterisk and closing with 2', () => {
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
  })

  specify('Emphasis and stress together', () => {
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

  it('can contain any number of nested matching parentheses', () => {
    expect(Up.toDocument('(https://archive.org/a(fake(url))is(((very)))fun)')).to.deep.equal(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('archive.org/a(fake(url))is(((very)))fun')
          ], 'https://archive.org/a(fake(url))is(((very)))fun'),
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

  it('can contain any number of nested matching square brackets', () => {
    expect(Up.toDocument('[https://archive.org/a[fake[url]]is[[[very]]]fun]')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('['),
          new Link([
            new PlainText('archive.org/a[fake[url]]is[[[very]]]fun')
          ], 'https://archive.org/a[fake[url]]is[[[very]]]fun'),
          new PlainText(']')
        ])
      ]))
  })
})
