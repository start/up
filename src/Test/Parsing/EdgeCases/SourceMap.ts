import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Blockquote } from '../../../SyntaxNodes/Blockquote'
import { Audio } from '../../../SyntaxNodes/Audio'
import { Image } from '../../../SyntaxNodes/Image'
import { Video } from '../../../SyntaxNodes/Video'
import { Link } from '../../../SyntaxNodes/Link'


describe('When a blockquote starts with a blank line', () => {
  specify('its first convention is mapped to the correct line', () => {
    const markup = `
>
> Who doesn't?
>
> Well, aside from you.`
    expect(Up.toDocument(markup, { createSourceMap: true })).to.be.eql(
      new UpDocument([
        new Blockquote([
          new Paragraph([new PlainText("Who doesn't?")], 3),
          new Paragraph([new PlainText("Well, aside from you.")], 5)
        ], 2)
      ]))
  })
})


context('When a single line of markup produces multiple "outlined" media nodes, and one of them is inside a link,', () => {
  specify('the link and the media nodes that are outside of it are mapped to that same line', () => {
    const markup =
      '[image: haunted house](example.com/hauntedhouse.svg)(example.com/gallery) [audio: haunted house](example.com/hauntedhouse.ogg) [video: haunted house](example.com/hauntedhouse.webm)'

    expect(Up.toDocument(markup, { createSourceMap: true })).to.be.eql(
      new UpDocument([
        new Link([
          new Image('haunted house', 'https://example.com/hauntedhouse.svg'),
        ], 'https://example.com/gallery', 1),
        new Audio('haunted house', 'https://example.com/hauntedhouse.ogg', 1),
        new Video('haunted house', 'https://example.com/hauntedhouse.webm', 1)
      ]))
  })
})
