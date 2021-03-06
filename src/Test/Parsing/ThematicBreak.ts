import { expect } from 'chai'
import * as Up from '../../Main'


context('Between paragraphs', () => {
  specify('3 or more empty or blank lines produces a thematic break node', () => {
    const markup = `
Hello, world!
  \t \t
  \t \t

Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Hello, world!')
        ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text('Goodbye, world!')
        ])
      ]))
  })

  specify('6 or more empty or blank lines produces only a single thematic break node', () => {
    const markup = `
Nexcare

 \t

 \t


 \t
Nexcare!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Nexcare')
        ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text('Nexcare!')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Hello, world!')
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
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Hello, world!')
        ])
      ]))
  })
})


describe('A line consisting solely of any combination of # = - + ~ * ^ @ : _', () => {
  it('produces a thematic break node', () => {
    const markup = '#=-+~*@:+**###=~=~=~--~~~~'

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.ThematicBreak()
      ]))
  })
})


describe('A thematic break streak', () => {
  it('can be directly followed by a paragraph', () => {
    const markup = `
~-~-~-~-~
60.4%`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text('60.4%')
        ])
      ]))
  })

  it('can be as short as 3 characters', () => {
    expect(Up.parse('=-~')).to.deep.equal(
      new Up.Document([
        new Up.ThematicBreak()
      ]))
  })

  it('can be surrounded by any number of empty or blank lines and still produce a single thematic break node', () => {
    const markup = `
Hello.
 \t \t



===




Goodbye.`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Hello.')
        ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text('Goodbye.')
        ])
      ]))
  })
})


describe('Consecutive thematic break streaks', () => {
  it('produce a single thematic break node', () => {
    const markup = `
=============================================
#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#
=============================================`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.ThematicBreak()
      ]))
  })
})


context('Outline conventions are evaluated before inline conventions. Therefore, thematic break streaks can be comprised of characters that have special role inline. This includes:', () => {
  context("3 hyphens (em dash). Just like any other thematic break streak, '---' can be:", () => {
    specify('Alone on a line', () => {
      const markup = `
---

And that's my story.`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.ThematicBreak(),
          new Up.Paragraph([
            new Up.Text("And that's my story.")
          ])
        ]))
    })

    specify('Alone on a line but surrounded by whitespace', () => {
      const markup = `
  \t --- \t

And that's my story.`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.ThematicBreak(),
          new Up.Paragraph([
            new Up.Text("And that's my story.")
          ])
        ]))
    })
  })


  context("A plus sign followed by a hyphen (plus-minus sign). Like any other thematic break streak, a streak containing '+-' can be:", () => {
    specify('Alone on a line', () => {
      const markup = `
+-+-+-+-

And that's my story.`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.ThematicBreak(),
          new Up.Paragraph([
            new Up.Text("And that's my story.")
          ])
        ]))
    })

    specify('Alone on a line but surrounded by whitespace', () => {
      const markup = `
  \t +-+-+-+- \t

And that's my story.`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.ThematicBreak(),
          new Up.Paragraph([
            new Up.Text("And that's my story.")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.ThematicBreak()
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.ThematicBreak()
      ]))
  })
})
