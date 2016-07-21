import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('A line consisting solely of "NSFL:", followed by an indented block of text,', () => {
  it('produces a NSFL block node', () => {
    const text = `
NSFL:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsflBlockNode([
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


describe('The "NSFL" term in a NSFL block', () => {
  it('is case-insensitive', () => {
    const text = `
nSfL:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsflBlockNode([
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
NSFL:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsflBlockNode([
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
NSFL:


  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsflBlockNode([
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
NSFL:




  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsflBlockNode([
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


describe('NSFL blocks', () => {
  context('can contain any outline convention, including: ', () => {
    specify('Other NSFL blocks', () => {
      const text = `
NSFL:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  NSFL:

    Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsflBlockNode([
            new ParagraphNode([
              new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new NsflBlockNode([
              new ParagraphNode([
                new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })

    specify('Section separators indicated by 3 or more blank lines', () => {
      const text = `
NSFL:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  


  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsflBlockNode([
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
NSFL:

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
          new NsflBlockNode([
            new CodeBlockNode(
              `function nthFibonacci(n: number): number {
  return (
    n <= 2
      ? n - 1 
      : nthFibonacci(n - 1) + nthFibonacci(n - 2)
}`
            )
          ])
        ]))
    })
  })

  it('can be directly followed by a paragraph', () => {
    const text = `
NSFL:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
That was my favorite episode.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsflBlockNode([
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


context('The indentation of a NSFL block can be provided by', () => {
  specify('2 spaces', () => {
    const text = `
NSFL:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsflBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a tab', () => {
    const text = `
NSFL:
\tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsflBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a space then a tab', () => {
    const text = `
NSFL:
 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsflBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('2 spaces, 1 tab, or 1 space and 1 tab, all on different lines within the NSFL block', () => {
    const text = `
NSFL:

\tWell...

 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsflBlockNode([
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