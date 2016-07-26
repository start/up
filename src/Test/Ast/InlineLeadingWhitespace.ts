import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { TableNode } from '../../SyntaxNodes/TableNode'


context("Indentation is important for many outline conventions. However, once the outline convention of a line has been determined, any leading whitespace is usually ignored.", () => {
  context('This is true for:', () => {
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
            new LineBlockNode.Line([
              new PlainTextNode('Roses are red')
            ]),
            new LineBlockNode.Line([
              new PlainTextNode('Skeltals are white')
            ]),
            new LineBlockNode.Line([
              new PlainTextNode('If you stay here')
            ]),
            new LineBlockNode.Line([
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
Charmeleon
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new DescriptionListNode([
            new DescriptionListNode.Item([
              new DescriptionListNode.Item.Term([new PlainTextNode('Charmander')]),
              new DescriptionListNode.Item.Term([new PlainTextNode('Charmeleon')])
            ], new DescriptionListNode.Item.Description([
              new ParagraphNode([
                new PlainTextNode('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
              ])
            ]))
          ])
        ]))
    })
  })


  context("This rule also applies inside outline conventions that can contain other outline conventions:", () => {
    specify('Ordered list items', () => {
      const text = `
1)  \t Hello, Lavender Town!

 \t\t How are we today?`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new OrderedListNode([
            new OrderedListNode.Item([
              new ParagraphNode([
                new PlainTextNode('Hello, Lavender Town!')
              ]),
              new ParagraphNode([
                new PlainTextNode('How are we today?')
              ])
            ], 1)
          ])
        ]))
    })

    specify('Unordered list items', () => {
      const text = `
*  \t Buy milk.

 \t\t Now.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new UnorderedListNode([
            new UnorderedListNode.Item([
              new ParagraphNode([
                new PlainTextNode('Buy milk.')
              ]),
              new ParagraphNode([
                new PlainTextNode('Now.')
              ])
            ])
          ])
        ]))
    })

    specify('Descriptions in a description list', () => {
      const text = `
Charmander
   \t Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.
   
\t Does not evolve into Kadabra.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new DescriptionListNode([
            new DescriptionListNode.Item([
              new DescriptionListNode.Item.Term([new PlainTextNode('Charmander')])
            ], new DescriptionListNode.Item.Description([
              new ParagraphNode([
                new PlainTextNode('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
              ]),
              new ParagraphNode([
                new PlainTextNode('Does not evolve into Kadabra.')
              ])
            ]))
          ])
        ]))
    })

    specify('Blockquotes', () => {
      const text = `
>   \t I like shorts! They're comfy and easy to wear!
>
>\t I like blankets, too.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new BlockquoteNode([
            new ParagraphNode([
              new PlainTextNode("I like shorts! They're comfy and easy to wear!")
            ]),
            new ParagraphNode([
              new PlainTextNode("I like blankets, too.")
            ])
          ])
        ]))
    })

    specify('Spoiler blocks', () => {
      const text = `
 SPOILER:
 \t
   \t I like shorts! They're comfy and easy to wear!

\t I like blankets, too.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new SpoilerBlockNode([
            new ParagraphNode([
              new PlainTextNode("I like shorts! They're comfy and easy to wear!")
            ]),
            new ParagraphNode([
              new PlainTextNode("I like blankets, too.")
            ])
          ])
        ]))
    })

    specify('NSFW blocks', () => {
      const text = `
 NSFW:
 \t
   \t I like shorts! They're comfy and easy to wear!

\t I like blankets, too.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsfwBlockNode([
            new ParagraphNode([
              new PlainTextNode("I like shorts! They're comfy and easy to wear!")
            ]),
            new ParagraphNode([
              new PlainTextNode("I like blankets, too.")
            ])
          ])
        ]))
    })

    specify('NSFL blocks', () => {
      const text = `
  NSFL:
 \t
   \t I like shorts! They're comfy and easy to wear!

\t I like blankets, too.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsflBlockNode([
            new ParagraphNode([
              new PlainTextNode("I like shorts! They're comfy and easy to wear!")
            ]),
            new ParagraphNode([
              new PlainTextNode("I like blankets, too.")
            ])
          ])
        ]))
    })
  })

  specify('Tables', () => {
    const text = `
 Table:

 \t Game; Release Date

 \t Final Fantasy; 1987
 \t Final Fantasy II; 1988

 \t Chrono Trigger; 1995
 \t Chrono Cross; 1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
              new TableNode.Row.Cell([new PlainTextNode('1987')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy II')]),
              new TableNode.Row.Cell([new PlainTextNode('1988')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ]),
          ])
      ]))
  })
})
