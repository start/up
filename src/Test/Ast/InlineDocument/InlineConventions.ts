import { expect } from 'chai'
import Up from'../../../index'
import { InlineUpDocument } from'../../../SyntaxNodes/InlineUpDocument'
import { PlainTextNode } from'../../../SyntaxNodes/PlainTextNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { BoldNode } from'../../../SyntaxNodes/BoldNode'
import { EmphasisNode } from'../../../SyntaxNodes/EmphasisNode'
import { ExampleInputNode } from '../../../SyntaxNodes/ExampleInputNode'
import { HighlightNode } from '../../../SyntaxNodes/HighlightNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'

/*import { LinkNode } from'../../../SyntaxNodes/LinkNode'
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
      expect(Up.toInlineDocument('I loved my __Game Boy__, though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new BoldNode([
            new PlainTextNode('Game Boy'),
          ]),
          new PlainTextNode(', though I never took it with me when I left home.'),
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.toInlineDocument('I loved my *Game Boy*, though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new EmphasisNode([
            new PlainTextNode('Game Boy'),
          ]),
          new PlainTextNode(', though I never took it with me when I left home.'),
        ]))
    })

    specify('Example input', () => {
      expect(Up.toInlineDocument('I loved pressing {A} and {B} on my Game Boy, though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved pressing '),
          new ExampleInputNode('A'),
          new PlainTextNode(' and '),
          new ExampleInputNode('B'),
          new PlainTextNode(' on my Game Boy, though I never took it with me when I left home.'),
        ]))
    })

    specify('Highlight', () => {
      expect(Up.toInlineDocument('I loved my [highlight: Game Boy], though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new HighlightNode([
            new PlainTextNode('Game Boy'),
          ]),
          new PlainTextNode(', though I never took it with me when I left home.'),
        ]))
    })

    specify('Images', () => {
      expect(Up.toInlineDocument('Look at this: [image: cricket sewing] (example.com/sew.ogg)')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('Look at this: '),
          new ImageNode('cricket sewing', 'https://example.com/sew.ogg')
        ]))
    })
  })
})

/*
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