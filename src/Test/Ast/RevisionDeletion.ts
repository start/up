
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
import { PlaceholderFootnoteReferenceNode } from '../../SyntaxNodes/PlaceholderFootnoteReferenceNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'


describe('Text surrounded by 2 tildes', () => {
  it('is put inside a revision deletion node', () => {
    expect(Up.toAst('I like ~~certain types of~~ pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionDeletionNode([
          new PlainTextNode('certain types of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('A revision deletion', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('I like ~~certain *types* of~~ pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionDeletionNode([
          new PlainTextNode('certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})
