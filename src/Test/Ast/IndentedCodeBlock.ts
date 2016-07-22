import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'


context('A code block preserves all indentation when it is', () => {
  specify('a top-level convention', () => {
    const text = `
\`\`\`
  if (x < 0) {
\t\treturn false
  }
\`\`\``

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new CodeBlockNode(
          `  if (x < 0) {
\t\treturn false
  }`),
      ]))
  })


  context('within a spoiler block', () => {
    specify('using 2 spaces for indentation', () => {
      const text = `
SPOILER:
  \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new SpoilerBlockNode([
            new CodeBlockNode(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const text = `
SPOILER:
\t\`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new SpoilerBlockNode([
            new CodeBlockNode(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const text = `
SPOILER:
 \t\`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new SpoilerBlockNode([
            new CodeBlockNode(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })
  })


  context('within a NSFW block', () => {
    specify('using 2 spaces for indentation', () => {
      const text = `
NSFW:
  \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsfwBlockNode([
            new CodeBlockNode(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const text = `
NSFW:
\t\`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsfwBlockNode([
            new CodeBlockNode(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const text = `
NSFW:
 \t\`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsfwBlockNode([
            new CodeBlockNode(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })
  })


  context('within a NSFL block', () => {
    specify('using 2 spaces for indentation', () => {
      const text = `
NSFL:
  \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsflBlockNode([
            new CodeBlockNode(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const text = `
NSFL:
\t\`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsflBlockNode([
            new CodeBlockNode(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const text = `
NSFL:
 \t\`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsflBlockNode([
            new CodeBlockNode(
              `  if (x < 0) {
\t\treturn false
  }`),
          ])
        ]))
    })
  })


  context('within an ordered list item', () => {
    specify('using 2 spaces for indentation', () => {
      const text = `
# \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new OrderedListNode([
            new OrderedListNode.Item([
              new CodeBlockNode(
                `  if (x < 0) {
\t\treturn false
  }`),
            ])
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const text = `
# \`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new OrderedListNode([
            new OrderedListNode.Item([
              new CodeBlockNode(
                `  if (x < 0) {
\t\treturn false
  }`),
            ])
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const text = `
# \`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new OrderedListNode([
            new OrderedListNode.Item([
              new CodeBlockNode(
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
      const text = `
* \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new UnorderedListNode([
            new UnorderedListNode.Item([
              new CodeBlockNode(
                `  if (x < 0) {
\t\treturn false
  }`),
            ])
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const text = `
* \`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new UnorderedListNode([
            new UnorderedListNode.Item([
              new CodeBlockNode(
                `  if (x < 0) {
\t\treturn false
  }`),
            ])
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const text = `
* \`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new UnorderedListNode([
            new UnorderedListNode.Item([
              new CodeBlockNode(
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
      const text = `
Lesson 1
  \`\`\`
    if (x < 0) {
  \t\treturn false
    }
  \`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new DescriptionListNode([
            new DescriptionListNode.Item([
              new DescriptionListNode.Item.Term([
                new PlainTextNode('Lesson 1')
              ])
            ],
              new DescriptionListNode.Item.Description([
                new CodeBlockNode(
                  `  if (x < 0) {
\t\treturn false
  }`)
              ]))
          ])
        ]))
    })

    specify('using 1 tab for indentation', () => {
      const text = `
Lesson 1
\t\`\`\`
\t  if (x < 0) {
\t\t\treturn false
\t  }
\t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new DescriptionListNode([
            new DescriptionListNode.Item([
              new DescriptionListNode.Item.Term([
                new PlainTextNode('Lesson 1')
              ])
            ],
              new DescriptionListNode.Item.Description([
                new CodeBlockNode(
                  `  if (x < 0) {
\t\treturn false
  }`)
              ]))
          ])
        ]))
    })

    specify('using 1 space and 1 tab for indentation', () => {
      const text = `
Lesson 1
 \t\`\`\`
 \t  if (x < 0) {
 \t\t\treturn false
 \t  }
 \t\`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new DescriptionListNode([
            new DescriptionListNode.Item([
              new DescriptionListNode.Item.Term([
                new PlainTextNode('Lesson 1')
              ])
            ],
              new DescriptionListNode.Item.Description([
                new CodeBlockNode(
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
      const text = `
> \`\`\`
>   if (x < 0) {
> \t\treturn false
>   }
> \`\`\``

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new BlockquoteNode([
            new CodeBlockNode(
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
    const text = `
>\`\`\`
>\tif (x < 0) {
>\t\treturn false
>\t}
>\`\`\``

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new CodeBlockNode(
            `\tif (x < 0) {
\t\treturn false
\t}`),
        ])
      ]))
  })

  specify('a single leading space will be consumed from any lines of code with leading spaces', () => {
    const text = `
>\`\`\`
>if (x < 0) {
>  return false
>}
>\`\`\``

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new CodeBlockNode(
            `if (x < 0) {
 return false
}`),
        ])
      ]))
  })
})