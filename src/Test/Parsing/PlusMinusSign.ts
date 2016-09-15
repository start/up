import { expect } from 'chai'
import Up = require('../../index')
import { insideDocumentAndParagraph } from './Helpers'
import { Document } from '../../SyntaxNodes/Document'
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
      expect(Up.parse("Yeah, it uses base HP+-4.")).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText("Yeah, it uses base HP±4.")
        ]))
    })

    specify('Following a word', () => {
      expect(Up.parse("I have 10+- ...")).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText("I have 10± …")
        ]))
    })

    specify('Preceding a word', () => {
      expect(Up.parse('I have three homes, +-two.')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('I have three homes, ±two.')
        ]))
    })

    specify('Surrounded by whitespace', () => {
      expect(Up.parse("Well, +- a million.")).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText("Well, ± a million.")
        ]))
    })
  })


  context('This does not apply within:', () => {
    specify('Link URLs', () => {
      expect(Up.parse("[American flag emoji] (https://example.com/empojis/US+-flag?info)")).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText("American flag emoji")
          ], 'https://example.com/empojis/US+-flag?info')
        ]))
    })

    specify('Media URLs', () => {
      expect(Up.parse('[video: ghosts eating luggage] (http://example.com/polter+-geists.webm)')).to.deep.equal(
        new Document([
          new Video('ghosts eating luggage', 'http://example.com/polter+-geists.webm')
        ]))
    })

    specify('Linkified media URLs', () => {
      expect(Up.parse('[image: you fight Gary] (https://example.com/fight.svg) (http://example.com/final+-battle)')).to.deep.equal(
        new Document([
          new Link([
            new Image('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final+-battle')
        ]))
    })

    specify('Linkified URLs for non-media conventions', () => {
      expect(Up.parse('[SPOILER: you fight Gary] (http://example.com/final+-battle)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new Link([
              new PlainText('you fight Gary')
            ], 'http://example.com/final+-battle')
          ])
        ]))
    })

    specify('Inline code', () => {
      expect(Up.parse("`x+-y`")).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode('x+-y')
        ]))
    })

    specify('Code blocks', () => {
        const markup = `
\`\`\`
for (let i = items.length - 1; i >= 0; i = i+-1) { }
\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new CodeBlock(
            `for (let i = items.length - 1; i >= 0; i = i+-1) { }`)
        ]))
    })
  })
})


describe('When either of the hyphens are escaped, no en dash is produced:', () => {
  specify('First dash:', () => {
    expect(Up.parse("Okay\\--I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay--I'll eat the tarantula.")
      ]))
  })

  specify('Second hyphen:', () => {
    expect(Up.parse("Okay-\\-I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay--I'll eat the tarantula.")
      ]))
  })
})
