import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'


describe('A line starting with an escaped character in a line block', () => {
  it('does not impact the parsing of the next line', () => {
    const markup = `
\\Roses are red
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

  it('does not impact the parsing of the previous line', () => {
    const markup = `
Roses are red
\\Violets are blue`
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


describe('A line block', () => [
  it('can contain an escaped thematic break streak', () => {
    const markup = `
Roses are red
Violets are blue
\\#~#~#~#~#~#~#~#~#
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
          new LineBlock.Line([
            new PlainText('#~#~#~#~#~#~#~#~#')
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red'),
          ]),
          new LineBlock.Line([
            new PlainText('Violets are blue'),
          ]),
          new LineBlock.Line([
            new PlainText('Lyrics have lines')
          ]),
          new LineBlock.Line([
            new PlainText('And addresses do, too')
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red'),
          ]),
          new LineBlock.Line([
            new PlainText('Violets are blue'),
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red'),
          ]),
          new LineBlock.Line([
            new PlainText('Violets are blue'),
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
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Skeltals are white')
          ])
        ])
      ]))
  })
})
