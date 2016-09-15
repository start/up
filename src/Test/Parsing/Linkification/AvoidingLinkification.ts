import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'


context('Once a convention has been linkified, it cannot be linkified again. This applies for:', () => {
  specify('Spoilers', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.PlainText('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com')
          ], 'https://example.com'),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })

  specify('NSFW', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.Link([
            new Up.PlainText('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com')
          ], 'https://example.com'),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })

  specify('NSFL', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Link([
            new Up.PlainText('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com')
          ], 'https://example.com'),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })

  specify("Footnotes", () => {
    const markup = "I don't eat cereal (^Well, I do, but I pretend not to.)[http://example.com/luckycharms] (https://example.com/cereal-problems) and I never have."

    const footnote =
      new Up.Footnote([
        new Up.Link([
          new Up.PlainText('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal"),
          footnote,
          new Up.PlainText(' '),
          new Up.NormalParenthetical([
            new Up.PlainText('('),
            new Up.Link([
              new Up.PlainText('example.com/cereal-problems')
            ], 'https://example.com/cereal-problems'),
            new Up.PlainText(')'),
          ]),
          new Up.PlainText(" and I never have."),
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })

  specify('Audio', () => {
    expect(Up.parse('After you beat the Elite Four, [audio: you fight Gary] (example.com/fight.ogg) (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.Link([
          new Up.Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'https://example.com/finalbattle'),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com')
          ], 'https://example.com'),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })

  specify('Images', () => {
    expect(Up.parse('After you beat the Elite Four, [image: you fight Gary] (example.com/fight.svg) (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.Link([
          new Up.Image('you fight Gary', 'https://example.com/fight.svg')
        ], 'https://example.com/finalbattle'),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com')
          ], 'https://example.com'),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })

  specify('Videos', () => {
    expect(Up.parse('After you beat the Elite Four, [video: you fight Gary] (example.com/fight.webm) (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.Link([
          new Up.Video('you fight Gary', 'https://example.com/fight.webm')
        ], 'https://example.com/finalbattle'),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com')
          ], 'https://example.com'),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })
})


context('The following conventions cannot be linkified:', () => {
  specify('Links', () => {
    expect(Up.parse('After you beat the Elite Four, [you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.Link([
          new Up.PlainText('you fight Gary')
        ], 'https://example.com/finalbattle'),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com')
          ], 'https://example.com'),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })

  specify('Section links', () => {
    expect(Up.parse('After you beat the Elite Four, you are not done. See [topic: rival fights] (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, you are not done. See '),
        new Up.SectionLink('rival fights'),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com')
          ], 'https://example.com'),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })

  specify('Inline quotes', () => {
    expect(Up.parse('After you beat the Elite Four, you "win" (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, you '),
        new Up.InlineQuote([
          new Up.PlainText('win')
        ]),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com')
          ], 'https://example.com'),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })

  specify('Inline code', () => {
    expect(Up.parse("I look forward to `--strictNullChecks` and `--noUnusedParameters` (https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript).")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I look forward to '),
        new Up.InlineCode('--strictNullChecks'),
        new Up.PlainText(' and '),
        new Up.InlineCode('--noUnusedParameters'),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText("github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript")
          ], "https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript"),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })

  specify('Bare URLs', () => {
    expect(Up.parse('https://goo.gl/7y3XBV (https://www.nintendo.co.uk)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('goo.gl/7y3XBV')
        ], 'https://goo.gl/7y3XBV'),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('www.nintendo.co.uk')
          ], 'https://www.nintendo.co.uk'),
          new Up.PlainText(')')
        ])
      ]))
  })

  specify('Regular text (e.g. a word)', () => {
    expect(Up.parse('The Mini-NES comes out November eleventh (http://ign.com/articles/2016/07/14/nintendo-announces-new-nes-console)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('The Mini-NES comes out November eleventh '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('ign.com/articles/2016/07/14/nintendo-announces-new-nes-console')
          ], 'http://ign.com/articles/2016/07/14/nintendo-announces-new-nes-console'),
          new Up.PlainText(')')
        ])
      ]))
  })
})
