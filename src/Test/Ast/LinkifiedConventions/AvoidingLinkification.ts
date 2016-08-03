import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'


context('Once a convention has been linkified, it cannot be linkified again. This applies for: ', () => {
  specify('Spoilers', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
          new LinkNode([
            new PlainTextNode('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify('NSFW', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFW: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsfwNode([
          new LinkNode([
            new PlainTextNode('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify('NSFL', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('you fight Gary')
          ], 'https://example.com/finalbattle')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify("Footnotes", () => {
    const markup = "I don't eat cereal (^Well, I do, but I pretend not to.)[http://example.com/luckycharms] (https://example.com/cereal-problems) and I never have."

    const footnote =
      new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], 1)

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal"),
          footnote,
          new PlainTextNode(' '),
          new ParenthesizedNode([
            new PlainTextNode('('),
            new LinkNode([
              new PlainTextNode('example.com/cereal-problems')
            ], 'https://example.com/cereal-problems'),
            new PlainTextNode(')'),
          ]),
          new PlainTextNode(" and I never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  specify('Audio', () => {
    expect(Up.toAst('After you beat the Elite Four, [audio: you fight Gary] (example.com/fight.ogg) (example.com/finalbattle) (https://example.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new LinkNode([
          new AudioNode('you fight Gary', 'https://example.com/fight.ogg')
        ], 'https://example.com/finalbattle'),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify('Images', () => {
    expect(Up.toAst('After you beat the Elite Four, [image: you fight Gary] (example.com/fight.svg) (example.com/finalbattle) (https://example.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new LinkNode([
          new ImageNode('you fight Gary', 'https://example.com/fight.svg')
        ], 'https://example.com/finalbattle'),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify('Videos', () => {
    expect(Up.toAst('After you beat the Elite Four, [video: you fight Gary] (example.com/fight.webm) (example.com/finalbattle) (https://example.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new LinkNode([
          new VideoNode('you fight Gary', 'https://example.com/fight.webm')
        ], 'https://example.com/finalbattle'),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })
})


context('The following conventions cannot be linkified', () => {
  specify('Links', () => {
    expect(Up.toAst('After you beat the Elite Four, [you fight Gary] (example.com/finalbattle) (https://example.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new LinkNode([
          new PlainTextNode('you fight Gary')
        ], 'https://example.com/finalbattle'),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify('Revision insertion', () => {
    expect(Up.toAst('After you beat the Elite Four, ++you fight Gary++ (https://example.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new RevisionInsertionNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify('Revision deletion', () => {
    expect(Up.toAst('After you beat the Elite Four, you fight Gary ~~Ketchum~~ (https://example.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, you fight Gary '),
        new RevisionDeletionNode([
          new PlainTextNode('Ketchum')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com')
          ], 'https://example.com'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify('Inline code', () => {
    expect(Up.toAst("I look forward to `--strictNullChecks` and `--noUnusedParameters` (https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript).")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I look forward to '),
        new InlineCodeNode('--strictNullChecks'),
        new PlainTextNode(' and '),
        new InlineCodeNode('--noUnusedParameters'),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode("github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript")
          ], "https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript"),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify('Naked URLs', () => {
    expect(Up.toAst('https://goo.gl/7y3XBV (https://www.nintendo.co.uk)')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('goo.gl/7y3XBV')
        ], 'https://goo.gl/7y3XBV'),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('www.nintendo.co.uk')
          ], 'https://www.nintendo.co.uk'),
          new PlainTextNode(')')
        ])
      ]))
  })

  specify('Regular text (e.g. a word)', () => {
    expect(Up.toAst('The Mini-NES comes out November eleventh (http://ign.com/articles/2016/07/14/nintendo-announces-new-nes-console)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('The Mini-NES comes out November eleventh '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('ign.com/articles/2016/07/14/nintendo-announces-new-nes-console')
          ], 'http://ign.com/articles/2016/07/14/nintendo-announces-new-nes-console'),
          new PlainTextNode(')')
        ])
      ]))
  })
})
