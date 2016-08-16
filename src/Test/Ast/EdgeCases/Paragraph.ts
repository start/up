import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'


describe('A paragraph directly followed by a line consisting solely of media conventions', () => {
  it('produces a paragraph node', () => {
    const markup = `
You'll never believe this fake evidence!
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ]),
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A paragraph directly following a line consisting solely of media conventions', () => {
  it('produces a paragraph node', () => {
    const markup = `
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]
You'll never believe this fake evidence!`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ])
      ]))
  })
})


describe('A paragraph directly sandwiched by lines consisting solely of media conventions', () => {
  it('produces a paragraph node', () => {
    const markup = `
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]
You'll never believe this fake evidence!
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ]),
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A paragraph directly followed by several (non-indented) lines consisting solely of escaped whitespace', () => {
  it('produces a paragraph node', () => {
    const markup = `
You'll never believe this fake evidence!
\\   \\  \t \\\t 
 \\   \\  \t \\\t 
\\   \t\\   \\  \t \\\t `

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ])
      ]))
  })
})


describe('A paragraph directly following several (non-indented) lines consisting solely of escaped whitespace', () => {
  it('produces a paragraph node', () => {
    const markup = `
You'll never believe this fake evidence!
\\   \t\\   \\  \t \\\t 
\\   \\  \t \\\t 
 \\   \\  \t \\\t `

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ])
      ]))
  })
})


describe('A paragraph sandwiched by several (non-indented) lines consisting solely of escaped whitespace', () => {
  it('produces a paragraph node', () => {
    const markup = `
  \\   \t\\   \\  \t \\\t 
\\   \\  \t \\\t 
 \\   \\  \t \\\t 
You'll never believe this fake evidence!
\\   \t\\   \\  \t \\\t 
\\   \\  \t \\\t 
 \\   \\  \t \\\t `

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ])
      ]))
  })
})
