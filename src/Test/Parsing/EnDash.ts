import { expect } from 'chai'
import { Up } from '../../Up'
import { insideDocumentAndParagraph } from './Helpers'
import { Document } from '../../SyntaxNodes/Document'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { CodeBlock } from '../../SyntaxNodes/CodeBlock'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Link } from '../../SyntaxNodes/Link'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'


context('2 consecutive hyphens normally produce an en dash.', () => {
  context('This applies within regular text:', () => {
    specify('Between words', () => {
      expect(Up.parse("Okay--I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText("Okay–I'll eat the tarantula.")
        ]))
    })

    specify('Following a word', () => {
      expect(Up.parse("Okay-- I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText("Okay– I'll eat the tarantula.")
        ]))
    })

    specify('Preceding a word', () => {
      expect(Up.parse('"I like Starcraft" --Mark Twain')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineQuote([
            new PlainText('I like Starcraft')
          ]),
          new PlainText(' –Mark Twain')
        ]))
    })

    specify('Surrounded by whitespace', () => {
      expect(Up.parse("Okay -- I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText("Okay – I'll eat the tarantula.")
        ]))
    })
  })


  context('This does not apply within:', () => {
    specify('Link URLs', () => {
      expect(Up.parse("[American flag emoji] (https://example.com/empojis/US--flag?info)")).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText("American flag emoji")
          ], 'https://example.com/empojis/US--flag?info')
        ]))
    })

    specify('Media URLs', () => {
      expect(Up.parse('[video: ghosts eating luggage] (http://example.com/polter--geists.webm)')).to.deep.equal(
        new Document([
          new Video('ghosts eating luggage', 'http://example.com/polter--geists.webm')
        ]))
    })

    specify('Linkified media URLs', () => {
      expect(Up.parse('[image: you fight Gary] (https://example.com/fight.svg) (http://example.com/final--battle)')).to.deep.equal(
        new Document([
          new Link([
            new Image('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final--battle')
        ]))
    })

    specify('Linkified URLs for non-media conventions', () => {
      expect(Up.parse('[SPOILER: you fight Gary] (http://example.com/final--battle)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new Link([
              new PlainText('you fight Gary')
            ], 'http://example.com/final--battle')
          ])
        ]))
    })

    specify('Inline code', () => {
      expect(Up.parse("`i--;`")).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode('i--;')
        ]))
    })

    specify('Code blocks', () => {
      const markup = `
\`\`\`
for (let i = items.length - 1; i >= 0; i--) { }
\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new CodeBlock(
            `for (let i = items.length - 1; i >= 0; i--) { }`)
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
