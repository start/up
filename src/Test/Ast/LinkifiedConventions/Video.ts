import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


describe('An video convention (with its URL) followed immediately by a (second) parenthesized/bracketd URL', () => {
  it('produces an video node within a link pointing to that second URL', () => {
    expect(Up.toDocument('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)(http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new LinkNode([
          new VideoNode('you fight Gary', 'https://example.com/fight.webm')
        ], 'http://example.com/finalbattle'),
        new PlainTextNode('.')
      ]))
  })
})


describe('Any video convention (with its URL) followed immediately by a (second) parenthesized/bracketed URL', () => {
  it('produces an video node within a link pointing to that second URL. The types of brackets surrounding the video description, the video URL, and the "linkifying" URL can all be different', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'video: you fight Gary' },
        { text: 'https://example.com/fight.webm' },
        { text: 'http://example.com/finalbattle' }
      ],
      toProduce: new UpDocument([
        new LinkNode([
          new VideoNode('you fight Gary', 'https://example.com/fight.webm')
        ], 'http://example.com/finalbattle')
      ])
    })
  })

  context("As long as there is no whitespace between the video's URL and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
    specify('The linkifying URL can contain whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: you fight Gary' },
          { text: 'https://example.com/fight.webm' },
          { text: 'http://example.com/final battle' }
        ],
        toProduce: new UpDocument([
          new LinkNode([
            new VideoNode('you fight Gary', 'https://example.com/fight.webm')
          ], 'http://example.com/final battle')
        ])
      })
    })

    specify('The linkifying URL can start with whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: you fight Gary' },
          { text: 'https://example.com/fight.webm' },
          { text: ' \t \t http://example.com/final battle' }
        ],
        toProduce: new UpDocument([
          new LinkNode([
            new VideoNode('you fight Gary', 'https://example.com/fight.webm')
          ], 'http://example.com/final battle')
        ])
      })
    })
  })
})


describe('An video convention directly followed by an inline spoiler', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[SPOILER: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new VideoNode('you fight Gary', 'https://example.com/fight.webm'),
        new InlineSpoilerNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A video directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new VideoNode('you fight Gary', 'https://example.com/fight.webm'),
        new InlineNsfwNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A video directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[NSFL: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new VideoNode('you fight Gary', 'https://example.com/fight.webm'),
        new InlineNsflNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A video directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)(^Or whatever you name him.)"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("After you beat the Elite Four, "),
          new VideoNode('you fight Gary', 'https://example.com/fight.webm'),
          footnotes[0],
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified video convention with its linkifying URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('[video: phone call](https://example.com/phonecall.webm)(\\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new VideoNode('phone call', 'https://example.com/phonecall.webm'),
        new ParenthesizedNode([
          new PlainTextNode('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified video's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the video convention is not linkified', () => {
    expect(Up.toDocument('[video: phone call](https://example.com/phonecall.ogg)( \t \\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new VideoNode('phone call', 'https://example.com/phonecall.ogg'),
        new PlainTextNode('( \t tel:5555555555)')
      ]))
  })
})
