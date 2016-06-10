import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOf } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { NotSafeForWorkNode } from '../../SyntaxNodes/NotSafeForWorkNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'


describe('A NSFW convention followed immediately by a parenthesized/bracketd URL', () => {
  it('produces a NSFW node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFW: you wrestle naked Gary](http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NotSafeForWorkNode([
          new LinkNode([
            new PlainTextNode('you wrestle naked Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Any NSFW convention followed immediately by a parenthesized/bracketed URL', () => {
  it('produces a NSFW node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the NSFW convention can be different from the type of bracket surrounding the URL', () => {
    expectEveryCombinationOf({
      firstHalves: [
        '[NSFW: you wrestle naked Gary]',
        '(NSFW: you wrestle naked Gary)',
        '{NSFW: you wrestle naked Gary}'
      ],
      secondHalves: [
        '[http://example.com/finalbattle]',
        '(http://example.com/finalbattle)',
        '{http://example.com/finalbattle}'
      ],
      toProduce: insideDocumentAndParagraph([
        new NotSafeForWorkNode([
          new LinkNode([
            new PlainTextNode('you wrestle naked Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})


describe('A NSFW convention directly followed by another NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFW: you wrestle naked Gary][NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NotSafeForWorkNode([
          new PlainTextNode('you wrestle naked Gary')
        ]),
        new NotSafeForWorkNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A NSFW convention directly followed by a media convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFW: you wrestle naked Gary][audio: final battle theme](https://example.com/songs/123.ogg)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NotSafeForWorkNode([
          new PlainTextNode('you wrestle naked Gary')
        ]),
        new AudioNode('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('A NSFW convention directly followed by a footnote', () => {
  it("is not linkified", () => {
    const text = "After you beat the Elite Four, [NSFW: you wrestle naked Gary]((Or whatever you name him.))"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("After you beat the Elite Four, "),
          new NotSafeForWorkNode([
            new PlainTextNode('you wrestle naked Gary')
          ]),
          footnotes[0],
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})