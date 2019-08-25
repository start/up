import { expect } from 'chai'
import * as Up from '../../../Main'


describe('When a blockquote starts with a blank line', () => {
  specify('its first convention is mapped to the correct line', () => {
    const markup = `
>
> Who doesn't?
>
> Well, aside from you.`
    expect(Up.parse(markup, { createSourceMap: true })).to.deep.equal(
      new Up.Document([
        new Up.Blockquote([
          new Up.Paragraph([new Up.Text("Who doesn't?")], { sourceLineNumber: 3 }),
          new Up.Paragraph([new Up.Text("Well, aside from you.")], { sourceLineNumber: 5 })
        ], { sourceLineNumber: 2 })
      ]))
  })
})


context('When a single line of markup produces multiple "outlined" media nodes, and one of them is inside a link,', () => {
  specify('the link and the media nodes that are outside of it are mapped to that same line', () => {
    const markup =
      '[image: haunted house](example.com/hauntedhouse.svg)(example.com/gallery) [audio: haunted house](example.com/hauntedhouse.ogg) [video: haunted house](example.com/hauntedhouse.webm)'

    expect(Up.parse(markup, { createSourceMap: true })).to.deep.equal(
      new Up.Document([
        new Up.Link([
          new Up.Image('haunted house', 'https://example.com/hauntedhouse.svg')
        ], 'https://example.com/gallery', { sourceLineNumber: 1 }),
        new Up.Audio('haunted house', 'https://example.com/hauntedhouse.ogg', { sourceLineNumber: 1 }),
        new Up.Video('haunted house', 'https://example.com/hauntedhouse.webm', { sourceLineNumber: 1 })
      ]))
  })
})
