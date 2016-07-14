import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../../SyntaxNodes/NsflNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


context('Once a convention has been linkified, it cannot be linkified again. This applies for: ', () => {
  specify('Spoilers', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight Gary] (example.com/finalbattle) (https://example.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
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
        new NsfwNode([
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
        new NsflNode([
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
    const text = "I don't eat cereal (^Well, I do, but I pretend not to.)[http://example.com/luckycharms] (https://example.com/cereal-problems) and I never have."

    const footnote =
      new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
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
