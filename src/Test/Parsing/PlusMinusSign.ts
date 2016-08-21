import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { CodeBlock } from '../../SyntaxNodes/CodeBlock'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Link } from '../../SyntaxNodes/Link'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { InlineCode } from '../../SyntaxNodes/InlineCode'


context('A plus sign followed by a hyphen normally produces a plus-minus sign', () => {
  context('This applies within regular text:', () => {
    specify('Between words', () => {
      expect(Up.toDocument("Yeah, it uses base HP+-4.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText("Yeah, it uses base HP±4.")
        ]))
    })

    specify('Following a word', () => {
      expect(Up.toDocument("I have 10+- ...")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText("I have 10± ...")
        ]))
    })

    specify('Preceding a word', () => {
      expect(Up.toDocument('I have three homes, +-two.')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('I have three homes, ±two.')
        ]))
    })

    specify('Surrounded by whitespace', () => {
      expect(Up.toDocument("Well, +- a million.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText("Well, ± a million.")
        ]))
    })
  })


  context('This does not apply within:', () => {
    specify('Link URLs', () => {
      expect(Up.toDocument("[American flag emoji] (https://example.com/empojis/US+-flag?info)")).to.be.eql(
        insideDocumentAndParagraph([
          new Link([
            new PlainText("American flag emoji")
          ], 'https://example.com/empojis/US+-flag?info')
        ]))
    })

    specify('Media URLs', () => {
      expect(Up.toDocument('[video: ghosts eating luggage] (http://example.com/polter+-geists.webm)')).to.be.eql(
        new UpDocument([
          new Video('ghosts eating luggage', 'http://example.com/polter+-geists.webm')
        ]))
    })

    specify('Linkified media URLs', () => {
      expect(Up.toDocument('[image: you fight Gary] (https://example.com/fight.svg) (http://example.com/final+-battle)')).to.be.eql(
        new UpDocument([
          new Link([
            new Image('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final+-battle')
        ]))
    })

    specify('Linkified URLs for non-media conventions', () => {
      expect(Up.toDocument('[SPOILER: you fight Gary] (http://example.com/final+-battle)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new Link([
              new PlainText('you fight Gary')
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
          new CodeBlock(
            `for (let i = items.length - 1; i >= 0; i = i+-1) { }`)
        ]))
    })
  })
})


describe('When either of the hyphens are escaped, no en dash is produced:', () => {
  specify('First dash:', () => {
    expect(Up.toDocument("Okay\\--I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText("Okay--I'll eat the tarantula.")
      ]))
  })

  specify('Second hyphen:', () => {
    expect(Up.toDocument("Okay-\\-I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText("Okay--I'll eat the tarantula.")
      ]))
  })
})
