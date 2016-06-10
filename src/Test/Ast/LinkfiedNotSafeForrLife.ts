import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOf } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { NotSafeForLifeNode } from '../../SyntaxNodes/NotSafeForLifeNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'


describe('A NSFL convention followed immediately by a parenthesized/bracketd URL', () => {
  it('produces a NSFL node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: you eat rotting Gary](http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NotSafeForLifeNode([
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
    expectEveryCombinationOf({
      firstHalves: [
        '[NSFL: you eat rotting Gary]',
        '(NSFL: you eat rotting Gary)',
        '{NSFL: you eat rotting Gary}'
      ],
      secondHalves: [
        '[http://example.com/finalbattle]',
        '(http://example.com/finalbattle)',
        '{http://example.com/finalbattle}'
      ],
      toProduce: insideDocumentAndParagraph([
        new NotSafeForLifeNode([
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
        new NotSafeForLifeNode([
          new PlainTextNode('you eat rotting Gary')
        ]),
        new NotSafeForLifeNode([
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
        new NotSafeForLifeNode([
          new PlainTextNode('you eat rotting Gary')
        ]),
        new AudioNode('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('A NSFL convention directly followed by a footnote', () => {
  it("is not linkified", () => {
    const text = "After you beat the Elite Four, [NSFL: you eat rotting Gary]((Or whatever you name him.))"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("After you beat the Elite Four, "),
          new NotSafeForLifeNode([
            new PlainTextNode('you eat rotting Gary')
          ]),
          footnotes[0],
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})