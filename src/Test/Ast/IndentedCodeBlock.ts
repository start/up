import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'


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
            new OrderedListItem([
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
            new OrderedListItem([
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
            new OrderedListItem([
              new CodeBlockNode(
                `  if (x < 0) {
\t\treturn false
  }`),
            ])
          ])
        ]))
    })
  })
})