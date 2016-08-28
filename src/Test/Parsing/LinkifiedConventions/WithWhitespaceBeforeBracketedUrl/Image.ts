import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../../Helpers'
import { UpDocument } from '../../../../SyntaxNodes/UpDocument'
import { Link } from '../../../../SyntaxNodes/Link'
import { PlainText } from '../../../../SyntaxNodes/PlainText'
import { NormalParenthetical } from '../../../../SyntaxNodes/NormalParenthetical'
import { Image } from '../../../../SyntaxNodes/Image'


const WHTIESPACE = ' \t\t '
const WITH_AND_WITHOUT_WHITESPACE = ['', WHTIESPACE]
const WITH_WHITESPACE = [WHTIESPACE]


context('A linkified image convention can have whitespace between its image URL and its linkifying URL (regardless of whether there is whitespace between its content and its image URL), but the linkifying URL must satisfy one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'image: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'https://example.com/image.png'
        },
        {
          prefixes: WITH_WHITESPACE,
          text: 'app:wiki/terrible-thing'
        }],
      toProduce: new UpDocument([
        new Link([
          new Image('something terrible', 'https://example.com/image.png')
        ], 'app:wiki/terrible-thing')
      ])
    })
  })


  context('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: Advance Wars' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/image.png'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)'
          }],
        toProduce: new UpDocument([
          new Link([
            new Image('Advance Wars', 'https://example.com/image.png')
          ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toDocument('[image: something terrible](https://example.com/image.png) (https://stackoverflow.com is nice)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('something terrible', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('('),
            new Link([
              new PlainText('stackoverflow.com')
            ], 'https://stackoverflow.com'),
            new PlainText(' is nice)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme', () => {
      expect(Up.toDocument('[image: email sending] (https://example.com/image.png) (mailto:)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('email sending', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(mailto:)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.toDocument('[image: local files rustling](https://example.com/image.png) (file:///)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('local files rustling', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(file:///)')
          ]),
        ]))
    })

    specify('the rest of the URL can consist solely of digits', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: spooky phone call' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/image.png'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: 'tel:5555555555'
          }],
        toProduce: new UpDocument([
          new Link([
            new Image('spooky phone call', 'https://example.com/image.png')
          ], 'tel:5555555555')
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      expect(Up.toDocument('[image: email sending] (https://example.com/image.png) (\\mailto:daniel@wants.email)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('email sending', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(mailto:daniel@wants.email)')
          ]),
        ]))
    })
  })


  specify('It starts with a slash', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'image: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'https://example.com/image.png'
        },
        {
          prefixes: WITH_WHITESPACE,
          text: '/wiki/something-terrible'
        }],
      toProduce: new UpDocument([
        new Link([
          new Image('something terrible', 'https://example.com/image.png')
        ], '/wiki/something-terrible')
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      expect(Up.toDocument('[image: something terrible](https://example.com/image.png) (/r9k/ created it)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('something terrible', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(/r9k/ created it)')
          ]),
        ]))
    })

    it('must have something after the slash', () => {
      expect(Up.toDocument('[image: slash] (https://example.com/image.png) (/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('slash', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(/)')
          ]),
        ]))
    })

    it('can consist solely of digits after the slash', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: Model 3 theft' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/image.png'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: '/3'
          }],
        toProduce: new UpDocument([
          new Link([
            new Image('Model 3 theft', 'https://example.com/image.png')
          ], '/3')
        ])
      })
    })

    it('must not have its slash escaped', () => {
      expect(Up.toDocument('[image: robots](https://example.com/image.png) (\\/r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('robots', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(/r9k/)')
          ]),
        ]))
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'image: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'https://example.com/image.png'
        },
        {
          prefixes: WITH_WHITESPACE,
          text: '#wiki/something-terrible'
        }],
      toProduce: new UpDocument([
        new Link([
          new Image('something terrible', 'https://example.com/image.png')
        ], '#wiki/something-terrible')
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: Model 3 theft' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/image.png'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: '#3'
          }],
        toProduce: new UpDocument([
          new Link([
            new Image('Model 3 theft', 'https://example.com/image.png')
          ], '#3')
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.toDocument('[image: hash marking](https://example.com/image.png) (#)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('hash marking', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(#)')
          ]),
        ]))
    })

    it('must not contain any spaces', () => {
      expect(Up.toDocument('[image: something terrible] (https://example.com/image.png) (#starcraft2 was never trending)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('something terrible', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(#starcraft2 was never trending)')
          ]),
        ]))
    })

    it('must not have its hashmark escaped', () => {
      expect(Up.toDocument('[image: hash marking](https://example.com/image.png) (\\#starcraft2)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('hash marking', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(#starcraft2)')
          ]),
        ]))
    })
  })


  specify('It has a subdomain and a top-level domain', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'image: Chrono Trigger' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'https://example.com/image.png'
        },
        {
          prefixes: WITH_WHITESPACE,
          text: 'https://chrono-trigger.wiki'
        }],
      toProduce: new UpDocument([
        new Link([
          new Image('Chrono Trigger', 'https://example.com/image.png')
        ], 'https://chrono-trigger.wiki')
      ])
    })
  })


  describe('When the URL merely has a subdomain and a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: Advance Wars' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/image.png'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: 'advancewars.wikia.com/wiki/Advance_Wars_(game)'
          }],
        toProduce: new UpDocument([
          new Link([
            new Image('Advance Wars', 'https://example.com/image.png')
          ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: Advance Wars' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/image.png'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: 'advancewars.wikia.com/'
          }],
        toProduce: new UpDocument([
          new Link([
            new Image('Advance Wars', 'https://example.com/image.png')
          ], 'https://advancewars.wikia.com/')
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      expect(Up.toDocument('[image: 4chan] (https://example.com/image.png) (4chan.org-terrifying)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('4chan', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(4chan.org-terrifying)')
          ]),
        ]))
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: good luck' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/image.png'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: '88.8888.cn'
          }],
        toProduce: new UpDocument([
          new Link([
            new Image('good luck', 'https://example.com/image.png')
          ], 'https://88.8888.cn')
        ])
      })
    })

    context('The top-level domain must contain only letters', () => {
      specify('No numbers', () => {
        expect(Up.toDocument('[image: usernaming](https://example.com/image.png) (john.e.smith5)')).to.deep.equal(
          insideDocumentAndParagraph([
            new Image('usernaming', 'https://example.com/image.png'),
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(john.e.smith5)')
            ]),
          ]))
      })

      specify('No hyphens', () => {
        expect(Up.toDocument('[image: usernaming] (https://example.com/image.png) (john.e.smith-kline)')).to.deep.equal(
          insideDocumentAndParagraph([
            new Image('usernaming', 'https://example.com/image.png'),
            new PlainText(' '),
            new NormalParenthetical([
              new PlainText('(john.e.smith-kline)')
            ]),
          ]))
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      expect(Up.toDocument('[image: being British](https://example.com/image.png) (.co.uk)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('being British', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(.co.uk)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      expect(Up.toDocument('[image: Ash claiming to be his own father] (https://example.com/image.png) (um..uh)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('Ash claiming to be his own father', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(um..uh)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      expect(Up.toDocument('[image: debilitating sadness](https://example.com/image.png) (4chan.org../r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('debilitating sadness', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(4chan.org../r9k/)')
          ]),
        ]))
    })

    specify('the URL may have consecutive periods after the slash that indicates the start of the resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: rocket ship' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/image.png'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: 'example.com/321...blastoff/1'
          }],
        toProduce: new UpDocument([
          new Link([
            new Image('rocket ship', 'https://example.com/image.png')
          ], 'https://example.com/321...blastoff/1')
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toDocument('[image: yeah] (https://example.com/image.png) (ign.com had some hilarious forums)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('yeah', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(ign.com had some hilarious forums)')
          ]),
        ]))
    })

    specify('the domain part must not be escaped', () => {
      expect(Up.toDocument('[image: yeah](https://example.com/image.png) (\\ign.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('yeah', 'https://example.com/image.png'),
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('(ign.com)')
          ]),
        ]))
    })
  })


  specify('If none of the conditions are satisfied, the image is not linkified', () => {
    expect(Up.toDocument('[image: something terrible] (https://example.com/image.png) (really)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Image('something terrible', 'https://example.com/image.png'),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('(really)')
        ]),
      ]))
  })
})


describe("If there is whitespace between an otherwise-valid linkified image convention's image URL and its linkifying URL", () => {
  it('the image convention is not linkified', () => {
    expect(Up.toDocument('[image: something terrible](https://example.com/image.png)  \\  (https://example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Image('something terrible', 'https://example.com/image.png'),
        new PlainText('    '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com')
          ], 'https://example.com'),
          new PlainText(')')
        ])
      ]))
  })
})


describe("An image convention's linkifying URL, when separated from its image URL by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'image: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'https://example.com/image.png'
        },
        {
          prefixes: WITH_WHITESPACE,
          text: 'stackoverflow.com/search=something\\ very\\ terrible'
        }],
      toProduce: new UpDocument([
        new Link([
          new Image('something terrible', 'https://example.com/image.png')
        ], 'https://stackoverflow.com/search=something very terrible')
      ])
    })
  })
})
