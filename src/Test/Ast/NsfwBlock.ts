import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('A line consisting solely of "NSFW:", followed by an indented block of text,', () => {
  it('produces a NSFW block node', () => {
    const text = `
NSFW:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsfwBlockNode([
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


describe('The "NSFW" term in a NSFW block', () => {
  it('is case-insensitive', () => {
    const text = `
nSFw:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsfwBlockNode([
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
NSFW:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsfwBlockNode([
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
NSFW:


  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsfwBlockNode([
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
NSFW:




  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsfwBlockNode([
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


describe('NSFW blocks', () => {
  context('can contain any outline convention, including: ', () => {
    specify('Other NSFW blocks', () => {
      const text = `
NSFW:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  NSFW:

    Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsfwBlockNode([
            new ParagraphNode([
              new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new NsfwBlockNode([
              new ParagraphNode([
                new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })

    specify('Section separators indicated by 3 or more blank lines', () => {
      const text = `
NSFW:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  


  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsfwBlockNode([
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
NSFW:

  \`\`\`
  function nthFibonacci(n: number): number {
    return (
      n <= 2
        ? n - 1 
        : nthFibonacci(n - 1) + nthFibonacci(n - 2))
  }
  \`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsfwBlockNode([
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
    const text = `
NSFW:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
That was my favorite episode.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsfwBlockNode([
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


context('The indentation of a NSFW block can be provided by', () => {
  specify('2 spaces', () => {
    const text = `
NSFW:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsfwBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a tab', () => {
    const text = `
NSFW:
\tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsfwBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a space then a tab', () => {
    const text = `
NSFW:
 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsfwBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('2 spaces, 1 tab, or 1 space and 1 tab, all on different lines within the NSFW block', () => {
    const text = `
NSFW:

\tWell...

 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsfwBlockNode([
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