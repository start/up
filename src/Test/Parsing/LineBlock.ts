import { expect } from 'chai'
import * as Up from '../../Main'


describe('Consecutive non-blank lines', () => {
  it('produce a line block node containing line nodes', () => {
    const markup = `
Roses are red
Violets are blue`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Violets are blue')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Violets are '),
            new Up.Stress([
              new Up.Text('blue')
            ])
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Lyrics have lines')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('And addresses do, too')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('1234 Spooky Street')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Pepe, PA 17101')
          ])
        ]),
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Skeltals are white')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('If you stay here')
          ]),
          new Up.LineBlock.Line([
            new Up.Text("You're in for a fright")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('1234 Spooky Street')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Pepe, PA 17101')
          ])
        ]),
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Skeltals are white')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('If you stay here')
          ]),
          new Up.LineBlock.Line([
            new Up.Text("You're in for a fright")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Violets are blue')
          ]),
        ]),
        new Up.ThematicBreak(),
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Lyrics have lines')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('And addresses do, too')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('1234 Spooky Street')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Pepe, PA 17101')
          ])
        ]),
        new Up.Blockquote([
          new Up.Paragraph([
            new Up.Text('posting your address on the internet in the current year')
          ])
        ]),
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Skeltals are white')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('If you stay here')
          ]),
          new Up.LineBlock.Line([
            new Up.Text("You're in for a fright")
          ]),
        ])
      ]))
  })

  specify('a single-line numbered list', () => {
    const markup = `
1234 Spooky Street
Pepe, PA 17101
1) Never post your address unless you subsequently post poetry.
Roses are red
Skeltals are white
If you stay here
You're in for a fright`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('1234 Spooky Street')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Pepe, PA 17101')
          ])
        ]),
        new Up.NumberedList([
          new Up.NumberedList.Item([
            new Up.Paragraph([
              new Up.Text('Never post your address unless you subsequently post poetry.')
            ])
          ], { ordinal: 1 })
        ]),
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Skeltals are white')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('If you stay here')
          ]),
          new Up.LineBlock.Line([
            new Up.Text("You're in for a fright")
          ]),
        ])
      ]))
  })

  specify('a single-line bulleted list', () => {
    const markup = `
1234 Spooky Street
Pepe, PA 17101
* Never post your address unless you subsequently post poetry.
Roses are red
Skeltals are white
If you stay here
You're in for a fright`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('1234 Spooky Street')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Pepe, PA 17101')
          ])
        ]),
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Never post your address unless you subsequently post poetry.')
            ])
          ])
        ]),
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Skeltals are white')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('If you stay here')
          ]),
          new Up.LineBlock.Line([
            new Up.Text("You're in for a fright")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('1234 Spooky Street')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Pepe, PA 17101')
          ])
        ]),
        new Up.Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Skeltals are white')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('If you stay here')
          ]),
          new Up.LineBlock.Line([
            new Up.Text("You're in for a fright")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('1234 Spooky Street')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Pepe, PA 17101')
          ])
        ]),
        new Up.Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Skeltals are white')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('If you stay here')
          ]),
          new Up.LineBlock.Line([
            new Up.Text("You're in for a fright")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Violets are blue')
          ]),
        ]),
      ]))
  })

  specify('Escaped', () => {
    const markup = `
Roses are red\\ \t   
Violets are blue\\\t   `

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Violets are blue')
          ]),
        ]),
      ]))
  })

  specify('Both escaped and not escaped', () => {
    const markup = `
Roses are red   \\ \t  \\  
Violets are blue\t  \\   \\\t   `

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Violets are blue')
          ]),
        ]),
      ]))
  })

  specify('Both escaped and not escaped, all following a backslash itself following an escaped backslash', () => {
    const markup = `
Roses are red\\\\\\\t    \\  \\ \t  \\  
Violets are blue\\\\\\\\\\  \\   \\\t   `

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red\\')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Violets are blue\\\\')
          ]),
        ]),
      ]))
  })
})
