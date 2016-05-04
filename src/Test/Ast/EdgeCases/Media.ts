import { expect } from 'chai'
import * as Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { Line } from '../../../SyntaxNodes/Line'


describe('A line consisting solely of media conventions (and optional whitespace)', () => {
  it('produces a node for each convention and includes each directly into the outline, rather than squeezing them all into a paragraph', () => {
    const text =
      '[audio: ghostly howling -> http://example.com/ghosts.ogg] [image: haunted house -> http://example.com/hauntedhouse.svg] [video: ghosts eating luggage -> http://example.com/poltergeists.webm] '

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A paragraph followed by a line consisting solely of media conventions', () => {
  it('does not produce a line block node', () => {
    const text = `
You'll never believe this fake evidence!
[audio: ghostly howling -> http://example.com/ghosts.ogg][image: haunted house -> http://example.com/hauntedhouse.svg][video: ghosts eating luggage -> http://example.com/poltergeists.webm]`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ]),
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A line solely consisting solely of media conventions inserted in the middle of a line block', () => {
  it('splits the line block in two', () => {
    const text = `
1234 Spooky Street
Pepe, PA 17101
[audio: ghostly howling -> http://example.com/ghosts.ogg][image: haunted house -> http://example.com/hauntedhouse.svg][video: ghosts eating luggage -> http://example.com/poltergeists.webm]
Roses are red
Skeltals are white
If you stay here
You're in for a fright`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('1234 Spooky Street')
          ]),
          new Line([
            new PlainTextNode('Pepe, PA 17101')
          ])
        ]),
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Skeltals are white')
          ]),
          new Line([
            new PlainTextNode('If you stay here')
          ]),
          new Line([
            new PlainTextNode("You're in for a fright")
          ]),
        ])
      ]))
  })
})
