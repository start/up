import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../SyntaxNodes/UnorderedListItem'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'


context("Indentation is important for many outline conventions. However, once the outline convention of a line has been determined, any leading whitespace is often ignored. This is true for:", () => {

  specify('Paragraphs', () => {
    expect(Up.toAst(" \t I'm just a normal guy who eats only when it's raining outside.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I'm just a normal guy who eats only when it's raining outside.")
        ])
      ]))
  })

  specify('Line blocks', () => {
    const text = `
  \t Roses are red
Skeltals are white
 \t  If you stay here
 You're in for a fright`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Skeltals are white')
          ]),
          new Line([
            new PlainTextNode('If you stay here')
          ]),
          new Line([
            new PlainTextNode("You're in for a fright")
          ]),
        ])
      ]))
  })

  specify('Headings', () => {
    const text = `
 \t Hello, world!
~~~~~~~~~~~~~~~`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  specify('Description list terms', () => {
    const text = `
 Charmander
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Charmander')])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ])
          ]))
        ])
      ])
    )
  })

  specify('Lines in the description of a description list', () => {
    const text = `
Charmander
   \t Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Charmander')])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ])
          ]))
        ])
      ])
    )
  })

  specify('Lines in an ordered list item', () => {
    expect(Up.toAst('1)  \t Hello, Lavender Town!')).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, Lavender Town!')
            ])
          ], 1)
        ])
      ])
    )
  })

  specify('Lines in an unordered list item', () => {
    expect(Up.toAst('*  \t Buy milk')).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('Buy milk')
            ])
          ])
        ])
      ])
    )
  })

  specify('Lines in a blockquote', () => {
    expect(Up.toAst(">   \t I like shorts! They're comfy and easy to wear!")).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode("I like shorts! They're comfy and easy to wear!")
          ])
        ])
      ])
    )
  })
})