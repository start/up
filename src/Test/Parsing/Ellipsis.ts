import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


context('Consecutive periods normally produce an ellipsis.', () => {
  context('This applies within regular text:', () => {
    specify('Between words', () => {
      expect(Up.parse("Okay...I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text("Okay…I'll eat the tarantula.")
        ]))
    })

    specify('Following a word', () => {
      expect(Up.parse("Okay... I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text("Okay… I'll eat the tarantula.")
        ]))
    })

    specify('Preceding a word', () => {
      expect(Up.parse('"I like Starcraft" ...still')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.Text('"I like Starcraft"')
          ]),
          new Up.Text(' …still')
        ]))
    })

    specify('Surrounded by whitespace', () => {
      expect(Up.parse("Okay ... I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text("Okay … I'll eat the tarantula.")
        ]))
    })
  })


  context('This does not apply within:', () => {
    specify('Link URLs', () => {
      expect(Up.parse("[American flag emoji] (https://example.com/empojis/US...flag?info)")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text("American flag emoji")
          ], 'https://example.com/empojis/US...flag?info')
        ]))
    })

    specify('Media URLs', () => {
      expect(Up.parse('[video: ghosts eating luggage] (http://example.com/polter...geists.webm)')).to.deep.equal(
        new Up.Document([
          new Up.Video('ghosts eating luggage', 'http://example.com/polter...geists.webm')
        ]))
    })

    specify('Linkified media URLs', () => {
      expect(Up.parse('[image: you fight Gary] (https://example.com/fight.svg) (http://example.com/final...battle)')).to.deep.equal(
        new Up.Document([
          new Up.Link([
            new Up.Image('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final...battle')
        ]))
    })

    specify('Linkified URLs for non-media conventions', () => {
      expect(Up.parse('[SPOILER: you fight Gary] (http://example.com/final...battle)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Link([
              new Up.Text('you fight Gary')
            ], 'http://example.com/final...battle')
          ])
        ]))
    })

    specify('Inline code', () => {
      expect(Up.parse("`i---;`")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineCode('i---;')
        ]))
    })

    specify('Code blocks', () => {
      const markup = `
\`\`\`
return distinct('highlight', ...this._highlight)
\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.CodeBlock(
            `return distinct('highlight', ...this._highlight)`)
        ]))
    })
  })
})


context('Any number of consecutive periods produces a single ellipsis.', () => {
  specify('2 periods', () => {
    expect(Up.parse("Okay.. I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('3 periods', () => {
    expect(Up.parse("Okay... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('4 periods', () => {
    expect(Up.parse("Okay.... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('5 periods', () => {
    expect(Up.parse("Okay..... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('6 periods', () => {
    expect(Up.parse("Okay...... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('7 periods', () => {
    expect(Up.parse("Okay....... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('8 periods', () => {
    expect(Up.parse("Okay........ I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay… I'll eat the tarantula.")
      ]))
  })

  specify('9 periods', () => {
    expect(Up.parse("Okay......... I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay… I'll eat the tarantula.")
      ]))
  })
})


describe("When one of many consecutive periods is escaped, that period is treated as a regular period. The periods around it are unaffected (unless they are also escaped):", () => {
  specify('Escaping a period in the middle of many periods produces a period sandwiched by elipsis', () => {
    expect(Up.parse("Just some typical punctuation usage: ...\\....")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Just some typical punctuation usage: ….…")
      ]))
  })

  specify('Escaping consecutive periods produces consecutive periods', () => {
    expect(Up.parse("Just some typical punctuation usage: \\.\\.\\.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Just some typical punctuation usage: ...")
      ]))
  })

  specify('Escaping the first of 2 periods produces consecutive periods', () => {
    expect(Up.parse("Just some typical punctuation usage: \\..")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Just some typical punctuation usage: ..")
      ]))
  })
})
