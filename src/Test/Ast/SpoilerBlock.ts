import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('A line consisting solely of "SPOILER:", followed by an indented block of text,', () => {
  it('produces a spoiler block node', () => {
    const markup = `
SPOILER:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})


describe('The "SPOILER:" line in a spoiler block', () => {
  it('is case-insensitive', () => {
    const markup = `
sPoiLeR:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by a blank line', () => {
    const markup = `
SPOILER:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('does require a trailing colon', () => {
    const markup = `
SPOILER

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by 2 blank lines', () => {
    const markup = `
SPOILER:


  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can be followed by 3 or more blank lines', () => {
    const markup = `
SPOILER:




  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it('can have whitespace after the colon', () => {
    const markup = `
SPOILER:  \t  \t  

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })

  it("can have whitespace the 'spoiler' term if there isn't a colon", () => {
    const markup = `
SPOILER  \t  \t  

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})


describe('Spoiler blocks', () => {
  context('can contain any outline convention, including:', () => {
    specify('Other spoiler blocks', () => {
      const markup = `
SPOILER:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  SPOILER:

    Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toAst(markup)).to.be.eql(
        new UpDocument([
          new SpoilerBlockNode([
            new ParagraphNode([
              new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new SpoilerBlockNode([
              new ParagraphNode([
                new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })

    specify('Outline separators indicated by 3 or more blank lines', () => {
      const markup = `
SPOILER:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  


  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toAst(markup)).to.be.eql(
        new UpDocument([
          new SpoilerBlockNode([
            new ParagraphNode([
              new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new OutlineSeparatorNode(),
            new ParagraphNode([
              new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
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

      expect(Up.toAst(markup)).to.be.eql(
        new UpDocument([
          new SpoilerBlockNode([
            new CodeBlockNode(
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

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ]),
        new ParagraphNode([
          new PlainTextNode('That was my favorite episode.')
        ])
      ]))
  })

  it('are evaluated for inline conventions', () => {
    const markup = `
SPOILER:

  With a *very* sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a '),
            new EmphasisNode([
              new PlainTextNode('very')
            ]),
            new PlainTextNode(' sad song playing in the background, Ash said goodbye to Pikachu.'),
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})


context('The indentation of a spoiler block can be provided by', () => {
  specify('2 spaces', () => {
    const markup = `
SPOILER:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a tab', () => {
    const markup = `
SPOILER:
\tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a space then a tab', () => {
    const markup = `
SPOILER:
 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('2 spaces, 1 tab, or 1 space and 1 tab, all on different lines within the spoiler block', () => {
    const markup = `
SPOILER:

\tWell...

 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('Well...')
          ]),
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ]),
          new ParagraphNode([
            new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
          ])
        ])
      ]))
  })
})
