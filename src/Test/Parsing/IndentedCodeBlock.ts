import { expect } from 'chai'
import * as Up from '../../Main'


context('A code block preserves all indentation when it is', () => {
  specify('a top-level convention', () => {
    const markup = `
\`\`\`
  if (x < 0) {
\t\treturn false
  }
\`\`\``

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.CodeBlock(
          `  if (x < 0) {
\t\treturn false
  }`)
      ]))
  })


  context('within a revealable block', () => {
    specify('using 2 spaces for indentation', () => {
      const markup = `
SPOILER:
  \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.RevealableBlock([
            new Up.CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`)
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const markup = `
SPOILER:
\t\`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.RevealableBlock([
            new Up.CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`)
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const markup = `
SPOILER:
 \t\`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.RevealableBlock([
            new Up.CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`)
          ])
        ]))
    })
  })


  context('within a numbered list item', () => {
    specify('using 2 spaces for indentation', () => {
      const markup = `
# \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.NumberedList([
            new Up.NumberedList.Item([
              new Up.CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`)
            ])
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const markup = `
# \`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.NumberedList([
            new Up.NumberedList.Item([
              new Up.CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`)
            ])
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const markup = `
# \`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.NumberedList([
            new Up.NumberedList.Item([
              new Up.CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`)
            ])
          ])
        ]))
    })
  })


  context('within a bulleted list item', () => {
    specify('using 2 spaces for indentation', () => {
      const markup = `
* \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.BulletedList([
            new Up.BulletedList.Item([
              new Up.CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`)
            ])
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const markup = `
* \`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.BulletedList([
            new Up.BulletedList.Item([
              new Up.CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`)
            ])
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const markup = `
* \`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.BulletedList([
            new Up.BulletedList.Item([
              new Up.CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`)
            ])
          ])
        ]))
    })
  })


  context("within a a description list's description", () => {
    specify('using 2 spaces for indentation', () => {
      const markup = `
Lesson 1
  \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([
                new Up.Text('Lesson 1')
              ])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.CodeBlock(
                  `  if (x < 0) {
\t\treturn false
  }`)
              ]))
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const markup = `
Lesson 1
\t\`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([
                new Up.Text('Lesson 1')
              ])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.CodeBlock(
                  `  if (x < 0) {
\t\treturn false
  }`)
              ]))
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const markup = `
Lesson 1
 \t\`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([
                new Up.Text('Lesson 1')
              ])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.CodeBlock(
                  `  if (x < 0) {
\t\treturn false
  }`)
              ]))
          ])
        ]))
    })
  })


  context('within a blockquote', () => {
    specify('with a space after each delimiter', () => {
      const markup = `
> \`\`\`
>   if (x < 0) {
> \t\treturn false
>   }
> \`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Blockquote([
            new Up.CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`)
          ])
        ]))
    })
  })
})


context('When a code block is nested within a blockquote that has no spaces after each delimiter', () => {
  specify('tabbed indentation within the code block is preserved', () => {
    const markup = `
>\`\`\`
>\tif (x < 0) {
>\t\treturn false
>\t}
>\`\`\``

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Blockquote([
          new Up.CodeBlock(
            `\tif (x < 0) {
\t\treturn false
\t}`)
        ])
      ]))
  })

  specify('a single leading space will be consumed from any lines of code with leading spaces', () => {
    const markup = `
>\`\`\`
>if (x < 0) {
>  return false
>}
>\`\`\``

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Blockquote([
          new Up.CodeBlock(
            `if (x < 0) {
 return false
}`)
        ])
      ]))
  })
})
