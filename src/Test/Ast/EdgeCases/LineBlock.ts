import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { Line } from '../../../SyntaxNodes/Line'


describe('An otherwise blank line starting with an escaped backslash', () => {
  it('can be the second line in a line block', () => {
    const text =
      `
Roses are red
\\ \t
Violets are blue`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode(' \t')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
})


describe('A line starting with an escaped character in a line block', () => {
  it('does not impact the parsing of the next line', () => {
    const text = `
\\Roses are red
Violets are blue`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })

  it('does not impact the parsing of the previous line', () => {
    const text = `
Roses are red
\\Violets are blue`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
})


describe('Within a line block, a line with an escaped line break followed by another line', () => {
  it('are considered part of the same line', () => {
    const text = `
Roses are red\\
Violets are blue
Lyrics have lines
And addresses do, too`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red\nViolets are blue')
          ]),
          new Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ])
      ]))
  })
})


describe('An empty line with an escaped line break followed by another empty line', () => {
  it('are considered part of the same line and can be included in a line block', () => {
    const text = `
Roses are red
\\

Violets are blue`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('\n')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
})


describe('A line block', () => [
  it('can contain an escaped section separator streak', () => {
    const text = `
Roses are red
Violets are blue
\\#~#~#~#~#~#~#~#~#
Lyrics have lines
And addresses do, too`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
          new Line([
            new PlainTextNode('#~#~#~#~#~#~#~#~#')
          ]),
          new Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ]),
      ]))
  })
])


describe('A paragraph directly followed by a line consisting solely of media conventions', () => {
  it('does not produce a line block node', () => {
    const text = `
You'll never believe this fake evidence!
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]`

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
