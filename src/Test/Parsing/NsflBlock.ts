import { expect } from 'chai'
import Up = require('../../index')


describe('A line consisting solely of "NSFL:", followed by an indented block of text,', () => {
  it('produces a NSFL block node', () => {
    const markup = `
NSFL:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})


describe('The "NSFL:" line in a NSFL block', () => {
  it('is case-insensitive', () => {
    const markup = `
nSfL:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by a blank line', () => {
    const markup = `
NSFL:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('does not require a trailing colon', () => {
    const markup = `
NSFL

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by 2 blank lines', () => {
    const markup = `
NSFL:


  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by 3 or more blank lines', () => {
    const markup = `
NSFL:




  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can have whitespace after the colon', () => {
    const markup = `
NSFL:  \t  \t  

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it("can have whitespace the 'nsfl' term if there isn't a colon", () => {
    const markup = `
NSFL  \t  \t  

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})


describe('NSFL blocks', () => {
  context('can contain any outline convention, including:', () => {
    specify('Other NSFL blocks', () => {
      const markup = `
NSFL:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  NSFL:

    Luckily, Pikachu ultimately decided to stay.`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.NsflBlock([
            new Up.Paragraph([
              new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new Up.NsflBlock([
              new Up.Paragraph([
                new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })

    specify('Thematic breaks indicated by 3 or more blank lines', () => {
      const markup = `
NSFL:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  


  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.NsflBlock([
            new Up.Paragraph([
              new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new Up.ThematicBreak(),
            new Up.Paragraph([
              new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
            ])
          ])
        ]))
    })

    specify('Code blocks', () => {
      const markup = `
NSFL:

  \`\`\`
  function nthFibonacci(n: number): number {
    return (
      n <= 2
        ? n - 1 
        : nthFibonacci(n - 1) + nthFibonacci(n - 2))
  }
  \`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.NsflBlock([
            new Up.CodeBlock(
              `function nthFibonacci(n: number): number {
  return (
    n <= 2
      ? n - 1 
      : nthFibonacci(n - 1) + nthFibonacci(n - 2))
}`)
          ])
        ]))
    })
  })

  it('can be directly followed by a paragraph', () => {
    const markup = `
NSFL:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
That was my favorite episode.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ]),
        new Up.Paragraph([
          new Up.PlainText('That was my favorite episode.')
        ])
      ]))
  })

  it('are evaluated for inline conventions', () => {
    const markup = `
NSFL:

  With a *very* sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a '),
            new Up.Emphasis([
              new Up.PlainText('very')
            ]),
            new Up.PlainText(' sad song playing in the background, Ash said goodbye to Pikachu.'),
          ]),
          new Up.Paragraph([
            new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})


context('The indentation of a NSFL block can be provided by', () => {
  specify('2 spaces', () => {
    const markup = `
NSFL:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a tab', () => {
    const markup = `
NSFL:
\tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a space then a tab', () => {
    const markup = `
NSFL:
 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('2 spaces, 1 tab, or 1 space and 1 tab, all on different lines within the NSFL block', () => {
    const markup = `
NSFL:

\tWell...

 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NsflBlock([
          new Up.Paragraph([
            new Up.PlainText('Well…')
          ]),
          new Up.Paragraph([
            new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})
