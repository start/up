import { expect } from 'chai'
import * as Up from '../../../Main'


describe('An unordered list with a single item', () => {
  it('can be sandwched by identical thematic break streaks without producing a heading', () => {
    const markup = `
-----------
* Mittens
-----------`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.ThematicBreak(),
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Mittens')
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
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Violets are blue')
          ])
        ]),
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Kansas')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Nebraska')
            ])
          ])
        ]),
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Lyrics have lines')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('And addresses do, too')
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
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Iowa')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('New Hampshire')
            ])
          ])
        ]),
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Clinton')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Sanders')
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
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Iowa')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('New Hampshire')
            ])
          ])
        ]),
        new Up.ThematicBreak(),
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Clinton')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Sanders')
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
        new Up.BulletedList([
          new Up.BulletedList.Item([
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
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.CodeBlock('const x = 0\n\n\n\nconst y = 0')
          ])
        ])
      ]))
  })
})
