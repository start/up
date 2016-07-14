import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../../SyntaxNodes/NsflNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


// TODO: Check all permutations of brackets for negative tests, too.

describe('An video convention (with its URL) followed immediately by a (second) parenthesized/bracketd URL', () => {
  it('produces an video node within a link pointing to that second URL', () => {
    expect(Up.toAst('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)(http://example.com/finalbattle).')).to.be.eql(
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
      toProduce: new DocumentNode([
        new LinkNode([
          new VideoNode('you fight Gary', 'https://example.com/fight.webm')
        ], 'http://example.com/finalbattle')
      ])
    })
  })

  context("As long as there is no whitespace between the video's URL and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
    specify('For example, the linkifying URL can contain whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: you fight Gary' },
          { text: 'https://example.com/fight.webm' },
          { text: 'http://example.com/final battle' }
        ],
        toProduce: new DocumentNode([
          new LinkNode([
            new VideoNode('you fight Gary', 'https://example.com/fight.webm')
          ], 'http://example.com/final battle')
        ])
      })
    })
  })
})


describe('An video convention directly followed by a spoiler', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[SPOILER: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new VideoNode('you fight Gary', 'https://example.com/fight.webm'),
        new SpoilerNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A video directly followed by a NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new VideoNode('you fight Gary', 'https://example.com/fight.webm'),
        new NsfwNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A video directly followed by a NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[NSFL: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new VideoNode('you fight Gary', 'https://example.com/fight.webm'),
        new NsflNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A video directly followed by a footnote', () => {
  it("is not linkified", () => {
    const text = "After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)(^Or whatever you name him.)"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("After you beat the Elite Four, "),
          new VideoNode('you fight Gary', 'https://example.com/fight.webm'),
          footnotes[0],
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('An otherwise valid linkified video convention with its linkifying URL escaped"', () => {
  it('is not linkified', () => {
    expect(Up.toAst('[video: phone call](https://example.com/phonecall.webm)(\\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new VideoNode('phone call', 'https://example.com/phonecall.webm'),
        new ParenthesizedNode([
          new PlainTextNode('(tel:5555555555)')
        ]),
      ]))
  })
})
