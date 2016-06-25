import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../../SyntaxNodes/NsflNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


describe('A spoiler followed immediately by a parenthesized/bracketd URL', () => {
  it('produces a spoiler node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight Gary](http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Any spoiler followed immediately by a parenthesized/bracketed URL', () => {
  it('produces a spoiler node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the spoiler can be different from the type of bracket surrounding the URL', () => {
    expectEveryCombinationOfBrackets({
      contentToWrapInBrackets: 'SPOILER: you fight Gary',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'http://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})


describe('A spoiler directly followed by another spoiler', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight Gary][SPOILER: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new SpoilerNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A spoiler directly followed by a NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight Gary][NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new NsfwNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A spoiler directly followed by a NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight Gary][NSFL: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new NsflNode([
          new PlainTextNode('and win')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A spoiler directly followed by a media convention', () => {
  it('is not linkified', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight Gary][audio: final battle theme](https://example.com/songs/123.ogg)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new AudioNode('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('A spoiler directly followed by a footnote', () => {
  it("is not linkified", () => {
    const text = "After you beat the Elite Four, [SPOILER: you fight Gary]((Or whatever you name him.))"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("After you beat the Elite Four, "),
          new SpoilerNode([
            new PlainTextNode('you fight Gary')
          ]),
          footnotes[0],
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})
