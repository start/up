import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Stress } from '../../SyntaxNodes/Stress'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { LineBlock } from '../../SyntaxNodes/LineBlock'


describe('Consecutive non-blank lines', () => {
  it('produce a line block node containing line nodes', () => {
    const markup = `
Roses are red
Violets are blue`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Violets are blue')
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Violets are '),
            new Stress([
              new PlainText('blue')
            ])
          ]),
          new LineBlock.Line([
            new PlainText('Lyrics have lines')
          ]),
          new LineBlock.Line([
            new PlainText('And addresses do, too')
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('1234 Spooky Street')
          ]),
          new LineBlock.Line([
            new PlainText('Pepe, PA 17101')
          ])
        ]),
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Skeltals are white')
          ]),
          new LineBlock.Line([
            new PlainText('If you stay here')
          ]),
          new LineBlock.Line([
            new PlainText("You're in for a fright")
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('1234 Spooky Street')
          ]),
          new LineBlock.Line([
            new PlainText('Pepe, PA 17101')
          ])
        ]),
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Skeltals are white')
          ]),
          new LineBlock.Line([
            new PlainText('If you stay here')
          ]),
          new LineBlock.Line([
            new PlainText("You're in for a fright")
          ]),
        ])
      ]))
  })

  specify('a thematic break streak', () => {
    const markup = `
Roses are red
Violets are blue
#~#~#~#~#~#~#~#~#~#~#~#~#~#
Lyrics have lines
And addresses do, too`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Violets are blue')
          ]),
        ]),
        new ThematicBreak(),
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Lyrics have lines')
          ]),
          new LineBlock.Line([
            new PlainText('And addresses do, too')
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('1234 Spooky Street')
          ]),
          new LineBlock.Line([
            new PlainText('Pepe, PA 17101')
          ])
        ]),
        new Blockquote([
          new Paragraph([
            new PlainText('posting your address on the internet in the current year')
          ])
        ]),
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Skeltals are white')
          ]),
          new LineBlock.Line([
            new PlainText('If you stay here')
          ]),
          new LineBlock.Line([
            new PlainText("You're in for a fright")
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('1234 Spooky Street')
          ]),
          new LineBlock.Line([
            new PlainText('Pepe, PA 17101')
          ])
        ]),
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Never post your address unless you subsequently post poetry.')
            ])
          ], { ordinal: 1 })
        ]),
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Skeltals are white')
          ]),
          new LineBlock.Line([
            new PlainText('If you stay here')
          ]),
          new LineBlock.Line([
            new PlainText("You're in for a fright")
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('1234 Spooky Street')
          ]),
          new LineBlock.Line([
            new PlainText('Pepe, PA 17101')
          ])
        ]),
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Never post your address unless you subsequently post poetry.')
            ])
          ])
        ]),
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Skeltals are white')
          ]),
          new LineBlock.Line([
            new PlainText('If you stay here')
          ]),
          new LineBlock.Line([
            new PlainText("You're in for a fright")
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('1234 Spooky Street')
          ]),
          new LineBlock.Line([
            new PlainText('Pepe, PA 17101')
          ])
        ]),
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Skeltals are white')
          ]),
          new LineBlock.Line([
            new PlainText('If you stay here')
          ]),
          new LineBlock.Line([
            new PlainText("You're in for a fright")
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('1234 Spooky Street')
          ]),
          new LineBlock.Line([
            new PlainText('Pepe, PA 17101')
          ])
        ]),
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Skeltals are white')
          ]),
          new LineBlock.Line([
            new PlainText('If you stay here')
          ]),
          new LineBlock.Line([
            new PlainText("You're in for a fright")
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Violets are blue')
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Violets are blue')
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Violets are blue')
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red\\')
          ]),
          new LineBlock.Line([
            new PlainText('Violets are blue\\\\')
          ]),
        ]),
      ]))
  })
})
