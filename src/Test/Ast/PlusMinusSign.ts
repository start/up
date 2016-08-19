import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineCode } from '../../SyntaxNodes/InlineCode'


context('A plus sign followed by a hyphen normally produces a plus-minus sign', () => {
  context('This applies within regular text:', () => {
    specify('Between words', () => {
      expect(Up.toDocument("Yeah, it uses base HP+-4.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode("Yeah, it uses base HP±4.")
        ]))
    })

    specify('Following a word', () => {
      expect(Up.toDocument("I have 10+- ...")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode("I have 10± ...")
        ]))
    })

    specify('Preceding a word', () => {
      expect(Up.toDocument('I have three homes, +-two.')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('I have three homes, ±two.')
        ]))
    })

    specify('Surrounded by whitespace', () => {
      expect(Up.toDocument("Well, +- a million.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode("Well, ± a million.")
        ]))
    })
  })


  context('This does not apply within:', () => {
    specify('Link URLs', () => {
      expect(Up.toDocument("[American flag emoji] (https://example.com/empojis/US+-flag?info)")).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode("American flag emoji")
          ], 'https://example.com/empojis/US+-flag?info')
        ]))
    })

    specify('Media URLs', () => {
      expect(Up.toDocument('[video: ghosts eating luggage] (http://example.com/polter+-geists.webm)')).to.be.eql(
        new UpDocument([
          new VideoNode('ghosts eating luggage', 'http://example.com/polter+-geists.webm')
        ]))
    })

    specify('Linkified media URLs', () => {
      expect(Up.toDocument('[image: you fight Gary] (https://example.com/fight.svg) (http://example.com/final+-battle)')).to.be.eql(
        new UpDocument([
          new LinkNode([
            new ImageNode('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final+-battle')
        ]))
    })

    specify('Linkified URLs for non-media conventions', () => {
      expect(Up.toDocument('[SPOILER: you fight Gary] (http://example.com/final+-battle)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new LinkNode([
              new PlainTextNode('you fight Gary')
            ], 'http://example.com/final+-battle')
          ])
        ]))
    })

    specify('Inline code', () => {
      expect(Up.toDocument("`x+-y`")).to.be.eql(
        insideDocumentAndParagraph([
          new InlineCode('x+-y')
        ]))
    })

    specify('Code blocks', () => {
        const markup = `
\`\`\`
for (let i = items.length - 1; i >= 0; i = i+-1) { }
\`\`\``

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new CodeBlockNode(
            `for (let i = items.length - 1; i >= 0; i = i+-1) { }`)
        ]))
    })
  })
})


describe('When either of the hyphens are escaped, no en dash is produced:', () => {
  specify('First dash:', () => {
    expect(Up.toDocument("Okay\\--I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay--I'll eat the tarantula.")
      ]))
  })

  specify('Second hyphen:', () => {
    expect(Up.toDocument("Okay-\\-I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay--I'll eat the tarantula.")
      ]))
  })
})
