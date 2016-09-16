import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('A typical line of text', () => {
  it('produces a paragraph node', () => {
    expect(Up.parse("I'm just a normal guy who only eats when it's raining. Also, it has to be around 70 degrees.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("I'm just a normal guy who only eats when it's raining. Also, it has to be around 70 degrees.")
      ]))
  })
})


describe('A paragraph', () => {
  it('can contain inline conventions', () => {
    expect(Up.parse("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Up.Emphasis([
          new Up.Text('everyone')
        ]),
        new Up.Text(" like that?")
      ]))
  })
})


context('Trailing whitespace in a paragraph is completely inconsequential. This is true when the trailing whitespace is:', () => {
  specify('Not escaped', () => {
    expect(Up.parse("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?  \t  \t ")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Up.Emphasis([
          new Up.Text('everyone')
        ]),
        new Up.Text(" like that?")
      ]))
  })

  specify('Escaped', () => {
    expect(Up.parse("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?\\ \t  ")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Up.Emphasis([
          new Up.Text('everyone')
        ]),
        new Up.Text(" like that?")
      ]))
  })

  specify('Both escaped and not escaped', () => {
    expect(Up.parse("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that? \t \\ \\\t  \t ")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Up.Emphasis([
          new Up.Text('everyone')
        ]),
        new Up.Text(" like that?")
      ]))
  })

  specify('Both escaped and not escaped, all following a backslash itself following an escaped backslash', () => {
    expect(Up.parse("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?\\\\\\  \t \\ \\\t  \t ")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Up.Emphasis([
          new Up.Text('everyone')
        ]),
        new Up.Text(" like that?\\")
      ]))
  })
})


context('Between paragraphs, 1 or 2 empty or blank lines provide separation without producing any syntax nodes of their own. This includes:', () => {
  specify('1 empty line', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.

Pokemon Sun is a truck.`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text('Pokemon Moon has a Mew under a truck.')]),
        new Up.Paragraph([new Up.Text('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('2 empty lines', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.


Pokemon Sun is a truck.`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text('Pokemon Moon has a Mew under a truck.')]),
        new Up.Paragraph([new Up.Text('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('1 blank line', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.
 \t \t 
Pokemon Sun is a truck.`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text('Pokemon Moon has a Mew under a truck.')]),
        new Up.Paragraph([new Up.Text('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('2 blank lines', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.
  \t \t 
\t \t 
Pokemon Sun is a truck.`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text('Pokemon Moon has a Mew under a truck.')]),
        new Up.Paragraph([new Up.Text('Pokemon Sun is a truck.')]),
      ]))
  })
})


describe('A paragraph directly followed by a line consisting solely of media conventions', () => {
  it('produces a paragraph node', () => {
    const markup = `
You'll never believe this fake evidence!
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("You'll never believe this fake evidence!")
        ]),
        new Up.Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A paragraph directly following a line consisting solely of media conventions', () => {
  it('produces a paragraph node', () => {
    const markup = `
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]
You'll never believe this fake evidence!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new Up.Paragraph([
          new Up.Text("You'll never believe this fake evidence!")
        ])
      ]))
  })
})


describe('A paragraph directly sandwiched by lines consisting solely of media conventions', () => {
  it('produces a paragraph node', () => {
    const markup = `
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]
You'll never believe this fake evidence!
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new Up.Paragraph([
          new Up.Text("You'll never believe this fake evidence!")
        ]),
        new Up.Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})
