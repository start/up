import { expect } from 'chai'
import * as Up from '../../../../Main'
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../../Helpers'


const WHTIESPACE = ' \t\t '
const WITH_AND_WITHOUT_WHITESPACE = ['', WHTIESPACE]
const WITH_WHITESPACE = [WHTIESPACE]


context('A linkified video convention can have whitespace between its video URL and its linkifying URL (regardless of whether there is whitespace between its content and its video URL), but the linkifying URL must satisfy one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'video: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'https://example.com/video.webm'
        },
        {
          prefixes: WITH_WHITESPACE,
          text: 'app:wiki/terrible-thing'
        }],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Video('something terrible', 'https://example.com/video.webm')
        ], 'app:wiki/terrible-thing')
      ])
    })
  })


  context('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: Advance Wars' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)'
          }],
        toProduce: new Up.Document([
          new Up.Link([
            new Up.Video('Advance Wars', 'https://example.com/video.webm')
          ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.parse('[video: something terrible](https://example.com/video.webm) (https://stackoverflow.com is nice)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('something terrible', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('('),
            new Up.Link([
              new Up.Text('stackoverflow.com')
            ], 'https://stackoverflow.com'),
            new Up.Text(' is nice)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme', () => {
      expect(Up.parse('[video: email sending] (https://example.com/video.webm) (mailto:)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('email sending', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(mailto:)')
          ]),
        ]))
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.parse('[video: local files rustling](https://example.com/video.webm) (file:///)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('local files rustling', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(file:///)')
          ]),
        ]))
    })

    specify('the rest of the URL can consist solely of digits', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: spooky phone call' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: 'tel:5555555555'
          }],
        toProduce: new Up.Document([
          new Up.Link([
            new Up.Video('spooky phone call', 'https://example.com/video.webm')
          ], 'tel:5555555555')
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      expect(Up.parse('[video: email sending] (https://example.com/video.webm) (\\mailto:daniel@wants.email)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('email sending', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(mailto:daniel@wants.email)')
          ]),
        ]))
    })
  })


  specify('It starts with a slash', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'video: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'https://example.com/video.webm'
        },
        {
          prefixes: WITH_WHITESPACE,
          text: '/wiki/something-terrible'
        }],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Video('something terrible', 'https://example.com/video.webm')
        ], '/wiki/something-terrible')
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      expect(Up.parse('[video: something terrible](https://example.com/video.webm) (/r9k/ created it)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('something terrible', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(/r9k/ created it)')
          ]),
        ]))
    })

    it('must have something after the slash', () => {
      expect(Up.parse('[video: slash] (https://example.com/video.webm) (/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('slash', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(/)')
          ]),
        ]))
    })

    it('can consist solely of digits after the slash', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: Model 3 theft' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: '/3'
          }],
        toProduce: new Up.Document([
          new Up.Link([
            new Up.Video('Model 3 theft', 'https://example.com/video.webm')
          ], '/3')
        ])
      })
    })

    it('must not have its slash escaped', () => {
      expect(Up.parse('[video: robots](https://example.com/video.webm) (\\/r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('robots', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(/r9k/)')
          ]),
        ]))
    })
  })


  specify('It starts with a hash mark ("#")', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'video: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'https://example.com/video.webm'
        },
        {
          prefixes: WITH_WHITESPACE,
          text: '#wiki/something-terrible'
        }],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Video('something terrible', 'https://example.com/video.webm')
        ], '#wiki/something-terrible')
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: Model 3 theft' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: '#3'
          }],
        toProduce: new Up.Document([
          new Up.Link([
            new Up.Video('Model 3 theft', 'https://example.com/video.webm')
          ], '#3')
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.parse('[video: hash marking](https://example.com/video.webm) (#)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('hash marking', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(#)')
          ]),
        ]))
    })

    it('must not contain any spaces', () => {
      expect(Up.parse('[video: something terrible] (https://example.com/video.webm) (#starcraft2 was never trending)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('something terrible', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(#starcraft2 was never trending)')
          ]),
        ]))
    })

    it('must not have its hashmark escaped', () => {
      expect(Up.parse('[video: hash marking](https://example.com/video.webm) (\\#starcraft2)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('hash marking', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(#starcraft2)')
          ]),
        ]))
    })
  })


  specify('It has a subdomain and a top-level domain', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'video: Chrono Trigger' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'https://example.com/video.webm'
        },
        {
          prefixes: WITH_WHITESPACE,
          text: 'https://chrono-trigger.wiki'
        }],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Video('Chrono Trigger', 'https://example.com/video.webm')
        ], 'https://chrono-trigger.wiki')
      ])
    })
  })


  describe('When the URL merely has a subdomain and a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: Advance Wars' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: 'advancewars.wikia.com/wiki/Advance_Wars_(game)'
          }],
        toProduce: new Up.Document([
          new Up.Link([
            new Up.Video('Advance Wars', 'https://example.com/video.webm')
          ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: Advance Wars' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: 'advancewars.wikia.com/'
          }],
        toProduce: new Up.Document([
          new Up.Link([
            new Up.Video('Advance Wars', 'https://example.com/video.webm')
          ], 'https://advancewars.wikia.com/')
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      expect(Up.parse('[video: 4chan] (https://example.com/video.webm) (4chan.org-terrifying)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('4chan', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(4chan.org-terrifying)')
          ]),
        ]))
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: good luck' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: '88.8888.cn'
          }],
        toProduce: new Up.Document([
          new Up.Link([
            new Up.Video('good luck', 'https://example.com/video.webm')
          ], 'https://88.8888.cn')
        ])
      })
    })

    context('The top-level domain must contain only letters', () => {
      specify('No numbers', () => {
        expect(Up.parse('[video: usernaming](https://example.com/video.webm) (john.e.smith5)')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.Video('usernaming', 'https://example.com/video.webm'),
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(john.e.smith5)')
            ]),
          ]))
      })

      specify('No hyphens', () => {
        expect(Up.parse('[video: usernaming] (https://example.com/video.webm) (john.e.smith-kline)')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.Video('usernaming', 'https://example.com/video.webm'),
            new Up.Text(' '),
            new Up.NormalParenthetical([
              new Up.Text('(john.e.smith-kline)')
            ]),
          ]))
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      expect(Up.parse('[video: being British](https://example.com/video.webm) (.co.uk)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('being British', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(.co.uk)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      expect(Up.parse('[video: Ash claiming to be his own father] (https://example.com/video.webm) (um..uh)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('Ash claiming to be his own father', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(um…uh)')
          ]),
        ]))
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      expect(Up.parse('[video: debilitating sadness](https://example.com/video.webm) (4chan.org../r9k/)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('debilitating sadness', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(4chan.org…/r9k/)')
          ]),
        ]))
    })

    specify('the URL may have consecutive periods after the slash that indicates the start of the resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: rocket ship' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            text: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            text: 'example.com/321...blastoff/1'
          }],
        toProduce: new Up.Document([
          new Up.Link([
            new Up.Video('rocket ship', 'https://example.com/video.webm')
          ], 'https://example.com/321...blastoff/1')
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.parse('[video: yeah] (https://example.com/video.webm) (ign.com had some hilarious forums)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('yeah', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(ign.com had some hilarious forums)')
          ]),
        ]))
    })

    specify('the domain part must not be escaped', () => {
      expect(Up.parse('[video: yeah](https://example.com/video.webm) (\\ign.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('yeah', 'https://example.com/video.webm'),
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('(ign.com)')
          ]),
        ]))
    })
  })


  specify('If none of the conditions are satisfied, the video is not linkified', () => {
    expect(Up.parse('[video: something terrible] (https://example.com/video.webm) (really)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Video('something terrible', 'https://example.com/video.webm'),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('(really)')
        ]),
      ]))
  })
})


describe("If there is whitespace between an otherwise-valid linkified video convention's video URL and its linkifying URL", () => {
  it('the video convention is not linkified', () => {
    expect(Up.parse('[video: something terrible](https://example.com/video.webm)  \\  (https://example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Video('something terrible', 'https://example.com/video.webm'),
        new Up.Text('    '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com')
          ], 'https://example.com'),
          new Up.Text(')')
        ])
      ]))
  })
})


describe("A video convention's linkifying URL, when separated from its video URL by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'video: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          text: 'https://example.com/video.webm'
        },
        {
          prefixes: WITH_WHITESPACE,
          text: 'stackoverflow.com/search=something\\ very\\ terrible'
        }],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Video('something terrible', 'https://example.com/video.webm')
        ], 'https://stackoverflow.com/search=something very terrible')
      ])
    })
  })
})
