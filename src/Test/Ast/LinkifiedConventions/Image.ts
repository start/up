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
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


// TODO: Check all permutations of brackets for negative tests, too.

describe('An image convention (with its URL) followed immediately by a (second) parenthesized/bracketd URL', () => {
  it('produces an image node within a link pointing to that second URL', () => {
    expect(Up.toAst('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)(http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new LinkNode([
          new ImageNode('you fight Gary', 'https://example.com/fight.svg')
        ], 'http://example.com/finalbattle'),
        new PlainTextNode('.')
      ]))
  })
})


describe('Any image convention (with its URL) followed immediately by a (second) parenthesized/bracketed URL', () => {
  it('produces an image node within a link pointing to that second URL. The types of brackets surrounding the image description, the image URL, and the "linkifying" URL can all be different', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'image: you fight Gary' },
        { text: 'https://example.com/fight.svg' },
        { text: 'http://example.com/finalbattle' }
      ],
      toProduce: new DocumentNode([
        new LinkNode([
          new ImageNode('you fight Gary', 'https://example.com/fight.svg')
        ], 'http://example.com/finalbattle')
      ])
    })
  })

  context("As long as there is no whitespace between the image's URL and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
    specify('The linkifying URL can contain whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: you fight Gary' },
          { text: 'https://example.com/fight.svg' },
          { text: 'http://example.com/final battle' }
        ],
        toProduce: new DocumentNode([
          new LinkNode([
            new ImageNode('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final battle')
        ])
      })
    })

    specify('The linkifying URL can contain whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: you fight Gary' },
          { text: 'https://example.com/fight.svg' },
          { text: ' \t \t http://example.com/final battle' }
        ],
        toProduce: new DocumentNode([
          new LinkNode([
            new ImageNode('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final battle')
        ])
      })
    })
  })
})


describe('An image convention directly followed by a spoiler', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)[SPOILER: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new ImageNode('you fight Gary', 'https://example.com/fight.svg'),
        new SpoilerNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An image directly followed by a NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)[NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new ImageNode('you fight Gary', 'https://example.com/fight.svg'),
        new NsfwNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An image directly followed by a NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)[NSFL: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new ImageNode('you fight Gary', 'https://example.com/fight.svg'),
        new NsflNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An image directly followed by a footnote', () => {
  it("is not linkified", () => {
    const text = "After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)(^Or whatever you name him.)"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("After you beat the Elite Four, "),
          new ImageNode('you fight Gary', 'https://example.com/fight.svg'),
          footnotes[0],
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified audio convention with its linkifying URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.toAst('[image: phone call](https://example.com/phonecall.svg)(\\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new ImageNode('phone call', 'https://example.com/phonecall.svg'),
        new ParenthesizedNode([
          new PlainTextNode('(tel:5555555555)')
        ]),
      ]))
  })
})