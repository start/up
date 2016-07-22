import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
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
And addresses do, too`

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
            new PlainTextNode('\t\t')
          ]),
          new Line([
            new PlainTextNode('\t\t')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
})


context('A line block can be split in two by', () => {
  specify('a single blank line', () => {
    const text = `
1234 Spooky Street
Pepe, PA 17101
 \t 
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

  specify('two blank lines', () => {
    const text = `
1234 Spooky Street
Pepe, PA 17101
 \t
  \t
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

  specify('a section separator streak', () => {
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

  specify('a single-line blockquote', () => {
    const text = `
1234 Spooky Street
Pepe, PA 17101
> posting your address on the internet in the current year
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
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('posting your address on the internet in the current year')
          ])
        ]),
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

  specify('a single-line ordered list', () => {
    const text = `
1234 Spooky Street
Pepe, PA 17101
1) Never post your address unless you subsequently post poetry.
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
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Never post your address unless you subsequently post poetry.')
            ])
          ], 1)
        ]),
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

  specify('a single-line unordered list', () => {
    const text = `
1234 Spooky Street
Pepe, PA 17101
* Never post your address unless you subsequently post poetry.
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
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Never post your address unless you subsequently post poetry.')
            ])
          ])
        ]),
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

  specify('a line consisting solely of media conventions', () => {
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

  specify('a line consisting solely of media conventions and whitespace', () => {
    const text = `
1234 Spooky Street
Pepe, PA 17101
 [audio: ghostly howling] (http://example.com/ghosts.ogg) \t [image: haunted house] (http://example.com/hauntedhouse.svg) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) \t 
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
