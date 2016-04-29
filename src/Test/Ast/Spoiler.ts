
import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'


describe('Bracketed text starting with "spoiler:"', () => {
  it('is put inside a spoiler node', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})

describe('Spoiler conventions', () => {
  it('can use any capitalization of the word "spoiler"', () => {
    const withLowercase = 'After you beat the Elite Four, [spoiler: you fight Gary].'
    const withRandomCase = 'After you beat the Elite Four, [SPoILeR: you fight Gary].'
    
    expect(Up.toAst(withLowercase)).to.be.eql(Up.toAst(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight *Gary*].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight '),
          new EmphasisNode([
            new PlainTextNode('Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('can be nested within another spoiler node', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight [SPOILER: Gary]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight '),
          new SpoilerNode([
            new PlainTextNode('Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })
})
