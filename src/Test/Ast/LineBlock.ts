import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Stress } from '../../SyntaxNodes/Stress'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { Audio } from '../../SyntaxNodes/Audio'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'


describe('Consecutive non-blank lines', () => {
  it('produce a line block node containing line nodes', () => {
    const markup = `
Roses are red
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
})



describe('Lines in a line block', () => {
  it('can contain inline conventions', () => {
    const markup = `
Roses are red
Violets are **blue**
Lyrics have lines
And addresses do, too`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Violets are '),
            new Stress([
              new PlainTextNode('blue')
            ])
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
})


context('A line block can be split in two by', () => {
  specify('a single blank line', () => {
    const markup = `
1234 Spooky Street
Pepe, PA 17101
 \t 
Roses are red
Skeltals are white
If you stay here
You're in for a fright`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('1234 Spooky Street')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Pepe, PA 17101')
          ])
        ]),
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Skeltals are white')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('If you stay here')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode("You're in for a fright")
          ]),
        ])
      ]))
  })

  specify('two blank lines', () => {
    const markup = `
1234 Spooky Street
Pepe, PA 17101
 \t
  \t
Roses are red
Skeltals are white
If you stay here
You're in for a fright`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('1234 Spooky Street')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Pepe, PA 17101')
          ])
        ]),
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Skeltals are white')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('If you stay here')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode("You're in for a fright")
          ]),
        ])
      ]))
  })

  specify('an outline separator streak', () => {
    const markup = `
Roses are red
Violets are blue
#~#~#~#~#~#~#~#~#~#~#~#~#~#
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
        ]),
        new OutlineSeparatorNode(),
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ]),
      ]))
  })

  specify('a single-line blockquote', () => {
    const markup = `
1234 Spooky Street
Pepe, PA 17101
> posting your address on the internet in the current year
Roses are red
Skeltals are white
If you stay here
You're in for a fright`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('1234 Spooky Street')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Pepe, PA 17101')
          ])
        ]),
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('posting your address on the internet in the current year')
          ])
        ]),
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Skeltals are white')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('If you stay here')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode("You're in for a fright")
          ]),
        ])
      ]))
  })

  specify('a single-line ordered list', () => {
    const markup = `
1234 Spooky Street
Pepe, PA 17101
1) Never post your address unless you subsequently post poetry.
Roses are red
Skeltals are white
If you stay here
You're in for a fright`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('1234 Spooky Street')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Pepe, PA 17101')
          ])
        ]),
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Never post your address unless you subsequently post poetry.')
            ])
          ], 1)
        ]),
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Skeltals are white')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('If you stay here')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode("You're in for a fright")
          ]),
        ])
      ]))
  })

  specify('a single-line unordered list', () => {
    const markup = `
1234 Spooky Street
Pepe, PA 17101
* Never post your address unless you subsequently post poetry.
Roses are red
Skeltals are white
If you stay here
You're in for a fright`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('1234 Spooky Street')
          ]),
          new LineBlockNode.Line([
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
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Skeltals are white')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('If you stay here')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode("You're in for a fright")
          ]),
        ])
      ]))
  })

  specify('a line consisting solely of media conventions', () => {
    const markup = `
1234 Spooky Street
Pepe, PA 17101
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]
Roses are red
Skeltals are white
If you stay here
You're in for a fright`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('1234 Spooky Street')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Pepe, PA 17101')
          ])
        ]),
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Skeltals are white')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('If you stay here')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode("You're in for a fright")
          ]),
        ])
      ]))
  })

  specify('a line consisting solely of media conventions and whitespace', () => {
    const markup = `
1234 Spooky Street
Pepe, PA 17101
 [audio: ghostly howling] (http://example.com/ghosts.ogg) \t [image: haunted house] (http://example.com/hauntedhouse.svg) \t [video: ghosts eating luggage] (http://example.com/poltergeists.webm) \t 
Roses are red
Skeltals are white
If you stay here
You're in for a fright`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('1234 Spooky Street')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Pepe, PA 17101')
          ])
        ]),
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Skeltals are white')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('If you stay here')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode("You're in for a fright")
          ])
        ])
      ]))
  })
})


context('Trailing whitespace in a line block is completely inconsequential. This is true when the trailing whitespace is:', () => {
  specify('Not escaped', () => {
    const markup = `
Roses are red  \t  \t 
Violets are blue  \t  `

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

  specify('Escaped', () => {
    const markup = `
Roses are red\\ \t   
Violets are blue\\\t   `

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

  specify('Both escaped and not escaped', () => {
    const markup = `
Roses are red   \\ \t  \\  
Violets are blue\t  \\   \\\t   `

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

  specify('Both escaped and not escaped, all following a backslash itself following an escaped backslash', () => {
    const markup = `
Roses are red\\\\\\\t    \\  \\ \t  \\  
Violets are blue\\\\\\\\\\  \\   \\\t   `

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red\\')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Violets are blue\\\\')
          ]),
        ]),
      ]))
  })
})
