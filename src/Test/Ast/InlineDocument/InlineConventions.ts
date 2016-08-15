import { expect } from 'chai'
import Up from'../../../index'
import { InlineUpDocument } from'../../../SyntaxNodes/InlineUpDocument'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { BoldNode } from'../../../SyntaxNodes/BoldNode'
import { PlainTextNode } from'../../../SyntaxNodes/PlainTextNode'

/*import { LinkNode } from'../../../SyntaxNodes/LinkNode'
import { EmphasisNode } from'../../../SyntaxNodes/EmphasisNode'
import { StressNode } from'../../../SyntaxNodes/StressNode'
import { ItalicNode } from'../../../SyntaxNodes/ItalicNode'
import { InlineSpoilerNode } from'../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from'../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from'../../../SyntaxNodes/InlineNsflNode'
import { RevisionInsertionNode } from'../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from'../../../SyntaxNodes/RevisionDeletionNode'
import { ParenthesizedNode } from'../../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from'../../../SyntaxNodes/SquareBracketedNode'
import { FootnoteNode } from'../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from'../../../SyntaxNodes/FootnoteBlockNode'
import { HighlightNode } from'../../../SyntaxNodes/HighlightNode'*/


context('Except for footnots, every inline convention is supported in inline documents.', () => {
  context('Supported conventions:', () => {
    specify('Audio', () => {
      expect(Up.toInlineDocument('Listen to this: [audio: cricket meowing] (example.com/meow.ogg)')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('Listen to this: '),
          new AudioNode('cricket meowing', 'https://example.com/meow.ogg')
        ]))
    })

    specify('Bold', () => {
      expect(Up.toInlineDocument('I loved my __Game Boy__, though I never took it with me when I left house.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new BoldNode([
            new PlainTextNode('Game Boy'),
          ]),
          new PlainTextNode('though I never took it with me when I left house.'),
        ]))
    })
  })
})

/*
export { AudioNode } from './SyntaxNodes/AudioNode'
export { BoldNode } from './SyntaxNodes/BoldNode'
export { BlockquoteNode } from './SyntaxNodes/BlockquoteNode'
export { CodeBlockNode } from './SyntaxNodes/CodeBlockNode'
export { DescriptionListNode } from './SyntaxNodes/DescriptionListNode'
export { EmphasisNode } from './SyntaxNodes/EmphasisNode'
export { ExampleInputNode } from './SyntaxNodes/ExampleInputNode'
export { FootnoteBlockNode } from './SyntaxNodes/FootnoteBlockNode'
export { FootnoteNode } from './SyntaxNodes/FootnoteNode'
export { HeadingNode } from './SyntaxNodes/HeadingNode'
export { HighlightNode } from './SyntaxNodes/HighlightNode'
export { ImageNode } from './SyntaxNodes/ImageNode'
export { InlineCodeNode } from './SyntaxNodes/InlineCodeNode'
export { InlineNsflNode } from './SyntaxNodes/InlineNsflNode'
export { InlineNsfwNode } from './SyntaxNodes/InlineNsfwNode'
export { InlineSpoilerNode } from './SyntaxNodes/InlineSpoilerNode'
export { ItalicNode } from './SyntaxNodes/ItalicNode'
export { LineBlockNode } from './SyntaxNodes/LineBlockNode'
export { LinkNode } from './SyntaxNodes/LinkNode'
export { NsflBlockNode } from './SyntaxNodes/NsflBlockNode'
export { NsfwBlockNode } from './SyntaxNodes/NsfwBlockNode'
export { OrderedListNode } from './SyntaxNodes/OrderedListNode'
export { ParagraphNode } from './SyntaxNodes/ParagraphNode'
export { ParenthesizedNode } from './SyntaxNodes/ParenthesizedNode'
export { PlainTextNode } from './SyntaxNodes/PlainTextNode'
export { RevisionDeletionNode } from './SyntaxNodes/RevisionDeletionNode'
export { RevisionInsertionNode } from './SyntaxNodes/RevisionInsertionNode'
export { OutlineSeparatorNode } from './SyntaxNodes/OutlineSeparatorNode'
export { SpoilerBlockNode } from './SyntaxNodes/SpoilerBlockNode'
export { SquareBracketedNode } from './SyntaxNodes/SquareBracketedNode'
export { StressNode } from './SyntaxNodes/StressNode'
export { TableNode } from './SyntaxNodes/TableNode'
export { UnorderedListNode } from './SyntaxNodes/UnorderedListNode'
export { VideoNode } from './SyntaxNodes/VideoNode'*/