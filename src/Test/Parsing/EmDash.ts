import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


context('3 consecutive hyphens normally produce an em dash.', () => {
  context('This applies within regular text:', () => {
    specify('Between words', () => {
      expect(Up.parse("Okay---I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text("Okay—I'll eat the tarantula.")
        ]))
    })

    specify('Following a word', () => {
      expect(Up.parse("Okay--- I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text("Okay— I'll eat the tarantula.")
        ]))
    })

    specify('Preceding a word', () => {
      expect(Up.parse('"I like Starcraft" ---Mark Twain')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.Text('I like Starcraft')
          ]),
          new Up.Text(' —Mark Twain')
        ]))
    })

    specify('Surrounded by whitespace', () => {
      expect(Up.parse("Okay --- I'll eat the tarantula.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text("Okay — I'll eat the tarantula.")
        ]))
    })
  })


  context('This does not apply within:', () => {
    specify('Link URLs', () => {
      expect(Up.parse("[American flag emoji] (https://example.com/empojis/US---flag?info)")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text("American flag emoji")
          ], 'https://example.com/empojis/US---flag?info')
        ]))
    })

    specify('Media URLs', () => {
      expect(Up.parse('[video: ghosts eating luggage] (http://example.com/polter---geists.webm)')).to.deep.equal(
        new Up.Document([
          new Up.Video('ghosts eating luggage', 'http://example.com/polter---geists.webm')
        ]))
    })

    specify('Linkified media URLs', () => {
      expect(Up.parse('[image: you fight Gary] (https://example.com/fight.svg) (http://example.com/final---battle)')).to.deep.equal(
        new Up.Document([
          new Up.Link([
            new Up.Image('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final---battle')
        ]))
    })

    specify('Linkified URLs for non-media conventions', () => {
      expect(Up.parse('[SPOILER: you fight Gary] (http://example.com/final---battle)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Link([
              new Up.Text('you fight Gary')
            ], 'http://example.com/final---battle')
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
for (let i = items.length - 1; i >= 0; i---) { }
\`\`\``

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.CodeBlock(
            `for (let i = items.length - 1; i >= 0; i---) { }`)
        ]))
    })
  })
})


context('4 or more consecutive hyphens produce as many em dashes as they can "afford" (at 3 hyphens per em dash). Any extra hyphens (naturally either 1 or 2) are ignored.', () => {
  specify('4 hyphens produce a single em dash', () => {
    expect(Up.parse("Okay----I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay—I'll eat the tarantula.")
      ]))
  })

  specify('5 hyphens produce a single em dash', () => {
    expect(Up.parse("Okay-----I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay—I'll eat the tarantula.")
      ]))
  })

  specify('6 hyphens produce 2 em dashes', () => {
    expect(Up.parse("Okay, Prof. O------.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay, Prof. O——.")
      ]))
  })

  specify('7 hyphens produce 2 em dashes', () => {
    expect(Up.parse("Okay, Prof. O-------.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay, Prof. O——.")
      ]))
  })

  specify('8 hyphens produce 2 em dashes', () => {
    expect(Up.parse("Okay, Prof. --------.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay, Prof. ——.")
      ]))
  })

  specify('9 hyphens produce 3 em dashes', () => {
    expect(Up.parse("---------. Gene Splicing & You. Kanto: Silf Co. 1996. Print.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("———. Gene Splicing & You. Kanto: Silf Co. 1996. Print.")
      ]))
  })
})


describe("When any of an em dash's hyphens are escaped, that single hyphen is interpreted as a regular dash.", () => {
  specify('Escaping the first of 3 hyphens produces a hyphen followed by an en dash', () => {
    expect(Up.parse("My favorite dashes: \\---")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("My favorite dashes: -–")
      ]))
  })

  specify('Escaping the second of 3 hyphens produces 3 hyphens, because there are not 2 consecutive unescaped hyphens', () => {
    expect(Up.parse("Okay-\\--I'll eat the tarantula.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("Okay---I'll eat the tarantula.")
      ]))
  })

  specify('Escaping the third of 3 hyphens produces an en dash followed by a hyphen', () => {
    expect(Up.parse("My favorite dashes: --\\-")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("My favorite dashes: –-")
      ]))
  })

  specify('Escaping the third of 4 hyphens produces an em dash followed by a hyphen', () => {
    expect(Up.parse("My favorite dashes: ---\\-")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("My favorite dashes: —-")
      ]))
  })

  specify('Escaping the fourth of 5 hyphens produces an em dash followed by a hyphen', () => {
    expect(Up.parse("My favorite dashes: ----\\-")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("My favorite dashes: —-")
      ]))
  })
})
