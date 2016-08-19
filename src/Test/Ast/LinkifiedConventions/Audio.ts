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
import { Audio } from '../../../SyntaxNodes/Audio'
import { NormalParentheticalNode } from '../../../SyntaxNodes/NormalParentheticalNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


describe('An audio convention (with its URL) followed immediately by a (second) parenthesized/bracketd URL', () => {
  it('produces an audio node within a link pointing to that second URL', () => {
    expect(Up.toDocument('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)(http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new LinkNode([
          new Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'http://example.com/finalbattle'),
        new PlainTextNode('.')
      ]))
  })
})


describe('Any audio convention (with its URL) followed immediately by a (second) parenthesized/bracketed URL', () => {
  it('produces an audio node within a link pointing to that second URL. The types of brackets surrounding the audio description, the audio URL, and the "linkifying" URL can all be different', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'audio: you fight Gary' },
        { text: 'https://example.com/fight.ogg' },
        { text: 'http://example.com/finalbattle' }
      ],
      toProduce: new UpDocument([
        new LinkNode([
          new Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'http://example.com/finalbattle')
      ])
    })
  })

  context("As long as there is no whitespace between the audio's URL and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
    specify('The linkifying URL can contain whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'audio: you fight Gary' },
          { text: 'https://example.com/fight.ogg' },
          { text: 'http://example.com/final battle' }
        ],
        toProduce: new UpDocument([
          new LinkNode([
            new Audio('you fight Gary', 'https://example.com/fight.ogg')
          ], 'http://example.com/final battle')
        ])
      })
    })

    specify('The linkifying URL can start with whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'audio: you fight Gary' },
          { text: 'https://example.com/fight.ogg' },
          { text: ' \t \thttp://example.com/final battle' }
        ],
        toProduce: new UpDocument([
          new LinkNode([
            new Audio('you fight Gary', 'https://example.com/fight.ogg')
          ], 'http://example.com/final battle')
        ])
      })
    })
  })
})


describe('An audio convention directly followed by an inline spoiler', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)[SPOILER: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new Audio('you fight Gary', 'https://example.com/fight.ogg'),
        new InlineSpoilerNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An audio convention directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)[NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new Audio('you fight Gary', 'https://example.com/fight.ogg'),
        new InlineNsfwNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An audio convention directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)[NSFL: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new Audio('you fight Gary', 'https://example.com/fight.ogg'),
        new InlineNsflNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An audio convention directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)(^Or whatever you name him.)"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("After you beat the Elite Four, "),
          new Audio('you fight Gary', 'https://example.com/fight.ogg'),
          footnotes[0],
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified audio convention with its linkifying URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('[audio: phone call](https://example.com/phonecall.ogg)(\\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new Audio('phone call', 'https://example.com/phonecall.ogg'),
        new NormalParentheticalNode([
          new PlainTextNode('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified audio convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the audio convention is not linkified', () => {
    expect(Up.toDocument('[audio: phone call](https://example.com/phonecall.ogg)( \t \\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new Audio('phone call', 'https://example.com/phonecall.ogg'),
        new PlainTextNode('( \t tel:5555555555)')
      ]))
  })
})

