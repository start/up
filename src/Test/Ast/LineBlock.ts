import { expect } from 'chai'
import Up from '../../index'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'


describe('Consecutive non-blank lines', () => {
  it('produce a line block node containing line nodes', () => {
    const text = `
Roses are red
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
})



describe('Lines in a line block', () => {
  it('can contain inline conventions', () => {
    const text = `
Roses are red
Violets are **blue**
Lyrics have lines
And addresses do, too
`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are '),
            new StressNode([
              new PlainTextNode('blue')
            ])
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
  
  it('can be blank if at least one of the whitespace characters is escaped', () => {
    const text = `
Roses are red
 \\\t\t
 \\\t\t
Violets are blue`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode(' \t\t')
          ]),
          new Line([
            new PlainTextNode(' \t\t')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
})


describe('A section separator streak', () => {
  it('can separate two line blocks', () => {
    const text = `
Roses are red
Violets are blue
#~#~#~#~#~#~#~#~#~#~#~#~#~#
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
        ]),
        new SectionSeparatorNode(),
        new LineBlockNode([
          new Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ]),
      ]))
  })
})


describe('A line solely consisting solely of media conventions inserted in the middle of a line block', () => {
  it('splits the line block in two', () => {
    const text = `
1234 Spooky Street
Pepe, PA 17101
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]
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