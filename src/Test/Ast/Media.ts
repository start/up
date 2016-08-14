import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'


context('If a line consists solely of media conventions, those media conventions are placed directly into the outline (rather than into a paragraph).', () => {
  specify('This line can be a mix of all media conventions', () => {
    const markup =
      '[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm] '

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })

  specify('The line can have whitespace between and around the media conventions', () => {
    const markup =
      ' \t [audio: ghostly howling] (http://example.com/ghosts.ogg) \t [image: haunted house] (http://example.com/hauntedhouse.svg) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) \t '

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })

  specify('The line can have whitespace between and around the media conventions', () => {
    const markup =
      ' \t [audio: ghostly howling] (http://example.com/ghosts.ogg) \t [image: haunted house] (http://example.com/hauntedhouse.svg) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) \t '

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })


  context("A link containing only one or more media conventions (and optional whitspace) counts as media for the purpose of this rule.", () => {
    specify("All of the media conventions on a line can be stuffed into one link", () => {
      const markup =
        ' \t [[audio: ghostly howling] (http://example.com/ghosts.ogg) \t [image: haunted house] (http://example.com/hauntedhouse.svg) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm)] (hauntedhouse.com)  \t '

      expect(Up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new LinkNode([
            new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
            new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
            new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
          ], 'https://hauntedhouse.com')
        ]))
    })

    specify("One or more media conventions on the line can be left out of the link", () => {
      const markup =
        ' \t [audio: ghostly howling] [http://example.com/ghosts.ogg] \t ([image: haunted house] [http://example.com/hauntedhouse.svg] \t [video: ghosts eating luggage] [http://example.com/poltergeists.webm]) (hauntedhouse.com)  \t '

      expect(Up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
          new LinkNode([
            new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
            new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
          ], 'https://hauntedhouse.com')
        ]))
    })

    specify("There can be multiple links on the same line", () => {
      const markup =
        ' \t [audio: ghostly howling] (http://example.com/ghosts.ogg) (ghosts.com) \t [image: haunted house] (http://example.com/hauntedhouse.svg) (hauntedhouse.com) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) (poltergeists.com) \t '

      expect(Up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new LinkNode([
            new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg')
          ], 'https://ghosts.com'),
          new LinkNode([
            new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg')
          ], 'https://hauntedhouse.com'),
          new LinkNode([
            new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
          ], 'https://poltergeists.com')
        ]))
    })
  })
})
