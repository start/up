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
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { ItalicNode } from '../../../SyntaxNodes/ItalicNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'
import { RevisionInsertionNode } from'../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from'../../../SyntaxNodes/RevisionDeletionNode'

/*import { LinkNode } from'../../../SyntaxNodes/LinkNode'
import { StressNode } from'../../../SyntaxNodes/StressNode'
import { ItalicNode } from'../../../SyntaxNodes/ItalicNode'
import { InlineSpoilerNode } from'../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from'../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from'../../../SyntaxNodes/InlineNsflNode'
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

    specify('Inline code', () => {
      expect(Up.toInlineDocument('I loved `<dl>` elements, though I never used them.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved '),
          new InlineCodeNode('<dl>'),
          new PlainTextNode(' elements, though I never used them.'),
        ]))
    })

    specify('Inline NSFL', () => {
      expect(Up.toInlineDocument('I loved my [NSFL: Game Boy], though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new InlineNsflNode([
            new PlainTextNode('Game Boy'),
          ]),
          new PlainTextNode(', though I never took it with me when I left home.'),
        ]))
    })

    specify('Inline NSFW', () => {
      expect(Up.toInlineDocument('I loved my [NSFW: Game Boy], though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new InlineNsfwNode([
            new PlainTextNode('Game Boy'),
          ]),
          new PlainTextNode(', though I never took it with me when I left home.'),
        ]))
    })

    specify('Inline spoilers', () => {
      expect(Up.toInlineDocument('I loved my [SPOILER: Game Boy], though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new InlineSpoilerNode([
            new PlainTextNode('Game Boy'),
          ]),
          new PlainTextNode(', though I never took it with me when I left home.'),
        ]))
    })

    specify('Italic', () => {
      expect(Up.toInlineDocument('I loved my _Game Boy_, though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new ItalicNode([
            new PlainTextNode('Game Boy'),
          ]),
          new PlainTextNode(', though I never took it with me when I left home.'),
        ]))
    })

    specify('Links', () => {
      expect(Up.toInlineDocument('I loved my [Game Boy] (example.com/gb), though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new LinkNode([
            new PlainTextNode('Game Boy'),
          ], 'https://example.com/gb'),
          new PlainTextNode(', though I never took it with me when I left home.'),
        ]))
    })

    specify('Parnetheses', () => {
      expect(Up.toInlineDocument('I loved my (Nintendo) Game Boy, though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new ParenthesizedNode([
            new PlainTextNode('(Nintendo)'),
          ]),
          new PlainTextNode(' Game Boy, though I never took it with me when I left home.'),
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toInlineDocument('I loved my [Nintendo] Game Boy, though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new SquareBracketedNode([
            new PlainTextNode('[Nintendo]'),
          ]),
          new PlainTextNode(' Game Boy, though I never took it with me when I left home.'),
        ]))
    })

    specify('Revision deletion', () => {
      expect(Up.toInlineDocument('I loved my ~~Nintendo~~ Game Boy, though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new RevisionDeletionNode([
            new PlainTextNode('Nintendo'),
          ]),
          new PlainTextNode(' Game Boy, though I never took it with me when I left home.'),
        ]))
    })

    specify('Revision insertion', () => {
      expect(Up.toInlineDocument('I loved my ++Nintendo++ Game Boy, though I never took it with me when I left home.')).to.be.eql(
        new InlineUpDocument([
          new PlainTextNode('I loved my '),
          new RevisionInsertionNode([
            new PlainTextNode('Nintendo'),
          ]),
          new PlainTextNode(' Game Boy, though I never took it with me when I left home.'),
        ]))
    })
  })
})

/*
export { RevisionDeletionNode } from './SyntaxNodes/RevisionDeletionNode'
export { RevisionInsertionNode } from './SyntaxNodes/RevisionInsertionNode'
export { OutlineSeparatorNode } from './SyntaxNodes/OutlineSeparatorNode'
export { SpoilerBlockNode } from './SyntaxNodes/SpoilerBlockNode'
export { SquareBracketedNode } from './SyntaxNodes/SquareBracketedNode'
export { StressNode } from './SyntaxNodes/StressNode'
export { TableNode } from './SyntaxNodes/TableNode'
export { UnorderedListNode } from './SyntaxNodes/UnorderedListNode'
export { VideoNode } from './SyntaxNodes/VideoNode'*/