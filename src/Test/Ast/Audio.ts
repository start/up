
import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
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


describe('Bracketed text containing the word "audio" with a description pointing to a URL', () => {
  it('produces an audio node with the description and URL', () => {
    expect(Up.toAst('I would never stay in a house with these sounds. [audio: ghostly howling -> http://example.com/ghosts.ogg] Would you?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I would never stay in a house with these sounds. '),
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new PlainTextNode(' Would you?')
      ]))
  })
})


describe('Audio that is the only convention on its line', () => {
  it('is not placed inside a paragraph node, instead being placed directly inside the node that would have contained paragraph', () => {
    expect(Up.toAst('[audio: ghostly howling -> http://example.com/ghosts.ogg]')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
      ]))
  })
})


describe('Audio with a relative URL containing spaces and no extension', () => {
  it('is parsed correctly', () => {
    expect(Up.toAst('[audio: ghostly howling -> ghostly howling]')).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'ghostly howling'),
      ]))
  })
})
