import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Link } from '../../SyntaxNodes/Link'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'
import { Italic } from '../../SyntaxNodes/Italic'
import { Bold } from '../../SyntaxNodes/Bold'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { Highlight } from '../../SyntaxNodes/Highlight'
import { InlineNsfw } from '../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../SyntaxNodes/InlineNsfl'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'


context("Some bare URLs produce links. The content of a bare URL's link is the URL without its scheme.", () => {
  context('For a bare URL to produce a link, it must either:', () => {
    specify('Start with "https://', () => {
      expect(Up.parseDocument('Check out https://archive.org')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Check out '),
          new Link([
            new PlainText('archive.org')
          ], 'https://archive.org')
        ]))
    })

    specify('Start with "http://', () => {
      expect(Up.parseDocument('Check out https://archive.org')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Check out '),
          new Link([
            new PlainText('archive.org')
          ], 'https://archive.org')
        ]))
    })
  })


  context('A bare URL will not produce a link if:', () => {
    specify("It consists solely of 'http://'", () => {
      expect(Up.parseDocument('http://')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('http://')
        ]))
    })

    specify("It consists solely of 'https://'", () => {
      expect(Up.parseDocument('https://')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('https://')
        ]))
    })


    context("The scheme is immediately followed by punctuation, including (but not limited to):", () => {
      specify("Commas", () => {
        expect(Up.parseDocument('http://, now that is my favorite URL scheme!')).to.deep.equal(
          insideDocumentAndParagraph([
            new PlainText('http://, now that is my favorite URL scheme!')
          ]))
      })

      specify("Periods", () => {
        expect(Up.parseDocument('http://. Now that is my favorite URL scheme!')).to.deep.equal(
          insideDocumentAndParagraph([
            new PlainText('http://. Now that is my favorite URL scheme!')
          ]))
      })


      context('Dashes', () => {
        specify("comprising a typographical convention", () => {
          expect(Up.parseDocument('http://---now that is my favorite URL scheme!')).to.deep.equal(
            insideDocumentAndParagraph([
              new PlainText('http://—now that is my favorite URL scheme!')
            ]))
        })

        specify("not comprising a typographical convention", () => {
          expect(Up.parseDocument('http://-now that is my favorite URL scheme!')).to.deep.equal(
            insideDocumentAndParagraph([
              new PlainText('http://-now that is my favorite URL scheme!')
            ]))
        })
      })
    })
  })


  specify("It has a scheme other than 'https://' or 'http://", () => {
    expect(Up.parseDocument('ftp://google.com')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('ftp://google.com')
      ]))
  })

  specify("It doesn't have both forward slashes", () => {
    expect(Up.parseDocument('In the homepage field, you can use either http:/mailto:')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('In the homepage field, you can use either http:/mailto:')
      ]))
  })
})


context('Bare URLs are always terminated by whitespace:', () => {
  specify('Spaces', () => {
    expect(Up.parseDocument('https://archive.org is exciting')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org')
        ], 'https://archive.org'),
        new PlainText(' is exciting')
      ]))
  })

  specify('Tabs', () => {
    expect(Up.parseDocument('https://archive.org\tis exciting')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org')
        ], 'https://archive.org'),
        new PlainText('\tis exciting')
      ]))
  })
})


describe('A bare URL', () => {
  it('can have multiple subdomains', () => {
    expect(Up.parseDocument('https://this.is.a.very.real.url.co.uk')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('this.is.a.very.real.url.co.uk')
        ], 'https://this.is.a.very.real.url.co.uk')
      ]))
  })

  it('can contain consecutive periods in its path', () => {
    expect(Up.parseDocument('https://this.is.a.very.real.url.co.uk/and.i...love.full.stops')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('this.is.a.very.real.url.co.uk/and.i...love.full.stops')
        ], 'https://this.is.a.very.real.url.co.uk/and.i...love.full.stops')
      ]))
  })

  it('can have a path consisting only of a forward slash', () => {
    expect(Up.parseDocument('https://google.com/ is a neat site.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('google.com/')
        ], 'https://google.com/'),
        new PlainText(' is a neat site.')
      ]))
  })

  it('can contain escaped spaces', () => {
    expect(Up.parseDocument('https://archive.org/fake\\ url')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org/fake url')
        ], 'https://archive.org/fake url')
      ]))
  })

  it('can contain matching parentheses', () => {
    expect(Up.parseDocument('https://archive.org/fake(url)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org/fake(url)')
        ], 'https://archive.org/fake(url)')
      ]))
  })

  it('can contain any number of nested matching parentheses', () => {
    expect(Up.parseDocument('https://archive.org/a(fake(url))is(((very)))fun')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org/a(fake(url))is(((very)))fun')
        ], 'https://archive.org/a(fake(url))is(((very)))fun')
      ]))
  })

  it('can contain matching square brackets', () => {
    expect(Up.parseDocument('https://archive.org/fake[url]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org/fake[url]')
        ], 'https://archive.org/fake[url]')
      ]))
  })

  it('can contain any number of nested matching square brackets', () => {
    expect(Up.parseDocument('https://archive.org/a[fake[url]]is[[[very]]]fun')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('archive.org/a[fake[url]]is[[[very]]]fun')
        ], 'https://archive.org/a[fake[url]]is[[[very]]]fun')
      ]))
  })

  it("can be inside a link", () => {
    expect(Up.parseDocument('[Visit https://inner.example.com/fake right now!](https://outer.example.com/real)')).to.deep.equal(
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


  context('if not inside an emphasis/stress convention', () => {
    specify("can contain unescaped asterisks", () => {
      expect(Up.parseDocument('https://example.org/a*normal*url')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('example.org/a*normal*url')
          ], 'https://example.org/a*normal*url')
        ]))
    })

    specify("can contain unescaped consecutive asterisks", () => {
      expect(Up.parseDocument('https://example.org/a**normal**url')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('example.org/a**normal**url')
          ], 'https://example.org/a**normal**url')
        ]))
    })
  })


  context('if not inside an italic/bold convention', () => {
    specify("can contain unescaped underscores", () => {
      expect(Up.parseDocument('https://example.org/a_normal_url')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('example.org/a_normal_url')
          ], 'https://example.org/a_normal_url')
        ]))
    })

    specify("can contain unescaped consecutive underscores", () => {
      expect(Up.parseDocument('https://example.org/a__normal__url')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('example.org/a__normal__url')
          ], 'https://example.org/a__normal__url')
        ]))
    })
  })
})


context('Bare URLs are terminated when any outer convention closes. This includes:', () => {
  specify('Inline quotes', () => {
    expect(Up.parseDocument('"https://archive.org/fake"')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineQuote([
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
        ])
      ]))
  })

  specify('Parentheses', () => {
    expect(Up.parseDocument('(https://archive.org/fake)')).to.deep.equal(
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
    expect(Up.parseDocument('[https://archive.org/fake]')).to.deep.equal(
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

  specify("Highlights", () => {
    expect(Up.parseDocument('[highlight: I love https://archive.org/fake]!')).to.deep.equal(
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
    expect(Up.parseDocument('[SPOILER: I love https://archive.org/fake and you should too!]')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainText(' and you should too!')
        ])
      ]))
  })

  specify("Inline NSFW", () => {
    expect(Up.parseDocument('[NSFW: I love https://archive.org/fake and you should too!]')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineNsfw([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainText(' and you should too!')
        ])
      ]))
  })

  specify("Inline NSFL", () => {
    expect(Up.parseDocument('[NSFL: I love https://archive.org/fake and you should too!]')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineNsfl([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainText(' and you should too!')
        ])
      ]))
  })

  specify("Links", () => {
    expect(Up.parseDocument('[I love https://archive.org/fake] (example.com/outer) and you should too!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('I love '),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
        ], 'https://example.com/outer'),
        new PlainText(' and you should too!')
      ]))
  })

  specify("Footnotes", () => {
    const markup = "I don't eat cereal. [^ Well, I do: https://example.com/cereal] Never have."

    const footnote = new Footnote([
      new PlainText('Well, I do: '),
      new Link([
        new PlainText('example.com/cereal')
      ], 'https://example.com/cereal'),
    ], { referenceNumber: 1 })

    expect(Up.parseDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new PlainText(' Never have.')
        ]),
        new FootnoteBlock([footnote])
      ]))
  })


  context('Emphasis', () => {
    specify('Surrounded by 1 asterisk on either side', () => {
      expect(Up.parseDocument('*I love https://archive.org/fake*!')).to.deep.equal(
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
      expect(Up.parseDocument('*I love https://archive.org/fake***!')).to.deep.equal(
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

    specify('Starting with 2 asterisks and closing with 1', () => {
      expect(Up.parseDocument('**I love https://archive.org/fake*!')).to.deep.equal(
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

    specify('Starting with 3+ asterisks and closing with 1', () => {
      expect(Up.parseDocument('***I love https://archive.org/fake*!')).to.deep.equal(
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
      expect(Up.parseDocument('**I love https://archive.org/fake**!')).to.deep.equal(
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

    specify('Starting with 2 asterisks and closed with 3+)', () => {
      expect(Up.parseDocument('**I love https://archive.org/fake***!')).to.deep.equal(
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

    specify('Starting with 3+ asterisks and closing with 2', () => {
      expect(Up.parseDocument('***I love https://archive.org/fake**!')).to.deep.equal(
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
    expect(Up.parseDocument('***I love https://archive.org/fake***!')).to.deep.equal(
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


  context('Italic', () => {
    specify('Surrounded by 1 underscore on either side', () => {
      expect(Up.parseDocument('_I love https://archive.org/fake_!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new PlainText('I love '),
            new Link([
              new PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new PlainText('!')
        ]))
    })

    specify('Starting with 1 underscore and closed with 3+)', () => {
      expect(Up.parseDocument('_I love https://archive.org/fake___!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new PlainText('I love '),
            new Link([
              new PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new PlainText('!')
        ]))
    })

    specify('Starting with 2 underscores and closing with 1', () => {
      expect(Up.parseDocument('__I love https://archive.org/fake_!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new PlainText('I love '),
            new Link([
              new PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new PlainText('!')
        ]))
    })

    specify('Starting with 3+ underscores and closing with 1', () => {
      expect(Up.parseDocument('___I love https://archive.org/fake_!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new PlainText('I love '),
            new Link([
              new PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new PlainText('!')
        ]))
    })
  })


  context('Bold', () => {
    specify('Surrounded by 2 underscores on either side', () => {
      expect(Up.parseDocument('__I love https://archive.org/fake__!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Bold([
            new PlainText('I love '),
            new Link([
              new PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new PlainText('!')
        ]))
    })

    specify('Starting with 2 underscores and closed with 3+)', () => {
      expect(Up.parseDocument('__I love https://archive.org/fake___!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Bold([
            new PlainText('I love '),
            new Link([
              new PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new PlainText('!')
        ]))
    })

    specify('Starting with 3+ underscores and closing with 2', () => {
      expect(Up.parseDocument('___I love https://archive.org/fake__!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Bold([
            new PlainText('I love '),
            new Link([
              new PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new PlainText('!')
        ]))
    })
  })


  specify('Italic and bold together', () => {
    expect(Up.parseDocument('___I love https://archive.org/fake___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Bold([
          new Italic([
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


describe('Inside parantheses, a bare URL', () => {
  it('can contain matching parentheses', () => {
    expect(Up.parseDocument('(https://archive.org/fake(url))')).to.deep.equal(
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
    expect(Up.parseDocument('(https://archive.org/a(fake(url))is(((very)))fun)')).to.deep.equal(
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


describe('Inside square brackets, a bare URL', () => {
  it('can contain matching square brackets', () => {
    expect(Up.parseDocument('[https://archive.org/fake[url]]')).to.deep.equal(
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
    expect(Up.parseDocument('[https://archive.org/a[fake[url]]is[[[very]]]fun]')).to.deep.equal(
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


context('If a bare URL does not have a path, it is terminated by any punctuation. ', () => {
  context("This includes (but is not limited to):", () => {
    specify("Commas", () => {
      expect(Up.parseDocument('https://www.demo.example.co.uk, now that is my favorite site!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('www.demo.example.co.uk')
          ], 'https://www.demo.example.co.uk'),
          new PlainText(', now that is my favorite site!')
        ]))
    })

    specify("Periods", () => {
      expect(Up.parseDocument('https://www.demo.example.co.uk. Now that is my favorite site!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('www.demo.example.co.uk')
          ], 'https://www.demo.example.co.uk'),
          new PlainText('. Now that is my favorite site!')
        ]))
    })

    specify("Question marks", () => {
      expect(Up.parseDocument('https://www.demo.example.co.uk? Now that is my favorite site!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('www.demo.example.co.uk')
          ], 'https://www.demo.example.co.uk'),
          new PlainText('? Now that is my favorite site!')
        ]))
    })

    specify("Exclamation points", () => {
      expect(Up.parseDocument('https://www.demo.example.co.uk! Now that is my favorite site!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('www.demo.example.co.uk')
          ], 'https://www.demo.example.co.uk'),
          new PlainText('! Now that is my favorite site!')
        ]))
    })


    context('Dashes', () => {
      specify("comprising a typographical convention", () => {
        expect(Up.parseDocument('https://www.demo.example.co.uk---now that is my favorite site!')).to.deep.equal(
          insideDocumentAndParagraph([
            new Link([
              new PlainText('www.demo.example.co.uk')
            ], 'https://www.demo.example.co.uk'),
            new PlainText('—now that is my favorite site!')
          ]))
      })

      specify("not comprising a typographical convention", () => {
        expect(Up.parseDocument('https://www.demo.example.co.uk-now that is my favorite site!')).to.deep.equal(
          insideDocumentAndParagraph([
            new Link([
              new PlainText('www.demo.example.co.uk')
            ], 'https://www.demo.example.co.uk'),
            new PlainText('-now that is my favorite site!')
          ]))
      })
    })
  })


  context('The URL is terminated even when:', () => {
    specify('The punctuation is immediately followed by a valid URL path', () => {
      expect(Up.parseDocument('https://4chan.org.../r9k/ is a sad place.')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('4chan.org')
          ], 'https://4chan.org'),
          new PlainText('…/r9k/ is a sad place.')
        ]))
    })


    specify('The punctuation is at the end of a paragraph.', () => {
      expect(Up.parseDocument('Avoid visiting https://4chan.org.')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Avoid visiting '),
          new Link([
            new PlainText('4chan.org')
          ], 'https://4chan.org'),
          new PlainText('.')
        ]))
    })


    context('The bare URL is inside another convention, including (but not limited to):', () => {
      specify('Parentheses', () => {
        expect(Up.parseDocument('(For more info, visit https://archive.org!)')).to.deep.equal(
          insideDocumentAndParagraph([
            new NormalParenthetical([
              new PlainText('(For more info, visit '),
              new Link([
                new PlainText('archive.org')
              ], 'https://archive.org'),
              new PlainText('!)')
            ])
          ]))
      })

      specify('Square brackets', () => {
        expect(Up.parseDocument('[For more info, visit https://archive.org!]')).to.deep.equal(
          insideDocumentAndParagraph([
            new SquareParenthetical([
              new PlainText('[For more info, visit '),
              new Link([
                new PlainText('archive.org')
              ], 'https://archive.org'),
              new PlainText('!]')
            ])
          ]))
      })

      specify('Italics', () => {
        expect(Up.parseDocument('_For more info, visit https://archive.org!_')).to.deep.equal(
          insideDocumentAndParagraph([
            new Italic([
              new PlainText('For more info, visit '),
              new Link([
                new PlainText('archive.org')
              ], 'https://archive.org'),
              new PlainText('!')
            ])
          ]))
      })

      specify('Highlight', () => {
        expect(Up.parseDocument('[highlight: For more info, visit https://archive.org!]')).to.deep.equal(
          insideDocumentAndParagraph([
            new Highlight([
              new PlainText('For more info, visit '),
              new Link([
                new PlainText('archive.org')
              ], 'https://archive.org'),
              new PlainText('!')
            ])
          ]))
      })

      specify('Inline spoilers', () => {
        expect(Up.parseDocument('[SPOILER: For more info, visit https://archive.org!]')).to.deep.equal(
          insideDocumentAndParagraph([
            new InlineSpoiler([
              new PlainText('For more info, visit '),
              new Link([
                new PlainText('archive.org')
              ], 'https://archive.org'),
              new PlainText('!')
            ])
          ]))
      })
    })
  })
})
