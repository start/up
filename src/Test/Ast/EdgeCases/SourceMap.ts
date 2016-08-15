import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'


describe('When a blockquote starts with a blank line', () => {
  specify('its first convention is mapped to the correct line', () => {
    const markup = `
>
> Who doesn't?
>
> Well, aside from you.`
    expect(Up.toAst(markup, { createSourceMap: true })).to.be.eql(
      new UpDocument([
        new BlockquoteNode([
          new ParagraphNode([new PlainTextNode("Who doesn't?")], 3),
          new ParagraphNode([new PlainTextNode("Well, aside from you.")], 5)
        ], 2)
      ]))
  })
})


context('When a single line of markup produces multiple "outlined" media nodes, and one of them is inside a link,', () => {
  specify('the link and the media nodes that are outside of it are mapped to that same line', () => {
    const markup =
      '[image: haunted house](example.com/hauntedhouse.svg)(example.com/gallery) [audio: haunted house](example.com/hauntedhouse.ogg) [video: haunted house](example.com/hauntedhouse.webm)'

    expect(Up.toAst(markup, { createSourceMap: true })).to.be.eql(
      new UpDocument([
        new LinkNode([
          new ImageNode('haunted house', 'https://example.com/hauntedhouse.svg'),
        ], 'https://example.com/gallery', 1),
        new AudioNode('haunted house', 'https://example.com/hauntedhouse.ogg', 1),
        new VideoNode('haunted house', 'https://example.com/hauntedhouse.webm', 1)
      ]))
  })
})
