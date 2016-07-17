import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


describe('A NSFL convention followed immediately by a parenthesized/bracketd URL', () => {
  it('produces a NSFL node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: you eat rotting Gary](http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('you eat rotting Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Any NSFL convention followed immediately by a parenthesized/bracketed URL', () => {
  it('produces a NSFL node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the NSFL convention can be different from the type of bracket surrounding the URL', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFL: you eat rotting Gary',
      url: 'http://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('you eat rotting Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})


describe('A NSFL convention directly followed by another NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: you eat rotting Gary][NSFL: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you eat rotting Gary')
        ]),
        new InlineNsflNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A NSFL convention directly followed by a spoiler convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: you eat rotting Gary][SPOILER: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you eat rotting Gary')
        ]),
        new InlineSpoilerNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A NSFL convention directly followed by a NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: you eat rotting Gary][NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you eat rotting Gary')
        ]),
        new NsfwNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A NSFL convention directly followed by a media convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: you eat rotting Gary][audio: final battle theme](https://example.com/songs/123.ogg)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you eat rotting Gary')
        ]),
        new AudioNode('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('A NSFL convention directly followed by a footnote', () => {
  it("is not linkified", () => {
    const text = "After you beat the Elite Four, [NSFL: you eat rotting Gary](^Or whatever you name him.)"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("After you beat the Elite Four, "),
          new InlineNsflNode([
            new PlainTextNode('you eat rotting Gary')
          ]),
          footnotes[0],
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified NSFL convention with its URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.toAst('[NSFL: he called her](\\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineNsflNode([
          new PlainTextNode('he called her')
        ]),
        new ParenthesizedNode([
          new PlainTextNode('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified NSFL convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the NSFL convention is not linkified', () => {
    expect(Up.toAst('[NSFL: he called her]( \t \\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineNsflNode([
          new PlainTextNode('he called her')
        ]),
        new PlainTextNode('( \t tel:5555555555)')
      ]))
  })
})


context("If there's no whitespace between a NSFL conventions and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFL: you fight Gary',
      url: ' \t \thttp://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})