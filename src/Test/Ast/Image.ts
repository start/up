
import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
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


describe('Bracketed text containing open eyes, reading a description, both of which point to a URL', () => {
  it('produces an image node with the description and URL', () => {
    expect(Up.toAst('I would never stay here. [o_o: haunted house -> http://example.com/hauntedhouse.svg] Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay here. '),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new PlainTextNode(' Would you?')
      ]))
  })
})


describe('An image that is the only convention on its line', () => {
  it('is not placed inside a paragraph node, instead being placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toAst('[o_o: haunted house -> http://example.com/hauntedhouse.svg]')).to.be.eql(
      new DocumentNode([
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg')
      ]))
  })
})


describe('An image with a relative URL containing spaces and no extension', () => {
  it('is parsed correctly', () => {
    expect(Up.toAst('[o_o: haunted house -> haunted house]')).to.be.eql(
      new DocumentNode([
        new ImageNode('haunted house', 'haunted house'),
      ]))
  })
})