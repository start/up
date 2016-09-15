import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


context("Some bare URLs produce links. The content of a bare URL's link is the URL without its scheme.", () => {
  context('For a bare URL to produce a link, it must either:', () => {
    specify('Start with "https://', () => {
      expect(Up.parse('Check out https://archive.org')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Check out '),
          new Up.Link([
            new Up.PlainText('archive.org')
          ], 'https://archive.org')
        ]))
    })

    specify('Start with "http://', () => {
      expect(Up.parse('Check out https://archive.org')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Check out '),
          new Up.Link([
            new Up.PlainText('archive.org')
          ], 'https://archive.org')
        ]))
    })
  })


  context('A bare URL will not produce a link if:', () => {
    specify("It consists solely of 'http://'", () => {
      expect(Up.parse('http://')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('http://')
        ]))
    })

    specify("It consists solely of 'https://'", () => {
      expect(Up.parse('https://')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('https://')
        ]))
    })


    context("The scheme is immediately followed by punctuation, including (but not limited to):", () => {
      specify("Commas", () => {
        expect(Up.parse('http://, now that is my favorite URL scheme!')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.PlainText('http://, now that is my favorite URL scheme!')
          ]))
      })

      specify("Periods", () => {
        expect(Up.parse('http://. Now that is my favorite URL scheme!')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.PlainText('http://. Now that is my favorite URL scheme!')
          ]))
      })


      context('Dashes', () => {
        specify("comprising a typographical convention", () => {
          expect(Up.parse('http://---now that is my favorite URL scheme!')).to.deep.equal(
            insideDocumentAndParagraph([
              new Up.PlainText('http://—now that is my favorite URL scheme!')
            ]))
        })

        specify("not comprising a typographical convention", () => {
          expect(Up.parse('http://-now that is my favorite URL scheme!')).to.deep.equal(
            insideDocumentAndParagraph([
              new Up.PlainText('http://-now that is my favorite URL scheme!')
            ]))
        })
      })
    })
  })


  specify("It has a scheme other than 'https://' or 'http://", () => {
    expect(Up.parse('ftp://google.com')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('ftp://google.com')
      ]))
  })

  specify("It doesn't have both forward slashes", () => {
    expect(Up.parse('In the homepage field, you can use either http:/mailto:')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('In the homepage field, you can use either http:/mailto:')
      ]))
  })
})


context('Bare URLs are always terminated by whitespace:', () => {
  specify('Spaces', () => {
    expect(Up.parse('https://archive.org is exciting')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('archive.org')
        ], 'https://archive.org'),
        new Up.PlainText(' is exciting')
      ]))
  })

  specify('Tabs', () => {
    expect(Up.parse('https://archive.org\tis exciting')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('archive.org')
        ], 'https://archive.org'),
        new Up.PlainText('\tis exciting')
      ]))
  })
})


describe('A bare URL', () => {
  it('can have multiple subdomains', () => {
    expect(Up.parse('https://this.is.a.very.real.url.co.uk')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('this.is.a.very.real.url.co.uk')
        ], 'https://this.is.a.very.real.url.co.uk')
      ]))
  })

  it('can contain consecutive periods in its path', () => {
    expect(Up.parse('https://this.is.a.very.real.url.co.uk/and.i...love.full.stops')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('this.is.a.very.real.url.co.uk/and.i...love.full.stops')
        ], 'https://this.is.a.very.real.url.co.uk/and.i...love.full.stops')
      ]))
  })

  it('can have a path consisting only of a forward slash', () => {
    expect(Up.parse('https://google.com/ is a neat site.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('google.com/')
        ], 'https://google.com/'),
        new Up.PlainText(' is a neat site.')
      ]))
  })

  it('can contain escaped spaces', () => {
    expect(Up.parse('https://archive.org/fake\\ url')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('archive.org/fake url')
        ], 'https://archive.org/fake url')
      ]))
  })

  it('can contain matching parentheses', () => {
    expect(Up.parse('https://archive.org/fake(url)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('archive.org/fake(url)')
        ], 'https://archive.org/fake(url)')
      ]))
  })

  it('can contain any number of nested matching parentheses', () => {
    expect(Up.parse('https://archive.org/a(fake(url))is(((very)))fun')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('archive.org/a(fake(url))is(((very)))fun')
        ], 'https://archive.org/a(fake(url))is(((very)))fun')
      ]))
  })

  it('can contain matching square brackets', () => {
    expect(Up.parse('https://archive.org/fake[url]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('archive.org/fake[url]')
        ], 'https://archive.org/fake[url]')
      ]))
  })

  it('can contain any number of nested matching square brackets', () => {
    expect(Up.parse('https://archive.org/a[fake[url]]is[[[very]]]fun')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('archive.org/a[fake[url]]is[[[very]]]fun')
        ], 'https://archive.org/a[fake[url]]is[[[very]]]fun')
      ]))
  })

  it("can be inside a link", () => {
    expect(Up.parse('[Visit https://inner.example.com/fake right now!](https://outer.example.com/real)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('Visit '),
          new Up.Link([
            new Up.PlainText('inner.example.com/fake')
          ], 'https://inner.example.com/fake'),
          new Up.PlainText(' right now!')
        ], 'https://outer.example.com/real')
      ]))
  })


  context('if not inside an emphasis/stress convention', () => {
    specify("can contain unescaped asterisks", () => {
      expect(Up.parse('https://example.org/a*normal*url')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('example.org/a*normal*url')
          ], 'https://example.org/a*normal*url')
        ]))
    })

    specify("can contain unescaped consecutive asterisks", () => {
      expect(Up.parse('https://example.org/a**normal**url')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('example.org/a**normal**url')
          ], 'https://example.org/a**normal**url')
        ]))
    })
  })


  context('if not inside an italic/bold convention', () => {
    specify("can contain unescaped underscores", () => {
      expect(Up.parse('https://example.org/a_normal_url')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('example.org/a_normal_url')
          ], 'https://example.org/a_normal_url')
        ]))
    })

    specify("can contain unescaped consecutive underscores", () => {
      expect(Up.parse('https://example.org/a__normal__url')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('example.org/a__normal__url')
          ], 'https://example.org/a__normal__url')
        ]))
    })
  })
})


context('Bare URLs are terminated when any outer convention closes. This includes:', () => {
  specify('Inline quotes', () => {
    expect(Up.parse('"https://archive.org/fake"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Link([
            new Up.PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
        ])
      ]))
  })

  specify('Parentheses', () => {
    expect(Up.parse('(https://archive.org/fake)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new Up.PlainText(')')
        ])
      ]))
  })

  specify('Square brackets', () => {
    expect(Up.parse('[https://archive.org/fake]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('['),
          new Up.Link([
            new Up.PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new Up.PlainText(']')
        ])
      ]))
  })

  specify("Highlights", () => {
    expect(Up.parse('[highlight: I love https://archive.org/fake]!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.PlainText('I love '),
          new Up.Link([
            new Up.PlainText('archive.org/fake')
          ], 'https://archive.org/fake')
        ]),
        new Up.PlainText('!')
      ]))
  })

  specify("Inline spoilers", () => {
    expect(Up.parse('[SPOILER: I love https://archive.org/fake and you should too!]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.PlainText('I love '),
          new Up.Link([
            new Up.PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new Up.PlainText(' and you should too!')
        ])
      ]))
  })

  specify("Inline NSFW", () => {
    expect(Up.parse('[NSFW: I love https://archive.org/fake and you should too!]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineNsfw([
          new Up.PlainText('I love '),
          new Up.Link([
            new Up.PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new Up.PlainText(' and you should too!')
        ])
      ]))
  })

  specify("Inline NSFL", () => {
    expect(Up.parse('[NSFL: I love https://archive.org/fake and you should too!]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineNsfl([
          new Up.PlainText('I love '),
          new Up.Link([
            new Up.PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new Up.PlainText(' and you should too!')
        ])
      ]))
  })

  specify("Links", () => {
    expect(Up.parse('[I love https://archive.org/fake] (example.com/outer) and you should too!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('I love '),
          new Up.Link([
            new Up.PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
        ], 'https://example.com/outer'),
        new Up.PlainText(' and you should too!')
      ]))
  })

  specify("Footnotes", () => {
    const markup = "I don't eat cereal. [^ Well, I do: https://example.com/cereal] Never have."

    const footnote = new Up.Footnote([
      new Up.PlainText('Well, I do: '),
      new Up.Link([
        new Up.PlainText('example.com/cereal')
      ], 'https://example.com/cereal'),
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal."),
          footnote,
          new Up.PlainText(' Never have.')
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })


  context('Emphasis', () => {
    specify('Surrounded by 1 asterisk on either side', () => {
      expect(Up.parse('*I love https://archive.org/fake*!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })

    specify('Starting with 1 asterisk and closed with 3+)', () => {
      expect(Up.parse('*I love https://archive.org/fake***!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })

    specify('Starting with 2 asterisks and closing with 1', () => {
      expect(Up.parse('**I love https://archive.org/fake*!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })

    specify('Starting with 3+ asterisks and closing with 1', () => {
      expect(Up.parse('***I love https://archive.org/fake*!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })
  })


  context('Stress', () => {
    specify('Surrounded by 2 asterisks on either side', () => {
      expect(Up.parse('**I love https://archive.org/fake**!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })

    specify('Starting with 2 asterisks and closed with 3+)', () => {
      expect(Up.parse('**I love https://archive.org/fake***!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })

    specify('Starting with 3+ asterisks and closing with 2', () => {
      expect(Up.parse('***I love https://archive.org/fake**!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })
  })


  specify('Emphasis and stress together', () => {
    expect(Up.parse('***I love https://archive.org/fake***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.Emphasis([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ])
        ]),
        new Up.PlainText('!')
      ]))
  })


  context('Italic', () => {
    specify('Surrounded by 1 underscore on either side', () => {
      expect(Up.parse('_I love https://archive.org/fake_!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })

    specify('Starting with 1 underscore and closed with 3+)', () => {
      expect(Up.parse('_I love https://archive.org/fake___!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })

    specify('Starting with 2 underscores and closing with 1', () => {
      expect(Up.parse('__I love https://archive.org/fake_!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })

    specify('Starting with 3+ underscores and closing with 1', () => {
      expect(Up.parse('___I love https://archive.org/fake_!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })
  })


  context('Bold', () => {
    specify('Surrounded by 2 underscores on either side', () => {
      expect(Up.parse('__I love https://archive.org/fake__!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Bold([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })

    specify('Starting with 2 underscores and closed with 3+)', () => {
      expect(Up.parse('__I love https://archive.org/fake___!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Bold([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })

    specify('Starting with 3+ underscores and closing with 2', () => {
      expect(Up.parse('___I love https://archive.org/fake__!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Bold([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ]),
          new Up.PlainText('!')
        ]))
    })
  })


  specify('Italic and bold together', () => {
    expect(Up.parse('___I love https://archive.org/fake___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.Italic([
            new Up.PlainText('I love '),
            new Up.Link([
              new Up.PlainText('archive.org/fake')
            ], 'https://archive.org/fake')
          ])
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('Inside parantheses, a bare URL', () => {
  it('can contain matching parentheses', () => {
    expect(Up.parse('(https://archive.org/fake(url))')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('archive.org/fake(url)')
          ], 'https://archive.org/fake(url)'),
          new Up.PlainText(')')
        ])
      ]))
  })

  it('can contain any number of nested matching parentheses', () => {
    expect(Up.parse('(https://archive.org/a(fake(url))is(((very)))fun)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('archive.org/a(fake(url))is(((very)))fun')
          ], 'https://archive.org/a(fake(url))is(((very)))fun'),
          new Up.PlainText(')')
        ])
      ]))
  })
})


describe('Inside square brackets, a bare URL', () => {
  it('can contain matching square brackets', () => {
    expect(Up.parse('[https://archive.org/fake[url]]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('['),
          new Up.Link([
            new Up.PlainText('archive.org/fake[url]')
          ], 'https://archive.org/fake[url]'),
          new Up.PlainText(']')
        ])
      ]))
  })

  it('can contain any number of nested matching square brackets', () => {
    expect(Up.parse('[https://archive.org/a[fake[url]]is[[[very]]]fun]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('['),
          new Up.Link([
            new Up.PlainText('archive.org/a[fake[url]]is[[[very]]]fun')
          ], 'https://archive.org/a[fake[url]]is[[[very]]]fun'),
          new Up.PlainText(']')
        ])
      ]))
  })
})


context('If a bare URL does not have a path, it is terminated by any punctuation. ', () => {
  context("This includes (but is not limited to):", () => {
    specify("Commas", () => {
      expect(Up.parse('https://www.demo.example.co.uk, now that is my favorite site!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('www.demo.example.co.uk')
          ], 'https://www.demo.example.co.uk'),
          new Up.PlainText(', now that is my favorite site!')
        ]))
    })

    specify("Periods", () => {
      expect(Up.parse('https://www.demo.example.co.uk. Now that is my favorite site!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('www.demo.example.co.uk')
          ], 'https://www.demo.example.co.uk'),
          new Up.PlainText('. Now that is my favorite site!')
        ]))
    })

    specify("Question marks", () => {
      expect(Up.parse('https://www.demo.example.co.uk? Now that is my favorite site!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('www.demo.example.co.uk')
          ], 'https://www.demo.example.co.uk'),
          new Up.PlainText('? Now that is my favorite site!')
        ]))
    })

    specify("Exclamation points", () => {
      expect(Up.parse('https://www.demo.example.co.uk! Now that is my favorite site!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('www.demo.example.co.uk')
          ], 'https://www.demo.example.co.uk'),
          new Up.PlainText('! Now that is my favorite site!')
        ]))
    })


    context('Dashes', () => {
      specify("comprising a typographical convention", () => {
        expect(Up.parse('https://www.demo.example.co.uk---now that is my favorite site!')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.Link([
              new Up.PlainText('www.demo.example.co.uk')
            ], 'https://www.demo.example.co.uk'),
            new Up.PlainText('—now that is my favorite site!')
          ]))
      })

      specify("not comprising a typographical convention", () => {
        expect(Up.parse('https://www.demo.example.co.uk-now that is my favorite site!')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.Link([
              new Up.PlainText('www.demo.example.co.uk')
            ], 'https://www.demo.example.co.uk'),
            new Up.PlainText('-now that is my favorite site!')
          ]))
      })
    })
  })


  context('The URL is terminated even when:', () => {
    specify('The punctuation is immediately followed by a valid URL path', () => {
      expect(Up.parse('https://4chan.org.../r9k/ is a sad place.')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('4chan.org')
          ], 'https://4chan.org'),
          new Up.PlainText('…/r9k/ is a sad place.')
        ]))
    })


    specify('The punctuation is at the end of a paragraph.', () => {
      expect(Up.parse('Avoid visiting https://4chan.org.')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Avoid visiting '),
          new Up.Link([
            new Up.PlainText('4chan.org')
          ], 'https://4chan.org'),
          new Up.PlainText('.')
        ]))
    })


    context('The bare URL is inside another convention, including (but not limited to):', () => {
      specify('Parentheses', () => {
        expect(Up.parse('(For more info, visit https://archive.org!)')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.NormalParenthetical([
              new Up.PlainText('(For more info, visit '),
              new Up.Link([
                new Up.PlainText('archive.org')
              ], 'https://archive.org'),
              new Up.PlainText('!)')
            ])
          ]))
      })

      specify('Square brackets', () => {
        expect(Up.parse('[For more info, visit https://archive.org!]')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.SquareParenthetical([
              new Up.PlainText('[For more info, visit '),
              new Up.Link([
                new Up.PlainText('archive.org')
              ], 'https://archive.org'),
              new Up.PlainText('!]')
            ])
          ]))
      })

      specify('Italics', () => {
        expect(Up.parse('_For more info, visit https://archive.org!_')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.Italic([
              new Up.PlainText('For more info, visit '),
              new Up.Link([
                new Up.PlainText('archive.org')
              ], 'https://archive.org'),
              new Up.PlainText('!')
            ])
          ]))
      })

      specify('Highlight', () => {
        expect(Up.parse('[highlight: For more info, visit https://archive.org!]')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.Highlight([
              new Up.PlainText('For more info, visit '),
              new Up.Link([
                new Up.PlainText('archive.org')
              ], 'https://archive.org'),
              new Up.PlainText('!')
            ])
          ]))
      })

      specify('Inline spoilers', () => {
        expect(Up.parse('[SPOILER: For more info, visit https://archive.org!]')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.InlineSpoiler([
              new Up.PlainText('For more info, visit '),
              new Up.Link([
                new Up.PlainText('archive.org')
              ], 'https://archive.org'),
              new Up.PlainText('!')
            ])
          ]))
      })
    })
  })
})
