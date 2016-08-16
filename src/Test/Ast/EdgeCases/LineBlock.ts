import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'


describe('A line starting with an escaped character in a line block', () => {
  it('does not impact the parsing of the next line', () => {
    const markup = `
\\Roses are red
Violets are blue`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })

  it('does not impact the parsing of the previous line', () => {
    const markup = `
Roses are red
\\Violets are blue`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
})


describe('A line block', () => [
  it('can contain an escaped outline separator streak', () => {
    const markup = `
Roses are red
Violets are blue
\\#~#~#~#~#~#~#~#~#
Lyrics have lines
And addresses do, too`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Violets are blue')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('#~#~#~#~#~#~#~#~#')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ]),
      ]))
  })
])


describe('Within a line block, a line ending with a backslash', () => {
  it('has no impact on the following line', () => {
    const markup = `
Roses are red
Violets are blue\\
Lyrics have lines
And addresses do, too`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red'),
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Violets are blue'),
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ])
      ]))
  })
})


describe('A paragraph directly followed by a line consisting solely of media conventions', () => {
  it('does not produce a line block node', () => {
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


context('No line block is produced when two paragraphs are separated:', () => {
    specify('A line starting with backslash and otherwise consisting solely of whitespace', () => {
    const markup =
      `
I drink milk.
\\ \t
My favorite kind is 2%.`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('I drink milk.')
        ]),
        new ParagraphNode([
          new PlainTextNode('My favorite kind is 2%.')
        ]),
      ]))
  })

  specify('A line starting with a space and followed by escaped whitespace', () => {
    const markup =
      `
I drink milk.
 \\   \\  \\\t  \t   
My favorite kind is 2%.`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('I drink milk.')
        ]),
        new ParagraphNode([
          new PlainTextNode('My favorite kind is 2%.')
        ]),
      ]))
  })
})
