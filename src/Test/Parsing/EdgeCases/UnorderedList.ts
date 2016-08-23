import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { UnorderedList } from '../../../SyntaxNodes/UnorderedList'
import { ThematicBreak } from '../../../SyntaxNodes/ThematicBreak'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'
import { CodeBlock } from '../../../SyntaxNodes/CodeBlock'


describe('An unordered list with a single item', () => {
  it('can be sandwched by identical outline separator streaks without producing a heading', () => {
    const markup = `
-----------
* Mittens
-----------`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ThematicBreak(),
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Mittens')
            ])
          ])
        ]),
        new ThematicBreak()
      ]))
  })
})


describe('An unordered list', () => {
  it('can be sandwched by line blocks', () => {
    const markup = `
Roses are red
Violets are blue
- Kansas
- Nebraska
Lyrics have lines
And addresses do, too`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Violets are blue')
          ])
        ]),
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Kansas')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Nebraska')
            ])
          ])
        ]),
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Lyrics have lines')
          ]),
          new LineBlock.Line([
            new PlainText('And addresses do, too')
          ])
        ])
      ]))
  })
})

describe('An unordered list followed by 2 blank lines followed by another unordered list', () => {
  it('produce 2 separate unordered lists', () => {
    const markup = `
- Iowa
- New Hampshire


- Clinton
- Sanders`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Iowa')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('New Hampshire')
            ])
          ])
        ]),
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Clinton')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Sanders')
            ])
          ])
        ])
      ]))
  })
})


describe('An unordered list followed by 3 blank lines followed by another unordered list', () => {
  it('produce an unordered list, an outline separator, and another unordered list', () => {
    const markup = `
- Iowa
- New Hampshire



- Clinton
- Sanders`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Iowa')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('New Hampshire')
            ])
          ])
        ]),
        new ThematicBreak(),
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Clinton')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Sanders')
            ])
          ])
        ])
      ]))
  })
})


describe('A code block in a list item', () => {
  it('produces a code block node with unindented content', () => {
    const markup = `
* \`\`\`
  const x = 0
  \`\`\``

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new CodeBlock('const x = 0')
          ])
        ])
      ]))
  })

  it('can have 3 consecutive blank lines', () => {
    const markup = `
* \`\`\`
  const x = 0



  const y = 0
  \`\`\``

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new CodeBlock('const x = 0\n\n\n\nconst y = 0')
          ])
        ])
      ]))
  })
})
