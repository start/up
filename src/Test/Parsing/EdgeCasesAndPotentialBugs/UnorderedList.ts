import { expect } from 'chai'
import Up = require('../../../index')


describe('An unordered list with a single item', () => {
  it('can be sandwched by identical thematic break streaks without producing a heading', () => {
    const markup = `
-----------
* Mittens
-----------`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.ThematicBreak(),
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Mittens')
            ])
          ])
        ]),
        new Up.ThematicBreak()
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.PlainText('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.PlainText('Violets are blue')
          ])
        ]),
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Kansas')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Nebraska')
            ])
          ])
        ]),
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.PlainText('Lyrics have lines')
          ]),
          new Up.LineBlock.Line([
            new Up.PlainText('And addresses do, too')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Iowa')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('New Hampshire')
            ])
          ])
        ]),
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Clinton')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Sanders')
            ])
          ])
        ])
      ]))
  })
})


describe('An unordered list followed by 3 blank lines followed by another unordered list', () => {
  it('produce an unordered list, a thematic break, and another unordered list', () => {
    const markup = `
- Iowa
- New Hampshire



- Clinton
- Sanders`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Iowa')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('New Hampshire')
            ])
          ])
        ]),
        new Up.ThematicBreak(),
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Clinton')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Sanders')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.CodeBlock('const x = 0')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.CodeBlock('const x = 0\n\n\n\nconst y = 0')
          ])
        ])
      ]))
  })
})
