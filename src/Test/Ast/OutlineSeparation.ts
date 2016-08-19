import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { OutlineSeparator } from '../../SyntaxNodes/OutlineSeparator'


context('Between paragraphs', () => {
  specify('3 or more empty or blank lines produces an outline separator node', () => {
    const markup = `
Hello, world!
  \t \t
  \t \t

Goodbye, world!`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('Hello, world!')
        ]),
        new OutlineSeparator(),
        new Paragraph([
          new PlainText('Goodbye, world!')
        ]),
      ]))
  })

  specify('6 or more empty or blank lines produces only a single outline separator node', () => {
    const markup = `
Hello, world!

 \t

 \t


 \t
Goodbye, world!`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('Hello, world!')
        ]),
        new OutlineSeparator(),
        new Paragraph([
          new PlainText('Goodbye, world!')
        ])
      ]))
  })
})


describe('A document that starts with 3 or more empty or blank lines', () => {
  it('does not produce a leading outline separator node', () => {
    const markup = `



\t
 \t
\t
Hello, world!`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('Hello, world!')
        ])
      ]))
  })
})


describe('A document that ends with 3 or more empty or blank lines', () => {
  it('does not produce a trailing outline separator node', () => {
    const markup = `
Hello, world!



\t
 \t
\t
`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('Hello, world!')
        ])
      ]))
  })
})


describe('A line consisting solely of any combination of # = - + ~ * ^ @ : _', () => {
  it('produces an outline separator node', () => {
    const markup = '#=-+~*^@:_+**###=~=~=~--~~~~'

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OutlineSeparator()
      ]))
  })
})


describe('An outline separator streak', () => {
  it('can be directly followed by a paragraph', () => {
    const markup = `
~-~-~-~-~
60.4%`

    expect(Up.toDocument(markup)).to.eql(
      new UpDocument([
        new OutlineSeparator(),
        new Paragraph([
          new PlainText('60.4%')
        ])
      ]))
  })

  it('can have whitespace interspersed throughout the line in any manner', () => {
    const markup = '+**###=~=~=~   --~~~~ # =   - +    ~ * ^\t @ :_'

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OutlineSeparator()
      ]))
  })

  it('can contain as few as 3 non-whitespace characters', () => {
    expect(Up.toDocument('= - ~')).to.be.eql(
      new UpDocument([
        new OutlineSeparator()
      ]))
  })

  it('can be surrounded by any number of empty or blank lines and still produce a single separator node', () => {
    const markup = `
Hello.
 \t \t



===




Goodbye.`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('Hello.')
        ]),
        new OutlineSeparator(),
        new Paragraph([
          new PlainText('Goodbye.')
        ]),
      ]))
  })
})


describe('Consecutive separator streaks', () => {
  it('produce a single outline separator node', () => {
    const markup = `
=============================================
#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#
=============================================`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OutlineSeparator()
      ]))
  })
})


context('Outline conventions are evaluated before inline conventions. Therefore, separator streaks can be comprised of characters that have special meaning inline. This includes:', () => {
  context("3 hyphens (em dash). Just like any other separator streak, '---' can be:", () => {
    specify("Alone on a line", () => {
      const markup = `
---

And that's my story.`

      expect(Up.toDocument(markup)).to.eql(
        new UpDocument([
          new OutlineSeparator(),
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
          new OutlineSeparator(),
          new Paragraph([
            new PlainText("And that's my story.")
          ])
        ]))
    })
  })


  context("A plus sign followed by a hyphen (plus-minus sign). Like any other separator streak, a streak containing '+-' can be:", () => {
    specify("Alone on a line", () => {
      const markup = `
+-+-+-+-

And that's my story.`

      expect(Up.toDocument(markup)).to.eql(
        new UpDocument([
          new OutlineSeparator(),
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
          new OutlineSeparator(),
          new Paragraph([
            new PlainText("And that's my story.")
          ])
        ]))
    })
  })
})


context('When outline separator streaks are separated from each other by only blank or empty lines, they produce only a single outline separator node. This applies when they are separated by:', () => {
  specify('1 or 2 blank or empty lines', () => {
    const markup = `
--------

########
 \t

--------`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OutlineSeparator()
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OutlineSeparator()
      ]))
  })
})
