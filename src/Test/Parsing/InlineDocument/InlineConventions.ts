import { expect } from 'chai'
import Up from'../../../index'
import { InlineUpDocument } from'../../../SyntaxNodes/InlineUpDocument'
import { PlainText } from'../../../SyntaxNodes/PlainText'
import { Audio } from '../../../SyntaxNodes/Audio'
import { Bold } from'../../../SyntaxNodes/Bold'
import { Emphasis } from'../../../SyntaxNodes/Emphasis'
import { ExampleInput } from '../../../SyntaxNodes/ExampleInput'
import { Highlight } from '../../../SyntaxNodes/Highlight'
import { Image } from '../../../SyntaxNodes/Image'
import { InlineCode } from '../../../SyntaxNodes/InlineCode'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineQuote } from '../../../SyntaxNodes/InlineQuote'
import { Italic } from '../../../SyntaxNodes/Italic'
import { Link } from '../../../SyntaxNodes/Link'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../../SyntaxNodes/SquareParenthetical'
import { RevisionInsertion } from'../../../SyntaxNodes/RevisionInsertion'
import { RevisionDeletion } from'../../../SyntaxNodes/RevisionDeletion'
import { Stress } from'../../../SyntaxNodes/Stress'
import { Video } from'../../../SyntaxNodes/Video'


context('Except for footnots, every inline convention is supported in inline documents.', () => {
  context('Supported conventions:', () => {
    specify('Audio', () => {
      expect(Up.toInlineDocument('Listen to this: [audio: cricket meowing] (example.com/meow.ogg)')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('Listen to this: '),
          new Audio('cricket meowing', 'https://example.com/meow.ogg')
        ]))
    })

    specify('Bold', () => {
      expect(Up.toInlineDocument('I loved my __Game Boy__, though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new Bold([
            new PlainText('Game Boy'),
          ]),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.toInlineDocument('I loved my *Game Boy*, though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new Emphasis([
            new PlainText('Game Boy'),
          ]),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Example input', () => {
      expect(Up.toInlineDocument('I loved pressing {A} and {B} on my Game Boy, though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved pressing '),
          new ExampleInput('A'),
          new PlainText(' and '),
          new ExampleInput('B'),
          new PlainText(' on my Game Boy, though I never took it with me when I left home.')
        ]))
    })

    specify('Highlight', () => {
      expect(Up.toInlineDocument('I loved my [highlight: Game Boy], though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new Highlight([
            new PlainText('Game Boy'),
          ]),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Images', () => {
      expect(Up.toInlineDocument('Look at this: [image: cricket sewing] (example.com/sew.ogg)')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('Look at this: '),
          new Image('cricket sewing', 'https://example.com/sew.ogg')
        ]))
    })

    specify('Inline code', () => {
      expect(Up.toInlineDocument('I loved `<dl>` elements, though I never used them.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved '),
          new InlineCode('<dl>'),
          new PlainText(' elements, though I never used them.'),
        ]))
    })

    specify('Inline NSFL', () => {
      expect(Up.toInlineDocument('I loved my [NSFL: Game Boy], though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new InlineNsfl([
            new PlainText('Game Boy'),
          ]),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Inline NSFW', () => {
      expect(Up.toInlineDocument('I loved my [NSFW: Game Boy], though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new InlineNsfw([
            new PlainText('Game Boy'),
          ]),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Inline spoilers', () => {
      expect(Up.toInlineDocument('I loved my [SPOILER: Game Boy], though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new InlineSpoiler([
            new PlainText('Game Boy'),
          ]),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Inline quotes', () => {
      expect(Up.toInlineDocument('I loved my "Game Boy", though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new InlineQuote([
            new PlainText('Game Boy'),
          ]),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Italic', () => {
      expect(Up.toInlineDocument('I loved my _Game Boy_, though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new Italic([
            new PlainText('Game Boy'),
          ]),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Links', () => {
      expect(Up.toInlineDocument('I loved my [Game Boy] (example.com/gb), though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new Link([
            new PlainText('Game Boy'),
          ], 'https://example.com/gb'),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Naked URLs', () => {
      expect(Up.toInlineDocument('I went to https://nintendo.com and read everything I could find.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I went to '),
          new Link([
            new PlainText('nintendo.com'),
          ], 'https://nintendo.com'),
          new PlainText(' and read everything I could find.')
        ]))
    })

    specify('Parnetheses', () => {
      expect(Up.toInlineDocument('I loved my (Nintendo) Game Boy, though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new NormalParenthetical([
            new PlainText('(Nintendo)'),
          ]),
          new PlainText(' Game Boy, though I never took it with me when I left home.')
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toInlineDocument('I loved my [Nintendo] Game Boy, though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new SquareParenthetical([
            new PlainText('[Nintendo]'),
          ]),
          new PlainText(' Game Boy, though I never took it with me when I left home.')
        ]))
    })

    specify('Revision deletion', () => {
      expect(Up.toInlineDocument('I loved my ~~Nintendo~~ Game Boy, though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new RevisionDeletion([
            new PlainText('Nintendo'),
          ]),
          new PlainText(' Game Boy, though I never took it with me when I left home.')
        ]))
    })

    specify('Revision insertion', () => {
      expect(Up.toInlineDocument('I loved my ++Nintendo++ Game Boy, though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new RevisionInsertion([
            new PlainText('Nintendo'),
          ]),
          new PlainText(' Game Boy, though I never took it with me when I left home.')
        ]))
    })

    specify('Stress', () => {
      expect(Up.toInlineDocument('I loved my **Game Boy**, though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my '),
          new Stress([
            new PlainText('Game Boy'),
          ]),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Video', () => {
      expect(Up.toInlineDocument('Watch this: [video: cricket meowing] (example.com/meow.webm)')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('Watch this: '),
          new Video('cricket meowing', 'https://example.com/meow.webm')
        ]))
    })
  })


  context('Footnotes in inline documents are treated as normal parentheticals. This includes when:', () => {
    specify('A footnote produced by square brackets is at the top level of the document', () => {
      expect(Up.toInlineDocument('I loved my Game Boy [^ from Nintendo], though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my Game Boy '),
          new NormalParenthetical([
            new PlainText('(from Nintendo)')
          ]),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('A footnote produced by parentheses is at the top level of the document', () => {
      expect(Up.toInlineDocument('I loved my Game Boy (^ from Nintendo), though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my Game Boy '),
          new NormalParenthetical([
            new PlainText('(from Nintendo)')
          ]),
          new PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Both kinds of footnotes are at the top level of the document', () => {
      expect(Up.toInlineDocument('I loved my Game Boy [^ from Nintendo], though I never (^ well, maybe once) took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved my Game Boy '),
          new NormalParenthetical([
            new PlainText('(from Nintendo)')
          ]),
          new PlainText(', though I never '),
          new NormalParenthetical([
            new PlainText('(well, maybe once)')
          ]),
          new PlainText(' took it with me when I left home.')
        ]))
    })

    specify('Both kinds of footnotes are nested within other inline conventions', () => {
      expect(Up.toInlineDocument('[SPOILER: *I loved my Game Boy [^ from Nintendo], though I never (^ well, maybe once) took it with me when I left home.*]')).to.deep.equal(
        new InlineUpDocument([
          new InlineSpoiler([
            new Emphasis([
              new PlainText('I loved my Game Boy '),
              new NormalParenthetical([
                new PlainText('(from Nintendo)')
              ]),
              new PlainText(', though I never '),
              new NormalParenthetical([
                new PlainText('(well, maybe once)')
              ]),
              new PlainText(' took it with me when I left home.')
            ])
          ])
        ]))
    })

    specify('A footnote is overlapped by another convention with continuity priority equal to that of parenthetical conventions (and naturally less than that of footnotes)', () => {
      expect(Up.toInlineDocument('I loved **my very own [^ beloved** Nintendo] Game Boy, though I never took it with me when I left home.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('I loved '),
          new Stress([
            new PlainText('my very own '),
            new NormalParenthetical([
              new PlainText('(beloved')
            ])
          ]),
          new NormalParenthetical([
            new PlainText(' Nintendo)')
          ]),
          new PlainText(' Game Boy, though I never took it with me when I left home.')
        ]))
    })
  })


  context('The convention for referencing table of contents entries is totally ignored. The markup is instead treated as a parenthetical of the appropriate bracket type.', () => {
    specify('An otherwise-valid reference indicated by square brackets produces a square parenthetical node', () => {
      expect(Up.toInlineDocument('My favorite section of the textbook [Section: Why Math Is Great] was damaged by water.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('My favorite section of the textbook '),
          new SquareParenthetical([
            new PlainText('[Section: Why Math Is Great]'),
          ]),
          new PlainText(' was damaged by water.')
        ]))
    })

    specify('An otherwise-valid reference indicated by parentheses produces a normal parenthetical node', () => {
      expect(Up.toInlineDocument('My favorite section of the textbook (Section: Why Math Is Great) was damaged by water.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('My favorite section of the textbook '),
          new NormalParenthetical([
            new PlainText('(Section: Why Math Is Great)'),
          ]),
          new PlainText(' was damaged by water.')
        ]))
    })

    specify('Because the convention is ignored, other inline conventions within the brackets are evaluated', () => {
      expect(Up.toInlineDocument('My favorite discussion topic in class [topic: why math *is* great] is no longer allowed.')).to.deep.equal(
        new InlineUpDocument([
          new PlainText('My favorite discussion topic in class '),
          new SquareParenthetical([
            new PlainText('[topic: why math '),
            new Emphasis([new PlainText('is')]),
            new PlainText(' great]'),
          ]),
          new PlainText(' is no longer allowed.')
        ]))
    })
  })
})
