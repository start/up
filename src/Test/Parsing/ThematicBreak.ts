import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'


context('Between paragraphs', () => {
  specify('3 or more empty or blank lines produces a thematic break node', () => {
    const markup = `
Hello, world!
  \t \t
  \t \t

Goodbye, world!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Hello, world!')
        ]),
        new ThematicBreak(),
        new Paragraph([
          new PlainText('Goodbye, world!')
        ]),
      ]))
  })

  specify('6 or more empty or blank lines produces only a single thematic break node', () => {
    const markup = `
Hello, world!

 \t

 \t


 \t
Goodbye, world!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Hello, world!')
        ]),
        new ThematicBreak(),
        new Paragraph([
          new PlainText('Goodbye, world!')
        ])
      ]))
  })
})


describe('A document that starts with 3 or more empty or blank lines', () => {
  it('does not produce a leading thematic break node', () => {
    const markup = `



\t
 \t
\t
Hello, world!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Hello, world!')
        ])
      ]))
  })
})


describe('A document that ends with 3 or more empty or blank lines', () => {
  it('does not produce a trailing thematic break node', () => {
    const markup = `
Hello, world!



\t
 \t
\t
`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Hello, world!')
        ])
      ]))
  })
})


describe('A line consisting solely of any combination of # = - + ~ * ^ @ : _', () => {
  it('produces a thematic break node', () => {
    const markup = '#=-+~*@:+**###=~=~=~--~~~~'

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new ThematicBreak()
      ]))
  })
})


describe('A thematic break streak', () => {
  it('can be directly followed by a paragraph', () => {
    const markup = `
~-~-~-~-~
60.4%`

    expect(Up.toDocument(markup)).to.eql(
      new UpDocument([
        new ThematicBreak(),
        new Paragraph([
          new PlainText('60.4%')
        ])
      ]))
  })

  it('can be as short as 3 characters', () => {
    expect(Up.toDocument('=-~')).to.deep.equal(
      new UpDocument([
        new ThematicBreak()
      ]))
  })

  it('can be surrounded by any number of empty or blank lines and still produce a single thematic break node', () => {
    const markup = `
Hello.
 \t \t



===




Goodbye.`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Hello.')
        ]),
        new ThematicBreak(),
        new Paragraph([
          new PlainText('Goodbye.')
        ]),
      ]))
  })
})


describe('Consecutive thematic break streaks', () => {
  it('produce a single thematic break node', () => {
    const markup = `
=============================================
#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#
=============================================`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new ThematicBreak()
      ]))
  })
})


context('Outline conventions are evaluated before inline conventions. Therefore, thematic break streaks can be comprised of characters that have special meaning inline. This includes:', () => {
  context("3 hyphens (em dash). Just like any other thematic break streak, '---' can be:", () => {
    specify("Alone on a line", () => {
      const markup = `
---

And that's my story.`

      expect(Up.toDocument(markup)).to.eql(
        new UpDocument([
          new ThematicBreak(),
          new Paragraph([
            new PlainText("And that's my story.")
          ])
        ]))
    })

    specify("Alone on a line but surrounded by whitespace", () => {
      const markup = `
  \t --- \t

And that's my story.`

      expect(Up.toDocument(markup)).to.eql(
        new UpDocument([
          new ThematicBreak(),
          new Paragraph([
            new PlainText("And that's my story.")
          ])
        ]))
    })
  })


  context("A plus sign followed by a hyphen (plus-minus sign). Like any other thematic break streak, a streak containing '+-' can be:", () => {
    specify("Alone on a line", () => {
      const markup = `
+-+-+-+-

And that's my story.`

      expect(Up.toDocument(markup)).to.eql(
        new UpDocument([
          new ThematicBreak(),
          new Paragraph([
            new PlainText("And that's my story.")
          ])
        ]))
    })

    specify("Alone on a line but surrounded by whitespace", () => {
      const markup = `
  \t +-+-+-+- \t

And that's my story.`

      expect(Up.toDocument(markup)).to.eql(
        new UpDocument([
          new ThematicBreak(),
          new Paragraph([
            new PlainText("And that's my story.")
          ])
        ]))
    })
  })
})


context('When thematic break streaks are separated from each other by only blank or empty lines, they produce only a single thematic break node. This applies when they are separated by:', () => {
  specify('1 or 2 blank or empty lines', () => {
    const markup = `
--------

########
 \t

--------`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new ThematicBreak()
      ]))
  })

  specify('3 or more blank or empty lines', () => {
    const markup = `
--------

  \t
 \t
  \t
########
 



--------`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new ThematicBreak()
      ]))
  })
})
