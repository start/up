
import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { PlaceholderFootnoteReferenceNode } from '../../../SyntaxNodes/PlaceholderFootnoteReferenceNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


describe('A spoiler with " -> " inside', () => {
  it('is not transformed into a link', () => {
    expect(Up.toAst('[<_<]Goten + Trunks -> Gotenks[>_>]')).to.be.eql(
      insideDocumentAndParagraph([
        new SpoilerNode([
          new PlainTextNode('Goten + Trunks -> Gotenks')
        ]),
      ]))
  })
})

describe('A single spoiler start face', () => {
  it ('remains plain text', () => {
    expect(Up.toAst('[<_<]')).to.be.eql(
      insideDocumentAndParagraph([
          new PlainTextNode('[<_<]')
      ]))
  })
})
