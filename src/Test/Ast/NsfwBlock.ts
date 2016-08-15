import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('A line consisting solely of "NSFW:", followed by an indented block of text,', () => {
  it('produces a NSFW block node', () => {
    const markup = `
NSFW:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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


describe('The "NSFW:" line in a NSFW block', () => {
  it('is case-insensitive', () => {
    const markup = `
nSFw:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
    const markup = `
NSFW:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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

  it('does not require trailing colon', () => {
    const markup = `
NSFW:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
    const markup = `
NSFW:


  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
    const markup = `
NSFW:




  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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

  it('can have whitespace after the colon', () => {
    const markup = `
NSFW:  \t  \t  

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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

  it("can have whitespace the 'nsfw' term if there isn't a colon", () => {
    const markup = `
NSFW  \t  \t  

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
  context('can contain any outline convention, including:', () => {
    specify('Other NSFW blocks', () => {
      const markup = `
NSFW:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  NSFW:

    Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
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

    specify('Outline separators indicated by 3 or more blank lines', () => {
      const markup = `
NSFW:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  


  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new NsfwBlockNode([
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
NSFW:

  \`\`\`
  function nthFibonacci(n: number): number {
    return (
      n <= 2
        ? n - 1 
        : nthFibonacci(n - 1) + nthFibonacci(n - 2))
  }
  \`\`\``

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
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
    const markup = `
NSFW:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.
That was my favorite episode.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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

  it('are evaluated for inline conventions', () => {
    const markup = `
NSFW:

  With a *very* sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new NsfwBlockNode([
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


context('The indentation of a NSFW block can be provided by', () => {
  specify('2 spaces', () => {
    const markup = `
NSFW:
  With a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new NsfwBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a tab', () => {
    const markup = `
NSFW:
\tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new NsfwBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('a space then a tab', () => {
    const markup = `
NSFW:
 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new NsfwBlockNode([
          new ParagraphNode([
            new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
          ])
        ])
      ]))
  })

  specify('2 spaces, 1 tab, or 1 space and 1 tab, all on different lines within the NSFW block', () => {
    const markup = `
NSFW:

\tWell...

 \tWith a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
