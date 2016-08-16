import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
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


context("A line consisting of escaped whitespace is not included in a line block, but it doesn't terminate it, either.", () => {
  specify('A line starting with backslash and otherwise consisting solely of whitespace', () => {
    const markup =
      `
Roses are red
\\ \t
Violets are blue`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red'),
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Violets are blue'),
          ])
        ])
      ]))
  })

  specify('A line starting with a single space (i.e. not indented) and followed by escaped whitespace', () => {
    const markup =
      `
Roses are red
 \\   \\  \\\t  \t   
Violets are blue`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red'),
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Violets are blue'),
          ])
        ])
      ]))
  })
})


describe('Within a line block, consecutive lines consisting solely of escaped whitespace', () => {
  it("are not included in the line block, but they don't terminate it, either", () => {
    const markup = `
Roses are red
 \\\t\t
 \\\t\t
Skeltals are white`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Skeltals are white')
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

  specify('Both escaped and not escaped, and following a backslash itself following an escaped backslash', () => {
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
