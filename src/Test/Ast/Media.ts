import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'


context('If a line consists solely of media conventions, those media conventions are placed directly into the outline (rather than inside a paragraph)', () => {
  specify('This line can be a mix of all media conventions', () => {
    const text =
      '[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm] '

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })

  it('The line can have whitespace between and around the media conventions', () => {
    const text =
      ' \t [audio: ghostly howling] (http://example.com/ghosts.ogg) \t [image: haunted house] (http://example.com/hauntedhouse.svg) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) \t '

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })

  it('The line can have a linkified image', () => {
    const text =
      ' \t [audio: ghostly howling] (http://example.com/ghosts.ogg) \t [image: haunted house] (http://example.com/hauntedhouse.svg) (hauntedhouse.com) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) \t '

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new LinkNode([
          new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        ], 'https://hauntedhouse.com'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })

  it('The line can have an image as the sole convention within a link', () => {
    const text =
      ' \t [audio: ghostly howling] (http://example.com/ghosts.ogg) \t {[image: haunted house] (http://example.com/hauntedhouse.svg)} (hauntedhouse.com) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) \t '

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new LinkNode([
          new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        ], 'https://hauntedhouse.com'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})
