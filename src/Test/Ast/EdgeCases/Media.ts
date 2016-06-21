import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { Line } from '../../../SyntaxNodes/Line'


describe('A line consisting solely of media conventions', () => {
  it('produces a node for each convention and includes each directly into the outline, rather than squeezing them all into a paragraph', () => {
    const text =
      '[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm] '

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A line consisting solely of media conventions and optional whitespace', () => {
  it('produces a node for each convention and includes each directly into the outline, rather than squeezing them all into a paragraph', () => {
    const text =
      ' \t [audio: ghostly howling] (http://example.com/ghosts.ogg) \t [image: haunted house] (http://example.com/hauntedhouse.svg) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) \t '

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})
