import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


context('Once a convention has been linkified, it cannot be linkified again. This applies for:', () => {
  specify('Spoilers', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.Text('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com')
          ], 'https://example.com'),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })

  specify('NSFW', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.Link([
            new Up.Text('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com')
          ], 'https://example.com'),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })

  specify('NSFL', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Link([
            new Up.Text('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com')
          ], 'https://example.com'),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })

  specify("Footnotes", () => {
    const markup = "I don't eat cereal (^Well, I do, but I pretend not to.)[http://example.com/luckycharms] (https://example.com/cereal-problems) and I never have."

    const footnote =
      new Up.Footnote([
        new Up.Link([
          new Up.Text('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I don't eat cereal"),
          footnote,
          new Up.Text(' '),
          new Up.NormalParenthetical([
            new Up.Text('('),
            new Up.Link([
              new Up.Text('example.com/cereal-problems')
            ], 'https://example.com/cereal-problems'),
            new Up.Text(')'),
          ]),
          new Up.Text(" and I never have."),
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })

  specify('Audio', () => {
    expect(Up.parse('After you beat the Elite Four, [audio: you fight Gary] (example.com/fight.ogg) (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Link([
          new Up.Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'https://example.com/finalbattle'),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com')
          ], 'https://example.com'),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })

  specify('Images', () => {
    expect(Up.parse('After you beat the Elite Four, [image: you fight Gary] (example.com/fight.svg) (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Link([
          new Up.Image('you fight Gary', 'https://example.com/fight.svg')
        ], 'https://example.com/finalbattle'),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com')
          ], 'https://example.com'),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })

  specify('Videos', () => {
    expect(Up.parse('After you beat the Elite Four, [video: you fight Gary] (example.com/fight.webm) (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Link([
          new Up.Video('you fight Gary', 'https://example.com/fight.webm')
        ], 'https://example.com/finalbattle'),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com')
          ], 'https://example.com'),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })
})


context('The following conventions cannot be linkified:', () => {
  specify('Links', () => {
    expect(Up.parse('After you beat the Elite Four, [you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Link([
          new Up.Text('you fight Gary')
        ], 'https://example.com/finalbattle'),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com')
          ], 'https://example.com'),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })

  specify('Section links', () => {
    expect(Up.parse('After you beat the Elite Four, you are not done. See [topic: rival fights] (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, you are not done. See '),
        new Up.SectionLink('rival fights'),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com')
          ], 'https://example.com'),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })

  specify('Inline quotes', () => {
    expect(Up.parse('After you beat the Elite Four, you "win" (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, you '),
        new Up.InlineQuote([
          new Up.Text('win')
        ]),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com')
          ], 'https://example.com'),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })

  specify('Inline code', () => {
    expect(Up.parse("I look forward to `--strictNullChecks` and `--noUnusedParameters` (https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript).")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I look forward to '),
        new Up.InlineCode('--strictNullChecks'),
        new Up.Text(' and '),
        new Up.InlineCode('--noUnusedParameters'),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text("github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript")
          ], "https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript"),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })

  specify('Bare URLs', () => {
    expect(Up.parse('https://goo.gl/7y3XBV (https://www.nintendo.co.uk)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('goo.gl/7y3XBV')
        ], 'https://goo.gl/7y3XBV'),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('www.nintendo.co.uk')
          ], 'https://www.nintendo.co.uk'),
          new Up.Text(')')
        ])
      ]))
  })

  specify('Regular text (e.g. a word)', () => {
    expect(Up.parse('The Mini-NES comes out November eleventh (http://ign.com/articles/2016/07/14/nintendo-announces-new-nes-console)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('The Mini-NES comes out November eleventh '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('ign.com/articles/2016/07/14/nintendo-announces-new-nes-console')
          ], 'http://ign.com/articles/2016/07/14/nintendo-announces-new-nes-console'),
          new Up.Text(')')
        ])
      ]))
  })
})
