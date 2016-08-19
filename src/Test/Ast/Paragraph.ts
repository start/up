import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'


describe('A typical line of text', () => {
  it('produces a paragraph node', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Also, it has to be around 70 degrees.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I'm just a normal guy who only eats when it's raining. Also, it has to be around 70 degrees.")
      ]))
  })
})


describe('A paragraph', () => {
  it('can contain inline conventions', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Emphasis([
          new PlainTextNode('everyone')
        ]),
        new PlainTextNode(" like that?")
      ]))
  })
})


context('Trailing whitespace in a paragraph is completely inconsequential. This is true when the trailing whitespace is:', () => {
  specify('Not escaped', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?  \t  \t ")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Emphasis([
          new PlainTextNode('everyone')
        ]),
        new PlainTextNode(" like that?")
      ]))
  })

  specify('Escaped', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?\\ \t  ")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Emphasis([
          new PlainTextNode('everyone')
        ]),
        new PlainTextNode(" like that?")
      ]))
  })

  specify('Both escaped and not escaped', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that? \t \\ \\\t  \t ")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Emphasis([
          new PlainTextNode('everyone')
        ]),
        new PlainTextNode(" like that?")
      ]))
  })

  specify('Both escaped and not escaped, all following a backslash itself following an escaped backslash', () => {
    expect(Up.toDocument("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?\\\\\\  \t \\ \\\t  \t ")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I'm just a normal guy who only eats when it's raining. Isn't "),
        new Emphasis([
          new PlainTextNode('everyone')
        ]),
        new PlainTextNode(" like that?\\")
      ]))
  })
})


context('Between paragraphs, 1 or 2 empty or blank lines provide separation without producing any syntax nodes of their own. This includes:', () => {
  specify('1 empty line', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.

Pokemon Sun is a truck.`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('2 empty lines', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.


Pokemon Sun is a truck.`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('1 blank line', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.
 \t \t 
Pokemon Sun is a truck.`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('2 blank lines', () => {
    const markup = `
Pokemon Moon has a Mew under a truck.
  \t \t 
\t \t 
Pokemon Sun is a truck.`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })
})


describe('A paragraph directly followed by a line consisting solely of media conventions', () => {
  it('produces a paragraph node', () => {
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


describe('A paragraph directly following a line consisting solely of media conventions', () => {
  it('produces a paragraph node', () => {
    const markup = `
[audio: ghostly howling][http://example.com/ghosts.ogg][image: haunted house][http://example.com/hauntedhouse.svg][video: ghosts eating luggage][http://example.com/poltergeists.webm]
You'll never believe this fake evidence!`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm'),
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ]),
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg'),
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ]))
  })
})