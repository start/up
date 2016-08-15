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
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


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
      toProduce: new UpDocument([
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
        toProduce: new UpDocument([
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
        toProduce: new UpDocument([
          new LinkNode([
            new ImageNode('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final battle')
        ])
      })
    })
  })
})


describe('An image convention directly followed by an inline spoiler', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)[SPOILER: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new ImageNode('you fight Gary', 'https://example.com/fight.svg'),
        new InlineSpoilerNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An image directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)[NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new ImageNode('you fight Gary', 'https://example.com/fight.svg'),
        new InlineNsfwNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An image directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)[NSFL: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new ImageNode('you fight Gary', 'https://example.com/fight.svg'),
        new InlineNsflNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An image directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)(^Or whatever you name him.)"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("After you beat the Elite Four, "),
          new ImageNode('you fight Gary', 'https://example.com/fight.svg'),
          footnotes[0],
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified image convention with its linkifying URL escaped', () => {
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


context("When an otherwise-valid linkified image convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the image convention is not linkified', () => {
    expect(Up.toAst('[image: phone call](https://example.com/phonecall.ogg)( \t \\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new ImageNode('phone call', 'https://example.com/phonecall.ogg'),
        new PlainTextNode('( \t tel:5555555555)')
      ]))
  })
})
