import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../../Helpers'
import { DocumentNode } from '../../../../SyntaxNodes/DocumentNode'
import { LinkNode } from '../../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'
import { ParenthesizedNode } from '../../../../SyntaxNodes/ParenthesizedNode'
import { ImageNode } from '../../../../SyntaxNodes/ImageNode'


context('A linkified image convention can have whitespace between its image URL and its linkifying URL (regardless of whether there is whitespace between its content and its image URL), but the linkifying URL must satisfy one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryPermutationOfBrackets({
      contentToWrapInBrackets: 'image: something terrible',
      urlSegments: [
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          urlToWrapInBrackets: 'https://example.com/sounds.ogg'
        },
        {
          prefixes: WITH_WHITESPACE,
          urlToWrapInBrackets: 'app:wiki/terrible-thing'
        }],
      toProduce: new DocumentNode([
        new LinkNode([
          new ImageNode('something terrible', 'https://example.com/sounds.ogg')
        ], 'app:wiki/terrible-thing')
      ])
    })
  })


  describe('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBrackets({
        contentToWrapInBrackets: 'image: Advance Wars',
        urlSegments: [
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            urlToWrapInBrackets: 'https://example.com/sounds.ogg'
          },
          {
            prefixes: WITH_WHITESPACE,
            urlToWrapInBrackets: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new ImageNode('Advance Wars', 'https://example.com/sounds.ogg')
          ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toAst('[image: something terrible](https://example.com/sounds.ogg) (https://stackoverflow.com is nice)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('something terrible', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('('),
            new LinkNode([
              new PlainTextNode('stackoverflow.com')
            ], 'https://stackoverflow.com'),
            new PlainTextNode(' is nice)')
          ]),
        ])
      )
    })

    specify('there must be somethng after the scheme', () => {
      expect(Up.toAst('[image: email sending] (https://example.com/sounds.ogg) (mailto:)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('email sending', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(mailto:)')
          ]),
        ])
      )
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.toAst('[image: local files rustling](https://example.com/sounds.ogg) (file:///)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('local files rustling', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(file:///)')
          ]),
        ])
      )
    })

    specify('the rest of the URL can consist solely of digits', () => {
      expectEveryPermutationOfBrackets({
        contentToWrapInBrackets: 'image: spooky phone call',
        urlSegments: [
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            urlToWrapInBrackets: 'https://example.com/sounds.ogg'
          },
          {
            prefixes: WITH_WHITESPACE,
            urlToWrapInBrackets: 'tel:5555555555'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new ImageNode('spooky phone call', 'https://example.com/sounds.ogg')
          ], 'tel:5555555555')
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      expect(Up.toAst('[image: email sending] (https://example.com/sounds.ogg) (\\mailto:daniel@wants.email)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('email sending', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(mailto:daniel@wants.email)')
          ]),
        ])
      )
    })
  })


  specify('It starts with a slash', () => {
    expectEveryPermutationOfBrackets({
      contentToWrapInBrackets: 'image: something terrible',
      urlSegments: [
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          urlToWrapInBrackets: 'https://example.com/sounds.ogg'
        },
        {
          prefixes: WITH_WHITESPACE,
          urlToWrapInBrackets: '/wiki/something-terrible'
        }],
      toProduce: new DocumentNode([
        new LinkNode([
          new ImageNode('something terrible', 'https://example.com/sounds.ogg')
        ], '/wiki/something-terrible')
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      expect(Up.toAst('[image: something terrible](https://example.com/sounds.ogg) (/r9k/ created it)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('something terrible', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(/r9k/ created it)')
          ]),
        ])
      )
    })

    it('must have something after the slash', () => {
      expect(Up.toAst('[image: slash] (https://example.com/sounds.ogg) (/)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('slash', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(/)')
          ]),
        ])
      )
    })

    it('can consist solely of digits after the slash', () => {
      expectEveryPermutationOfBrackets({
        contentToWrapInBrackets: 'image: Model 3 theft',
        urlSegments: [
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            urlToWrapInBrackets: 'https://example.com/sounds.ogg'
          },
          {
            prefixes: WITH_WHITESPACE,
            urlToWrapInBrackets: '/3'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new ImageNode('Model 3 theft', 'https://example.com/sounds.ogg')
          ], '/3')
        ])
      })
    })

    specify('must not have its slash escaped', () => {
      expect(Up.toAst('[image: robots](https://example.com/sounds.ogg) (\\/r9k/)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('robots', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(/r9k/)')
          ]),
        ])
      )
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    expectEveryPermutationOfBrackets({
      contentToWrapInBrackets: 'image: something terrible',
      urlSegments: [
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          urlToWrapInBrackets: 'https://example.com/sounds.ogg'
        },
        {
          prefixes: WITH_WHITESPACE,
          urlToWrapInBrackets: '#wiki/something-terrible'
        }],
      toProduce: new DocumentNode([
        new LinkNode([
          new ImageNode('something terrible', 'https://example.com/sounds.ogg')
        ], '#wiki/something-terrible')
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryPermutationOfBrackets({
        contentToWrapInBrackets: 'image: Model 3 theft',
        urlSegments: [
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            urlToWrapInBrackets: 'https://example.com/sounds.ogg'
          },
          {
            prefixes: WITH_WHITESPACE,
            urlToWrapInBrackets: '#3'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new ImageNode('Model 3 theft', 'https://example.com/sounds.ogg')
          ], '#3')
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.toAst('[image: hash marking](https://example.com/sounds.ogg) (#)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('hash marking', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#)')
          ]),
        ])
      )
    })

    it('must not contain any spaces', () => {
      expect(Up.toAst('[image: something terrible] (https://example.com/sounds.ogg) (#starcraft2 was never trending)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('something terrible', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#starcraft2 was never trending)')
          ]),
        ])
      )
    })

    it('must not have its hashmark escaped', () => {
      expect(Up.toAst('[image: hash marking](https://example.com/sounds.ogg) (\\#starcraft2)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('hash marking', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#starcraft2)')
          ]),
        ])
      )
    })
  })


  specify('It has a top-level domain', () => {
    expectEveryPermutationOfBrackets({
      contentToWrapInBrackets: 'image: Chrono Trigger',
      urlSegments: [
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          urlToWrapInBrackets: 'https://example.com/sounds.ogg'
        },
        {
          prefixes: WITH_WHITESPACE,
          urlToWrapInBrackets: 'https://chrono-trigger.wiki'
        }],
      toProduce: new DocumentNode([
        new LinkNode([
          new ImageNode('Chrono Trigger', 'https://example.com/sounds.ogg')
        ], 'https://chrono-trigger.wiki')
      ])
    })
  })


  describe('When the URL merely has a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBrackets({
        contentToWrapInBrackets: 'image: Advance Wars',
        urlSegments: [
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            urlToWrapInBrackets: 'https://example.com/sounds.ogg'
          },
          {
            prefixes: WITH_WHITESPACE,
            urlToWrapInBrackets: 'advancewars.wikia.com/wiki/Advance_Wars_(game)'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new ImageNode('Advance Wars', 'https://example.com/sounds.ogg')
          ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryPermutationOfBrackets({
        contentToWrapInBrackets: 'image: Advance Wars',
        urlSegments: [
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            urlToWrapInBrackets: 'https://example.com/sounds.ogg'
          },
          {
            prefixes: WITH_WHITESPACE,
            urlToWrapInBrackets: 'advancewars.wikia.com/'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new ImageNode('Advance Wars', 'https://example.com/sounds.ogg')
          ], 'https://advancewars.wikia.com/')
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      expect(Up.toAst('[image: 4chan] (https://example.com/sounds.ogg) (4chan.org--terrifying)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('4chan', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(4chan.org--terrifying)')
          ]),
        ])
      )
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      expectEveryPermutationOfBrackets({
        contentToWrapInBrackets: 'image: good luck',
        urlSegments: [
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            urlToWrapInBrackets: 'https://example.com/sounds.ogg'
          },
          {
            prefixes: WITH_WHITESPACE,
            urlToWrapInBrackets: '88.8888.cn'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new ImageNode('good luck', 'https://example.com/sounds.ogg')
          ], 'https://88.8888.cn')
        ])
      })
    })

    context('The top-level domain must contain only letters ', () => {
      specify('No numbers', () => {
        expect(Up.toAst('[image: usernaming](https://example.com/sounds.ogg) (john.e.smith5)')).to.be.eql(
          insideDocumentAndParagraph([
            new ImageNode('usernaming', 'https://example.com/sounds.ogg'),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(john.e.smith5)')
            ]),
          ])
        )
      })

      specify('No hyphens', () => {
        expect(Up.toAst('[image: usernaming] (https://example.com/sounds.ogg) (john.e.smith-kline)')).to.be.eql(
          insideDocumentAndParagraph([
            new ImageNode('usernaming', 'https://example.com/sounds.ogg'),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(john.e.smith-kline)')
            ]),
          ])
        )
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      expect(Up.toAst('[image: being British](https://example.com/sounds.ogg) (.co.uk)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('being British', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(.co.uk)')
          ]),
        ])
      )
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      expect(Up.toAst('[image: Ash claiming to be his own father] (https://example.com/sounds.ogg) (um..uh)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('Ash claiming to be his own father', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(um..uh)')
          ]),
        ])
      )
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      expect(Up.toAst('[image: debilitating sadness](https://example.com/sounds.ogg) (4chan.org../r9k/)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('debilitating sadness', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(4chan.org../r9k/)')
          ]),
        ])
      )
    })

    specify('the URL may have consecutive periods after the slash that indicates the start of the resource path', () => {
      expectEveryPermutationOfBrackets({
        contentToWrapInBrackets: 'image: rocket ship',
        urlSegments: [
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            urlToWrapInBrackets: 'https://example.com/sounds.ogg'
          },
          {
            prefixes: WITH_WHITESPACE,
            urlToWrapInBrackets: 'example.com/321...blastoff/1'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new ImageNode('rocket ship', 'https://example.com/sounds.ogg')
          ], 'https://example.com/321...blastoff/1')
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toAst('[image: yeah] (https://example.com/sounds.ogg) (ign.com had some hilarious forums)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('yeah', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(ign.com had some hilarious forums)')
          ]),
        ])
      )
    })

    specify('the domain part must not be escaped', () => {
      expect(Up.toAst('[image: yeah](https://example.com/sounds.ogg) (\\ign.com)')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('yeah', 'https://example.com/sounds.ogg'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(ign.com)')
          ]),
        ])
      )
    })
  })


  specify('If none of the conditions are satisfied, the spoiler is not linkified', () => {
    expect(Up.toAst('[image: something terrible] (https://example.com/sounds.ogg) (really)')).to.be.eql(
      insideDocumentAndParagraph([
        new ImageNode('something terrible', 'https://example.com/sounds.ogg'),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('(really)')
        ]),
      ]))
  })
})


describe("If there is whitespace between an otherwise-valid linkified image convention's image URL and its linkifying URL", () => {
  it('the image convention is not linkified', () => {
    expect(Up.toAst('[image: something terrible](https://example.com/sounds.ogg)  \\  (https://example.com)')).to.be.eql(
      insideDocumentAndParagraph([
        new ImageNode('something terrible', 'https://example.com/sounds.ogg'),
        new PlainTextNode('    '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')')
        ])
      ]))
  })
})


describe("An image convention's linkifying URL, when separated from its image URL by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    expectEveryPermutationOfBrackets({
      contentToWrapInBrackets: 'image: something terrible',
      urlSegments: [
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          urlToWrapInBrackets: 'https://example.com/sounds.ogg'
        },
        {
          prefixes: WITH_WHITESPACE,
          urlToWrapInBrackets: 'stackoverflow.com/search=something\\ very\\ terrible'
        }],
      toProduce: new DocumentNode([
        new LinkNode([
          new ImageNode('something terrible', 'https://example.com/sounds.ogg')
        ], 'https://stackoverflow.com/search=something very terrible')
      ])
    })
  })
})


const WHTIESPACE = ' \t\t '
const WITH_AND_WITHOUT_WHITESPACE = ['', WHTIESPACE]
const WITH_WHITESPACE = [WHTIESPACE]