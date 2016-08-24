import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Link } from '../../../SyntaxNodes/Link'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { Image } from '../../../SyntaxNodes/Image'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Video } from '../../../SyntaxNodes/Video'
import { Audio } from '../../../SyntaxNodes/Audio'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { RevisionInsertion } from '../../../SyntaxNodes/RevisionInsertion'
import { RevisionDeletion } from '../../../SyntaxNodes/RevisionDeletion'
import { InlineCode } from '../../../SyntaxNodes/InlineCode'


context('Once a convention has been linkified, it cannot be linkified again. This applies for:', () => {
  specify('Spoilers', () => {
    expect(Up.toDocument('After you beat the Elite Four, [SPOILER: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineSpoiler([
          new Link([
            new PlainText('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com')
          ], 'https://example.com'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })

  specify('NSFW', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new Link([
            new PlainText('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com')
          ], 'https://example.com'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })

  specify('NSFL', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new Link([
            new PlainText('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com')
          ], 'https://example.com'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })

  specify("Footnotes", () => {
    const markup = "I don't eat cereal (^Well, I do, but I pretend not to.)[http://example.com/luckycharms] (https://example.com/cereal-problems) and I never have."

    const footnote =
      new Footnote([
        new Link([
          new PlainText('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal"),
          footnote,
          new PlainText(' '),
          new NormalParenthetical([
            new PlainText('('),
            new Link([
              new PlainText('example.com/cereal-problems')
            ], 'https://example.com/cereal-problems'),
            new PlainText(')'),
          ]),
          new PlainText(" and I never have."),
        ]),
        new FootnoteBlock([footnote])
      ]))
  })

  specify('Audio', () => {
    expect(Up.toDocument('After you beat the Elite Four, [audio: you fight Gary] (example.com/fight.ogg) (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Link([
          new Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'https://example.com/finalbattle'),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com')
          ], 'https://example.com'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })

  specify('Images', () => {
    expect(Up.toDocument('After you beat the Elite Four, [image: you fight Gary] (example.com/fight.svg) (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Link([
          new Image('you fight Gary', 'https://example.com/fight.svg')
        ], 'https://example.com/finalbattle'),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com')
          ], 'https://example.com'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })

  specify('Videos', () => {
    expect(Up.toDocument('After you beat the Elite Four, [video: you fight Gary] (example.com/fight.webm) (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Link([
          new Video('you fight Gary', 'https://example.com/fight.webm')
        ], 'https://example.com/finalbattle'),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com')
          ], 'https://example.com'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })
})


context('The following conventions cannot be linkified', () => {
  specify('Links', () => {
    expect(Up.toDocument('After you beat the Elite Four, [you fight Gary] (example.com/finalbattle) (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Link([
          new PlainText('you fight Gary')
        ], 'https://example.com/finalbattle'),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com')
          ], 'https://example.com'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })

  specify('Revision insertion', () => {
    expect(Up.toDocument('After you beat the Elite Four, ++you fight Gary++ (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new RevisionInsertion([
          new PlainText('you fight Gary')
        ]),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com')
          ], 'https://example.com'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })

  specify('Revision deletion', () => {
    expect(Up.toDocument('After you beat the Elite Four, you fight Gary ~~Ketchum~~ (https://example.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, you fight Gary '),
        new RevisionDeletion([
          new PlainText('Ketchum')
        ]),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com')
          ], 'https://example.com'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })

  specify('Inline code', () => {
    expect(Up.toDocument("I look forward to `--strictNullChecks` and `--noUnusedParameters` (https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript).")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I look forward to '),
        new InlineCode('--strictNullChecks'),
        new PlainText(' and '),
        new InlineCode('--noUnusedParameters'),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText("github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript")
          ], "https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript"),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })

  specify('Naked URLs', () => {
    expect(Up.toDocument('https://goo.gl/7y3XBV (https://www.nintendo.co.uk)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('goo.gl/7y3XBV')
        ], 'https://goo.gl/7y3XBV'),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('www.nintendo.co.uk')
          ], 'https://www.nintendo.co.uk'),
          new PlainText(')')
        ])
      ]))
  })

  specify('Regular text (e.g. a word)', () => {
    expect(Up.toDocument('The Mini-NES comes out November eleventh (http://ign.com/articles/2016/07/14/nintendo-announces-new-nes-console)')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('The Mini-NES comes out November eleventh '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('ign.com/articles/2016/07/14/nintendo-announces-new-nes-console')
          ], 'http://ign.com/articles/2016/07/14/nintendo-announces-new-nes-console'),
          new PlainText(')')
        ])
      ]))
  })
})
