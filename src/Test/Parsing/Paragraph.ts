import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'


describe('A typical line of text', () => {
  it('produces a paragraph node', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Also, it has to be around 70 degrees.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("I'm just a normal guy who only eats when it's raining. Also, it has to be around 70 degrees.")
      ]))
  })
})


describe('A paragraph', () => {
  it('can contain inline conventions', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Emphasis([
          new PlainText('everyone')
        ]),
        new PlainText(" like that?")
      ]))
  })
})


context('Trailing whitespace in a paragraph is completely inconsequential. This is true when the trailing whitespace is:', () => {
  specify('Not escaped', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?  \t  \t ")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Emphasis([
          new PlainText('everyone')
        ]),
        new PlainText(" like that?")
      ]))
  })

  specify('Escaped', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?\\ \t  ")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Emphasis([
          new PlainText('everyone')
        ]),
        new PlainText(" like that?")
      ]))
  })

  specify('Both escaped and not escaped', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that? \t \\ \\\t  \t ")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Emphasis([
          new PlainText('everyone')
        ]),
        new PlainText(" like that?")
      ]))
  })

  specify('Both escaped and not escaped, all following a backslash itself following an escaped backslash', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?\\\\\\  \t \\ \\\t  \t ")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Emphasis([
          new PlainText('everyone')
        ]),
        new PlainText(" like that?\\")
      ]))
  })
})


context('Between paragraphs, 1 or 2 empty or blank lines provide separation without producing any syntax nodes of their own. This includes:', () => {
  specify('1 empty line', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.

Pokemon Sun is a truck.`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([new PlainText('Pokemon Moon has a Mew under a truck.')]),
        new Paragraph([new PlainText('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('2 empty lines', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.


Pokemon Sun is a truck.`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([new PlainText('Pokemon Moon has a Mew under a truck.')]),
        new Paragraph([new PlainText('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('1 blank line', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.
 \t \t 
Pokemon Sun is a truck.`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([new PlainText('Pokemon Moon has a Mew under a truck.')]),
        new Paragraph([new PlainText('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('2 blank lines', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.
  \t \t 
\t \t 
Pokemon Sun is a truck.`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([new PlainText('Pokemon Moon has a Mew under a truck.')]),
        new Paragraph([new PlainText('Pokemon Sun is a truck.')]),
      ]))
  })
})


describe('A paragraph directly followed by a line consisting solely of media conventions', () => {
  it('produces a paragraph node', () => {
    const markup = `
You'll never believe this fake evidence!
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("You'll never believe this fake evidence!")
        ]),
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A paragraph directly following a line consisting solely of media conventions', () => {
  it('produces a paragraph node', () => {
    const markup = `
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]
You'll never believe this fake evidence!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new Paragraph([
          new PlainText("You'll never believe this fake evidence!")
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new Paragraph([
          new PlainText("You'll never believe this fake evidence!")
        ]),
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg'),
        new Image('haunted house', 'http://example.com/hauntedhouse.svg'),
        new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})
