import { expect } from 'chai'
import * as Up from '../../index'


context('When a line consisting solely of a revealable keyword is followed by an indented block of text, it produces a revealable block. The keyword can be:', () => {
  specify('Spoiler', () => {
    const markup = `
SPOILER
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  specify('NSFW', () => {
    const markup = `
NSFW
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  specify('NSFL', () => {
    const markup = `
NSFL
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  specify('Revealable', () => {
    const markup = `
Revealable
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})


describe('The "label line" of a revealable block', () => {
  it('is case-insensitive', () => {
    const markup = `
sPoiLeR
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by a colon', () => {
    const markup = `
Revealable:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by a blank line', () => {
    const markup = `
SPOILER:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('does require a trailing colon', () => {
    const markup = `
SPOILER

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by 2 blank lines', () => {
    const markup = `
SPOILER:


  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by 3 or more blank lines', () => {
    const markup = `
SPOILER:




  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can have whitespace after the colon', () => {
    const markup = `
SPOILER:  \t  \t  

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it("can have whitespace after the revealable keyword if there isn't a colon", () => {
    const markup = `
SPOILER  \t  \t  

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})


describe('Revealable blocks', () => {
  context('can contain any outline convention, including:', () => {
    specify('Other revealable blocks', () => {
      const markup = `
SPOILER:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  SPOILER:

    Luckily, Pikachu ultimately decided to stay.`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.RevealableBlock([
            new Up.Paragraph([
              new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new Up.RevealableBlock([
              new Up.Paragraph([
                new Up.Text('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })

    specify('Thematic breaks indicated by 3 or more blank lines', () => {
      const markup = `
SPOILER:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  


  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.RevealableBlock([
            new Up.Paragraph([
              new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new Up.ThematicBreak(),
            new Up.Paragraph([
              new Up.Text('Luckily, Pikachu ultimately decided to stay.')
            ])
          ])
        ]))
    })

    specify('Code blocks', () => {
      const markup = `
SPOILER:

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
          new Up.RevealableBlock([
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
SPOILER:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
That was my favorite episode.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ]),
        new Up.Paragraph([
          new Up.Text('That was my favorite episode.')
        ])
      ]))
  })

  it('are evaluated for inline conventions', () => {
    const markup = `
SPOILER:

  With a *very* sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a '),
            new Up.Emphasis([
              new Up.Text('very')
            ]),
            new Up.Text(' sad song playing in the background, Ash said goodbye to Pikachu.'),
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})


context('The indentation of a revealable block can be provided by', () => {
  specify('2 spaces', () => {
    const markup = `
SPOILER:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a tab', () => {
    const markup = `
SPOILER:
\tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a space then a tab', () => {
    const markup = `
SPOILER:
 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('2 spaces, 1 tab, or 1 space and 1 tab, all on different lines within the revealable block', () => {
    const markup = `
SPOILER:

\tWell...

 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('Well…')
          ]),
          new Up.Paragraph([
            new Up.Text('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new Up.Paragraph([
            new Up.Text('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})
