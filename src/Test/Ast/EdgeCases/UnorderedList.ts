import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { CodeBlockNode } from '../../../SyntaxNodes/CodeBlockNode'


describe('An unordered list with a single item', () => {
  it('can be sandwched by identical section separator streaks without producing a heading', () => {
    const text = `
-----------
* Mittens
-----------`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Mittens')
            ])
          ])
        ]),
        new SectionSeparatorNode()
      ]))
  })
})


describe('An unordered list', () => {
  it('can be sandwched by line blocks', () => {
    const text = `
Roses are red
Violets are blue
- Kansas
- Nebraska
Lyrics have lines
And addresses do, too`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Roses are red')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Violets are blue')
          ])
        ]),
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Kansas')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Nebraska')
            ])
          ])
        ]),
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('And addresses do, too')
          ])
        ])
      ]))
  })
})

describe('An unordered list followed by 2 blank lines followed by another unordered list', () => {
  it('produce 2 separate unordered lists', () => {
    const text = `
- Iowa
- New Hampshire


- Clinton
- Sanders`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Iowa')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('New Hampshire')
            ])
          ])
        ]),
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Clinton')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Sanders')
            ])
          ])
        ])
      ]))
  })
})


describe('An unordered list followed by 3 blank lines followed by another unordered list', () => {
  it('produce an unordered list, a section separator, and another unordered list', () => {
    const text = `
- Iowa
- New Hampshire



- Clinton
- Sanders`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Iowa')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('New Hampshire')
            ])
          ])
        ]),
        new SectionSeparatorNode(),
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Clinton')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Sanders')
            ])
          ])
        ])
      ]))
  })
})


describe('A code block in a list item', () => {
  it('produces a code block node with unindented content', () => {
    const text = `
* \`\`\`
  const x = 0
  \`\`\``

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new CodeBlockNode('const x = 0')
          ])
        ])
      ]))
  })

  it('can have 3 consecutive blank lines', () => {
    const text = `
* \`\`\`
  const x = 0



  const y = 0
  \`\`\``

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new CodeBlockNode('const x = 0\n\n\n\nconst y = 0')
          ])
        ])
      ]))
  })
})
