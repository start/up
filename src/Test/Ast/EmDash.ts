import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'


context('3 consecutive dashes normally produce an em dash.', () => {
  context('This applies within regular text', () => {
    specify('Between words', () => {
      expect(Up.toAst("Okay---I'll eat the tarantula.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode("Okay—I'll eat the tarantula.")
        ]))
    })

    specify('Following a word', () => {
      expect(Up.toAst("Okay--- I'll eat the tarantula.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode("Okay— I'll eat the tarantula.")
        ]))
    })

    specify('Preceding a word', () => {
      expect(Up.toAst('"I like Starcraft" ---Mark Twain')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('"I like Starcraft" —Mark Twain')
        ]))
    })
  })


  context('This does not apply within', () => {
    specify('Link URLs', () => {
      expect(Up.toAst("[American flag emoji] (https://example.com/empojis/US---flag?info)")).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode("American flag emoji")
          ], 'https://example.com/empojis/US---flag?info')
        ]))
    })

    specify('Media URLs', () => {
      expect(Up.toAst('[video: ghosts eating luggage] (http://example.com/polter---geists.webm)')).to.be.eql(
        new DocumentNode([
          new VideoNode('ghosts eating luggage', 'http://example.com/polter---geists.webm')
        ]))
    })

    specify('Linkified media URLs', () => {
      expect(Up.toAst('[image: you fight Gary] (https://example.com/fight.svg) (http://example.com/final---battle)')).to.be.eql(
        new DocumentNode([
          new LinkNode([
            new ImageNode('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final---battle')
        ]))
    })

    specify('Linkified URLs for non-media conventions', () => {
      expect(Up.toAst('[SPOILER: you fight Gary] (http://example.com/final---battle)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new LinkNode([
              new PlainTextNode('you fight Gary')
            ], 'http://example.com/final---battle')
          ])
        ]))
    })

    specify('Inline code', () => {
      expect(Up.toAst("`i---;`")).to.be.eql(
        insideDocumentAndParagraph([
          new InlineCodeNode('i---;')
        ]))
    })

    specify('Code blocks', () => {
      const markup = `
\`\`\`
for (let i = items.length - 1; i >= 0; i---) { }
\`\`\``

      expect(Up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new CodeBlockNode(
            `for (let i = items.length - 1; i >= 0; i---) { }`)
        ]))
    })
  })
})


context('4 or more consecutive dashes produce as many em dashes as they can "afford" (at 3 dashes per em dash). Any extra dashes (either 1 or 2) are ignored.', () => {
  specify('4 dashes produce a single em dash', () => {
    expect(Up.toAst("Okay----I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay—I'll eat the tarantula.")
      ]))
  })

  specify('5 dashes produce a single em dash', () => {
    expect(Up.toAst("Okay-----I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay—I'll eat the tarantula.")
      ]))
  })

  specify('6 dashes produce 2 em dashes', () => {
    expect(Up.toAst("Okay, Prof. O------.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay, Prof. O——")
      ]))
  })

  specify('7 dashes produce 2 em dashes', () => {
    expect(Up.toAst("Okay, Prof. O-------.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay, Prof. O——")
      ]))
  })

  specify('8 dashes produce 2 em dashes', () => {
    expect(Up.toAst("Okay, Prof. --------.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay, Prof. ——")
      ]))
  })

  specify('9 dashes produce 3 em dashes', () => {
    expect(Up.toAst("---------. Gene Splicing & You. Kanto: Silf Co. 1996. Print.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("———. Gene Splicing & You. Kanto: Silf Co. 1996. Print.")
      ]))
  })
})


describe('When any of its dashes are escaped, that dash is interpreted as a regular dash.', () => {
  specify('Escaping the first of 3 dashes produces a hyphen followed by an en dash', () => {
    expect(Up.toAst("My favorite dashes: \\---")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("My favorite dashes: -–")
      ]))
  })

  specify('Escaping the second of 3 dashes produces 3 dashes, because there are not 2 consecutive unescaped dashes', () => {
    expect(Up.toAst("Okay-\\--I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay---I'll eat the tarantula.")
      ]))
  })

  specify('Escaping the third of 3 dashes produces an en dash followed by a hyphen', () => {
    expect(Up.toAst("My favorite dashes: --\\-")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("My favorite dashes: –-")
      ]))
  })
})
