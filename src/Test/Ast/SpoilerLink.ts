import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOf } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'


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


describe('A spoiler produced by parentheses, square brackets, or curly brackets followed immediately by a parenthesized, a square bracketed, or a curly bracketed URL', () => {
  it('produces a spoiler node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the spoiler can be different from the type of bracket surrounding the URL', () => {
    expectEveryCombinationOf({
      firstHalves: [
        '[SPOILER: you fight Gary]',
        '(SPOILER: you fight Gary)',
        '{SPOILER: you fight Gary}'
      ],
      secondHalves: [
        '[http://example.com/finalbattle]',
        '(http://example.com/finalbattle)',
        '{http://example.com/finalbattle}'
      ],
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
