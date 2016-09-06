import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Link } from '../../SyntaxNodes/Link'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'


context('If a line consists solely of media conventions, those media conventions are placed directly into the outline (rather than into a paragraph).', () => {
  specify('This line can be a mix of all media conventions', () => {
    const markup =
      '[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm] '

    expect(Up.parseDocument(markup)).to.deep.equal(
      new UpDocument([
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })

  specify('The line can have whitespace between and around the media conventions', () => {
    const markup =
      ' \t [audio: ghostly howling] (http://example.com/ghosts.ogg) \t [image: haunted house] (http://example.com/hauntedhouse.svg) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) \t '

    expect(Up.parseDocument(markup)).to.deep.equal(
      new UpDocument([
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })

  specify('The line can have whitespace between and around the media conventions', () => {
    const markup =
      ' \t [audio: ghostly howling] (http://example.com/ghosts.ogg) \t [image: haunted house] (http://example.com/hauntedhouse.svg) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) \t '

    expect(Up.parseDocument(markup)).to.deep.equal(
      new UpDocument([
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })


  context("A link containing only one or more media conventions (and optional whitspace) counts as media for the purpose of this rule.", () => {
    specify("All of the media conventions on a line can be stuffed into one link", () => {
      const markup =
        ' \t [[audio: ghostly howling] (http://example.com/ghosts.ogg) \t [image: haunted house] (http://example.com/hauntedhouse.svg) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm)] (hauntedhouse.com)  \t '

      expect(Up.parseDocument(markup)).to.deep.equal(
        new UpDocument([
          new Link([
            new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
            new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
            new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
          ], 'https://hauntedhouse.com')
        ]))
    })

    specify("One or more media conventions on the line can be left out of the link", () => {
      const markup =
        ' \t [audio: ghostly howling] [http://example.com/ghosts.ogg] \t ([image: haunted house] [http://example.com/hauntedhouse.svg] \t [video: ghosts eating luggage] [http://example.com/poltergeists.webm]) (hauntedhouse.com)  \t '

      expect(Up.parseDocument(markup)).to.deep.equal(
        new UpDocument([
          new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
          new Link([
            new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
            new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
          ], 'https://hauntedhouse.com')
        ]))
    })

    specify("There can be multiple links on the same line", () => {
      const markup =
        ' \t [audio: ghostly howling] (http://example.com/ghosts.ogg) (ghosts.com) \t [image: haunted house] (http://example.com/hauntedhouse.svg) (hauntedhouse.com) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) (poltergeists.com) \t '

      expect(Up.parseDocument(markup)).to.deep.equal(
        new UpDocument([
          new Link([
            new Audio('ghostly howling', 'http://example.com/ghosts.ogg')
          ], 'https://ghosts.com'),
          new Link([
            new Image('haunted house', 'http://example.com/hauntedhouse.svg')
          ], 'https://hauntedhouse.com'),
          new Link([
            new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
          ], 'https://poltergeists.com')
        ]))
    })
  })
})
