import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('A line consisting solely of "spoiler:", followed by an indented block of text,', () => {
  it('produces a spoiler block node', () => {
    const text = `
SPOILER:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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


describe('The "spoiler:" line in a spoiler block', () => {
  it('is case-insensitive', () => {
    const text = `
sPoiLeR:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
SPOILER:  \t  \t  

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
SPOILER:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
SPOILER:


  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
SPOILER:




  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
  context('can contain any outline convention, including: ', () => {
    specify('Other spoiler blocks', () => {
      const text = `
SPOILER:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  SPOILER:

    Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
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

    specify('Section separators indicated by 3 or more blank lines', () => {
      const text = `
SPOILER:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  


  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new SpoilerBlockNode([
            new ParagraphNode([
              new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new SectionSeparatorNode(),
            new ParagraphNode([
              new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
            ])
          ])
        ]))
    })

    specify('Code blocks', () => {
      const text = `
SPOILER:

  \`\`\`
  function nthFibonacci(n: number): number {
    return (
      n <= 2
        ? n - 1 
        : nthFibonacci(n - 1) + nthFibonacci(n - 2)
  }
  \`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new SpoilerBlockNode([
            new CodeBlockNode(
              `function nthFibonacci(n: number): number {
  return (
    n <= 2
      ? n - 1 
      : nthFibonacci(n - 1) + nthFibonacci(n - 2)
}`)
          ])
        ]))
    })
  })

  it('can be directly followed by a paragraph', () => {
    const text = `
SPOILER:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
That was my favorite episode.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
})


context('The indentation of a spoiler block can be provided by', () => {
  specify('2 spaces', () => {
    const text = `
SPOILER:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a tab', () => {
    const text = `
SPOILER:
\tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a space then a tab', () => {
    const text = `
SPOILER:
 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('2 spaces, 1 tab, or 1 space and 1 tab, all on different lines within the spoiler block', () => {
    const text = `
SPOILER:

\tWell...

 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
