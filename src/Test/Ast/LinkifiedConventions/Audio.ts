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
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


// TODO: Check all permutations of brackets for negative tests, too.

describe('An audio convention (with its URL) followed immediately by a (second) parenthesized/bracketd URL', () => {
  it('produces an audio node within a link pointing to that second URL', () => {
    expect(Up.toAst('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)(http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new LinkNode([
          new AudioNode('you fight Gary', 'https://example.com/fight.ogg')
        ], 'http://example.com/finalbattle'),
        new PlainTextNode('.')
      ]))
  })
})


describe('Any audio convention (with its URL) followed immediately by a (second) parenthesized/bracketed URL', () => {
  it('produces an audio node within a link pointing to that second URL. The types of brackets surrounding the audio description, the audio URL, and the "linkifying" URL can all be different', () => {
    expectEveryPermutationOfBrackets({
      contentToWrapInBrackets: 'audio: you fight Gary',
      urlSegments: [
        {
          urlToWrapInBrackets: 'https://example.com/fight.ogg'
        },
        {
          urlToWrapInBrackets: 'http://example.com/finalbattle'
        }],
      toProduce: new DocumentNode([
        new LinkNode([
          new AudioNode('you fight Gary', 'https://example.com/fight.ogg')
        ], 'http://example.com/finalbattle')
      ])
    })
  })

  context("As long as there is no whitespace between the audio's URL and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
    specify('For example, the linkifying URL can contain whitespace', () => {
      expectEveryPermutationOfBrackets({
        contentToWrapInBrackets: 'audio: you fight Gary',
        urlSegments: [
          {
            urlToWrapInBrackets: 'https://example.com/fight.ogg'
          },
          {
            urlToWrapInBrackets: 'http://example.com/final battle'
          }],
        toProduce: new DocumentNode([
          new LinkNode([
            new AudioNode('you fight Gary', 'https://example.com/fight.ogg')
          ], 'http://example.com/final battle')
        ])
      })
    })
  })
})


describe('An audio convention directly followed by a spoiler', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)[SPOILER: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new AudioNode('you fight Gary', 'https://example.com/fight.ogg'),
        new SpoilerNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An audio convention directly followed by a NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)[NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new AudioNode('you fight Gary', 'https://example.com/fight.ogg'),
        new NsfwNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An audio convention directly followed by a NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)[NSFL: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new AudioNode('you fight Gary', 'https://example.com/fight.ogg'),
        new NsflNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An audio convention directly followed by a footnote', () => {
  it("is not linkified", () => {
    const text = "After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)(^Or whatever you name him.)"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("After you beat the Elite Four, "),
          new AudioNode('you fight Gary', 'https://example.com/fight.ogg'),
          footnotes[0],
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('An otherwise valid linkified audio convention with its linkifying URL escaped"', () => {
  it('is not linkified', () => {
    expect(Up.toAst('[audio: phone call](https://example.com/phonecall.ogg)(\\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new AudioNode('phone call', 'https://example.com/phonecall.ogg'),
        new ParenthesizedNode([
          new PlainTextNode('(tel:5555555555)')
        ]),
      ]))
  })
})
