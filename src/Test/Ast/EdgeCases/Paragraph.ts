import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'


context('Normally, consecutive non-blank lines produce a line block. However, if all but one of the lines consist solely of escaped whitespace, a paragraph is produced instead. This includes when:', () => {
  specify('The blank lines are all trailing, and none of them are indented', () => {
    const markup = `
You'll never believe this fake evidence!
\\   \\  \t \\\t 
 \\   \\  \t \\\t 
\\   \t\\   \\  \t \\\t `

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ])
      ]))
  })

  specify('The blank lines are all leading, and none but the first are indented', () => {
    const markup = `
    \\   \t\\   \\  \t \\\t 
\\   \\  \t \\\t 
 \\   \\  \t \\\t 
You'll never believe this fake evidence!`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ])
      ]))
  })

  specify('The blank lines surround the paragraph, and none but the first are indented', () => {
    const markup = `
  \\   \t\\   \\  \t \\\t 
\\   \\  \t \\\t 
 \\   \\  \t \\\t 
You'll never believe this fake evidence!
\\   \t\\   \\  \t \\\t 
\\   \\  \t \\\t 
 \\   \\  \t \\\t `

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("You'll never believe this fake evidence!")
        ])
      ]))
  })
})
