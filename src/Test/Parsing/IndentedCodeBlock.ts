import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { CodeBlock } from '../../SyntaxNodes/CodeBlock'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { Blockquote } from '../../SyntaxNodes/Blockquote'


context('A code block preserves all indentation when it is', () => {
  specify('a top-level convention', () => {
    const markup = `
\`\`\`
  if (x < 0) {
\t\treturn false
  }
\`\`\``

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new CodeBlock(
          `  if (x < 0) {
\t\treturn false
  }`),
      ]))
  })


  context('within a spoiler block', () => {
    specify('using 2 spaces for indentation', () => {
      const markup = `
SPOILER:
  \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new SpoilerBlock([
            new CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`),
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new SpoilerBlock([
            new CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`),
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new SpoilerBlock([
            new CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })
  })


  context('within a NSFW block', () => {
    specify('using 2 spaces for indentation', () => {
      const markup = `
NSFW:
  \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new NsfwBlock([
            new CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const markup = `
NSFW:
\t\`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new NsfwBlock([
            new CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const markup = `
NSFW:
 \t\`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new NsfwBlock([
            new CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })
  })


  context('within a NSFL block', () => {
    specify('using 2 spaces for indentation', () => {
      const markup = `
NSFL:
  \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new NsflBlock([
            new CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const markup = `
NSFL:
\t\`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new NsflBlock([
            new CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const markup = `
NSFL:
 \t\`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new NsflBlock([
            new CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })
  })


  context('within an ordered list item', () => {
    specify('using 2 spaces for indentation', () => {
      const markup = `
# \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new OrderedList([
            new OrderedList.Item([
              new CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`),
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new OrderedList([
            new OrderedList.Item([
              new CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`),
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new OrderedList([
            new OrderedList.Item([
              new CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`),
            ])
          ])
        ]))
    })
  })


  context('within an unordered list item', () => {
    specify('using 2 spaces for indentation', () => {
      const markup = `
* \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new UnorderedList([
            new UnorderedList.Item([
              new CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`),
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new UnorderedList([
            new UnorderedList.Item([
              new CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`),
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new UnorderedList([
            new UnorderedList.Item([
              new CodeBlock(
                `  if (x < 0) {
\t\treturn false
  }`),
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new DescriptionList([
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([
                new PlainText('Lesson 1')
              ])
            ],
              new DescriptionList.Item.Description([
                new CodeBlock(
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new DescriptionList([
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([
                new PlainText('Lesson 1')
              ])
            ],
              new DescriptionList.Item.Description([
                new CodeBlock(
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new DescriptionList([
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([
                new PlainText('Lesson 1')
              ])
            ],
              new DescriptionList.Item.Description([
                new CodeBlock(
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Blockquote([
            new CodeBlock(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })
  })
})


context('When a code block is nested within a blockquote that has no spaces after each delimiter', () => {
  specify("tabbed indentation within the code block is preseved", () => {
    const markup = `
>\`\`\`
>\tif (x < 0) {
>\t\treturn false
>\t}
>\`\`\``

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Blockquote([
          new CodeBlock(
            `\tif (x < 0) {
\t\treturn false
\t}`),
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Blockquote([
          new CodeBlock(
            `if (x < 0) {
 return false
}`),
        ])
      ]))
  })
})
