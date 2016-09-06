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
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'


context('Consecutive periods normally produce an ellipsis.', () => {
  context('This applies within regular text:', () => {
    specify('Between words', () => {
      expect(Up.parseDocument("Okay...I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText("Okay…I'll eat the tarantula.")
        ]))
    })

    specify('Following a word', () => {
      expect(Up.parseDocument("Okay... I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText("Okay… I'll eat the tarantula.")
        ]))
    })

    specify('Preceding a word', () => {
      expect(Up.parseDocument('"I like Starcraft" ...still')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineQuote([
            new PlainText('I like Starcraft')
          ]),
          new PlainText(' …still')
        ]))
    })

    specify('Surrounded by whitespace', () => {
      expect(Up.parseDocument("Okay ... I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText("Okay … I'll eat the tarantula.")
        ]))
    })
  })


  context('This does not apply within:', () => {
    specify('Link URLs', () => {
      expect(Up.parseDocument("[American flag emoji] (https://example.com/empojis/US...flag?info)")).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText("American flag emoji")
          ], 'https://example.com/empojis/US...flag?info')
        ]))
    })

    specify('Media URLs', () => {
      expect(Up.parseDocument('[video: ghosts eating luggage] (http://example.com/polter...geists.webm)')).to.deep.equal(
        new UpDocument([
          new Video('ghosts eating luggage', 'http://example.com/polter...geists.webm')
        ]))
    })

    specify('Linkified media URLs', () => {
      expect(Up.parseDocument('[image: you fight Gary] (https://example.com/fight.svg) (http://example.com/final...battle)')).to.deep.equal(
        new UpDocument([
          new Link([
            new Image('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final...battle')
        ]))
    })

    specify('Linkified URLs for non-media conventions', () => {
      expect(Up.parseDocument('[SPOILER: you fight Gary] (http://example.com/final...battle)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new Link([
              new PlainText('you fight Gary')
            ], 'http://example.com/final...battle')
          ])
        ]))
    })

    specify('Inline code', () => {
      expect(Up.parseDocument("`i---;`")).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode('i---;')
        ]))
    })

    specify('Code blocks', () => {
      const markup = `
\`\`\`
return distinct('highlight', ...this._highlight)
\`\`\``

      expect(Up.parseDocument(markup)).to.deep.equal(
        new UpDocument([
          new CodeBlock(
            `return distinct('highlight', ...this._highlight)`)
        ]))
    })
  })
})


context('Any number of consecutive periods produces a single ellipsis.', () => {
  specify('2 periods', () => {
    expect(Up.parseDocument("Okay.. I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('3 periods', () => {
    expect(Up.parseDocument("Okay... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('4 periods', () => {
    expect(Up.parseDocument("Okay.... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('5 periods', () => {
    expect(Up.parseDocument("Okay..... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('6 periods', () => {
    expect(Up.parseDocument("Okay...... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('7 periods', () => {
    expect(Up.parseDocument("Okay....... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('8 periods', () => {
    expect(Up.parseDocument("Okay........ I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('9 periods', () => {
    expect(Up.parseDocument("Okay......... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay… I'll eat the tarantula.")
      ]))
  })
})


describe("When one of many consecutive periods is escaped, that period is treated as a regular period. The periods around it are unaffected (unless they are also escaped):", () => {
  specify('Escaping a period in the middle of many periods produces a period sandwiched by elipsis', () => {
    expect(Up.parseDocument("Just some typical punctuation usage: ...\\....")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Just some typical punctuation usage: ….…")
      ]))
  })

  specify('Escaping consecutive periods produces consecutive periods', () => {
    expect(Up.parseDocument("Just some typical punctuation usage: \\.\\.\\.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Just some typical punctuation usage: ...")
      ]))
  })

  specify('Escaping the first of 2 periods produces consecutive periods', () => {
    expect(Up.parseDocument("Just some typical punctuation usage: \\..")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Just some typical punctuation usage: ..")
      ]))
  })
})
