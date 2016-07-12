import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../../Helpers'
import { DocumentNode } from '../../../../SyntaxNodes/DocumentNode'
import { LinkNode } from '../../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'
import { ParenthesizedNode } from '../../../../SyntaxNodes/ParenthesizedNode'
import { VideoNode } from '../../../../SyntaxNodes/VideoNode'


// TODO: Check all permutations of brackets for negative tests, too.

context('A linkified video convention can have whitespace between its video URL and its linkifying URL (regardless of whether there is whitespace between its content and its video URL), but the linkifying URL must satisfy one of the following conditions:', () => {
  specify('It has a scheme', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { content: 'video: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          content: 'https://example.com/video.webm'
        },
        {
          prefixes: WITH_WHITESPACE,
          content: 'app:wiki/terrible-thing'
        }],
      toProduce: new DocumentNode([
        new LinkNode([
          new VideoNode('something terrible', 'https://example.com/video.webm')
        ], 'app:wiki/terrible-thing')
      ])
    })
  })


  describe('When the URL has a scheme', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { content: 'video: Advance Wars' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            content: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            content: 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new VideoNode('Advance Wars', 'https://example.com/video.webm')
          ], 'http://advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toAst('[video: something terrible](https://example.com/video.webm) (https://stackoverflow.com is nice)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('something terrible', 'https://example.com/video.webm'),
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
      expect(Up.toAst('[video: email sending] (https://example.com/video.webm) (mailto:)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('email sending', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(mailto:)')
          ]),
        ])
      )
    })

    specify('there must be somethng after the scheme beyond only slashes', () => {
      expect(Up.toAst('[video: local files rustling](https://example.com/video.webm) (file:///)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('local files rustling', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(file:///)')
          ]),
        ])
      )
    })

    specify('the rest of the URL can consist solely of digits', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { content: 'video: spooky phone call' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            content: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            content: 'tel:5555555555'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new VideoNode('spooky phone call', 'https://example.com/video.webm')
          ], 'tel:5555555555')
        ])
      })
    })

    specify('the scheme must not be escaped', () => {
      expect(Up.toAst('[video: email sending] (https://example.com/video.webm) (\\mailto:daniel@wants.email)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('email sending', 'https://example.com/video.webm'),
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
      bracketedSegments: [
        { content: 'video: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          content: 'https://example.com/video.webm'
        },
        {
          prefixes: WITH_WHITESPACE,
          content: '/wiki/something-terrible'
        }],
      toProduce: new DocumentNode([
        new LinkNode([
          new VideoNode('something terrible', 'https://example.com/video.webm')
        ], '/wiki/something-terrible')
      ])
    })
  })


  describe('When the URL starts with a slash, the URL', () => {
    it('must not contain any spaces', () => {
      expect(Up.toAst('[video: something terrible](https://example.com/video.webm) (/r9k/ created it)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('something terrible', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(/r9k/ created it)')
          ]),
        ])
      )
    })

    it('must have something after the slash', () => {
      expect(Up.toAst('[video: slash] (https://example.com/video.webm) (/)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('slash', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(/)')
          ]),
        ])
      )
    })

    it('can consist solely of digits after the slash', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { content: 'video: Model 3 theft' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            content: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            content: '/3'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new VideoNode('Model 3 theft', 'https://example.com/video.webm')
          ], '/3')
        ])
      })
    })

    specify('must not have its slash escaped', () => {
      expect(Up.toAst('[video: robots](https://example.com/video.webm) (\\/r9k/)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('robots', 'https://example.com/video.webm'),
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
      bracketedSegments: [
        { content: 'video: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          content: 'https://example.com/video.webm'
        },
        {
          prefixes: WITH_WHITESPACE,
          content: '#wiki/something-terrible'
        }],
      toProduce: new DocumentNode([
        new LinkNode([
          new VideoNode('something terrible', 'https://example.com/video.webm')
        ], '#wiki/something-terrible')
      ])
    })
  })


  describe('When the URL starts with a hash mark ("#"), the URL', () => {
    it('may consist solely of digits after the hask mark', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { content: 'video: Model 3 theft' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            content: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            content: '#3'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new VideoNode('Model 3 theft', 'https://example.com/video.webm')
          ], '#3')
        ])
      })
    })

    it('must have something after the hash mark', () => {
      expect(Up.toAst('[video: hash marking](https://example.com/video.webm) (#)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('hash marking', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#)')
          ]),
        ])
      )
    })

    it('must not contain any spaces', () => {
      expect(Up.toAst('[video: something terrible] (https://example.com/video.webm) (#starcraft2 was never trending)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('something terrible', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(#starcraft2 was never trending)')
          ]),
        ])
      )
    })

    it('must not have its hashmark escaped', () => {
      expect(Up.toAst('[video: hash marking](https://example.com/video.webm) (\\#starcraft2)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('hash marking', 'https://example.com/video.webm'),
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
      bracketedSegments: [
        { content: 'video: Chrono Trigger' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          content: 'https://example.com/video.webm'
        },
        {
          prefixes: WITH_WHITESPACE,
          content: 'https://chrono-trigger.wiki'
        }],
      toProduce: new DocumentNode([
        new LinkNode([
          new VideoNode('Chrono Trigger', 'https://example.com/video.webm')
        ], 'https://chrono-trigger.wiki')
      ])
    })
  })


  describe('When the URL merely has a top-level domain', () => {
    specify('the top-level domain may be followed by a slash and a resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { content: 'video: Advance Wars' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            content: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            content: 'advancewars.wikia.com/wiki/Advance_Wars_(game)'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new VideoNode('Advance Wars', 'https://example.com/video.webm')
          ], 'https://advancewars.wikia.com/wiki/Advance_Wars_(game)')
        ])
      })
    })

    specify('the top-level domain may be followed by a slash and no resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { content: 'video: Advance Wars' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            content: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            content: 'advancewars.wikia.com/'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new VideoNode('Advance Wars', 'https://example.com/video.webm')
          ], 'https://advancewars.wikia.com/')
        ])
      })
    })

    specify('the top-level domain may not be followed by any character other than a forward slash', () => {
      expect(Up.toAst('[video: 4chan] (https://example.com/video.webm) (4chan.org--terrifying)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('4chan', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(4chan.org--terrifying)')
          ]),
        ])
      )
    })

    specify('all domains before the top-level domain may consist solely of digits', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { content: 'video: good luck' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            content: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            content: '88.8888.cn'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new VideoNode('good luck', 'https://example.com/video.webm')
          ], 'https://88.8888.cn')
        ])
      })
    })

    context('The top-level domain must contain only letters ', () => {
      specify('No numbers', () => {
        expect(Up.toAst('[video: usernaming](https://example.com/video.webm) (john.e.smith5)')).to.be.eql(
          insideDocumentAndParagraph([
            new VideoNode('usernaming', 'https://example.com/video.webm'),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(john.e.smith5)')
            ]),
          ])
        )
      })

      specify('No hyphens', () => {
        expect(Up.toAst('[video: usernaming] (https://example.com/video.webm) (john.e.smith-kline)')).to.be.eql(
          insideDocumentAndParagraph([
            new VideoNode('usernaming', 'https://example.com/video.webm'),
            new PlainTextNode(' '),
            new ParenthesizedNode([
              new PlainTextNode('(john.e.smith-kline)')
            ]),
          ])
        )
      })
    })

    specify('the URL must start with a letter or a number, not a period', () => {
      expect(Up.toAst('[video: being British](https://example.com/video.webm) (.co.uk)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('being British', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(.co.uk)')
          ]),
        ])
      )
    })

    specify('the URL must not have consecutive periods before the top-level domain', () => {
      expect(Up.toAst('[video: Ash claiming to be his own father] (https://example.com/video.webm) (um..uh)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('Ash claiming to be his own father', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(um..uh)')
          ]),
        ])
      )
    })

    specify('the URL must not have consecutive periods directly after the top-level domain before the slash that indicates the start of the resource path', () => {
      expect(Up.toAst('[video: debilitating sadness](https://example.com/video.webm) (4chan.org../r9k/)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('debilitating sadness', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(4chan.org../r9k/)')
          ]),
        ])
      )
    })

    specify('the URL may have consecutive periods after the slash that indicates the start of the resource path', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { content: 'video: rocket ship' },
          {
            prefixes: WITH_AND_WITHOUT_WHITESPACE,
            content: 'https://example.com/video.webm'
          },
          {
            prefixes: WITH_WHITESPACE,
            content: 'example.com/321...blastoff/1'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new VideoNode('rocket ship', 'https://example.com/video.webm')
          ], 'https://example.com/321...blastoff/1')
        ])
      })
    })

    specify('the URL must not contain any spaces', () => {
      expect(Up.toAst('[video: yeah] (https://example.com/video.webm) (ign.com had some hilarious forums)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('yeah', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(ign.com had some hilarious forums)')
          ]),
        ])
      )
    })

    specify('the domain part must not be escaped', () => {
      expect(Up.toAst('[video: yeah](https://example.com/video.webm) (\\ign.com)')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('yeah', 'https://example.com/video.webm'),
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('(ign.com)')
          ]),
        ])
      )
    })
  })


  specify('If none of the conditions are satisfied, the video is not linkified', () => {
    expect(Up.toAst('[video: something terrible] (https://example.com/video.webm) (really)')).to.be.eql(
      insideDocumentAndParagraph([
        new VideoNode('something terrible', 'https://example.com/video.webm'),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('(really)')
        ]),
      ]))
  })
})


describe("If there is whitespace between an otherwise-valid linkified video convention's video URL and its linkifying URL", () => {
  it('the video convention is not linkified', () => {
    expect(Up.toAst('[video: something terrible](https://example.com/video.webm)  \\  (https://example.com)')).to.be.eql(
      insideDocumentAndParagraph([
        new VideoNode('something terrible', 'https://example.com/video.webm'),
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


describe("A video convention's linkifying URL, when separated from its video URL by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { content: 'video: something terrible' },
        {
          prefixes: WITH_AND_WITHOUT_WHITESPACE,
          content: 'https://example.com/video.webm'
        },
        {
          prefixes: WITH_WHITESPACE,
          content: 'stackoverflow.com/search=something\\ very\\ terrible'
        }],
      toProduce: new DocumentNode([
        new LinkNode([
          new VideoNode('something terrible', 'https://example.com/video.webm')
        ], 'https://stackoverflow.com/search=something very terrible')
      ])
    })
  })
})


const WHTIESPACE = ' \t\t '
const WITH_AND_WITHOUT_WHITESPACE = ['', WHTIESPACE]
const WITH_WHITESPACE = [WHTIESPACE]