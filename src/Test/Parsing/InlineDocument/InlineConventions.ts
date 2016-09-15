import { expect } from 'chai'
import Up = require('../../../index')


context('Except for footnotes and internal topic links, every inline convention is supported in inline documents.', () => {
  context('Supported conventions:', () => {
    specify('Audio', () => {
      expect(Up.parseInline('Listen to this: [audio: cricket meowing] (example.com/meow.ogg)')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('Listen to this: '),
          new Up.Audio('cricket meowing', 'https://example.com/meow.ogg')
        ]))
    })

    specify('Bold', () => {
      expect(Up.parseInline('I loved my __Game Boy__, though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.Bold([
            new Up.PlainText('Game Boy'),
          ]),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Emphasis', () => {
      expect(Up.parseInline('I loved my *Game Boy*, though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.Emphasis([
            new Up.PlainText('Game Boy'),
          ]),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Example input', () => {
      expect(Up.parseInline('I loved pressing {A} and {B} on my Game Boy, though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved pressing '),
          new Up.ExampleInput('A'),
          new Up.PlainText(' and '),
          new Up.ExampleInput('B'),
          new Up.PlainText(' on my Game Boy, though I never took it with me when I left home.')
        ]))
    })

    specify('Highlight', () => {
      expect(Up.parseInline('I loved my [highlight: Game Boy], though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.Highlight([
            new Up.PlainText('Game Boy'),
          ]),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Images', () => {
      expect(Up.parseInline('Look at this: [image: cricket sewing] (example.com/sew.ogg)')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('Look at this: '),
          new Up.Image('cricket sewing', 'https://example.com/sew.ogg')
        ]))
    })

    specify('Inline code', () => {
      expect(Up.parseInline('I loved `<dl>` elements, though I never used them.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved '),
          new Up.InlineCode('<dl>'),
          new Up.PlainText(' elements, though I never used them.'),
        ]))
    })

    specify('Inline NSFL', () => {
      expect(Up.parseInline('I loved my [NSFL: Game Boy], though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.InlineNsfl([
            new Up.PlainText('Game Boy'),
          ]),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Inline NSFW', () => {
      expect(Up.parseInline('I loved my [NSFW: Game Boy], though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.InlineNsfw([
            new Up.PlainText('Game Boy'),
          ]),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Inline spoilers', () => {
      expect(Up.parseInline('I loved my [SPOILER: Game Boy], though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.InlineSpoiler([
            new Up.PlainText('Game Boy'),
          ]),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Inline quotes', () => {
      expect(Up.parseInline('I loved my "Game Boy", though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.InlineQuote([
            new Up.PlainText('Game Boy'),
          ]),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Italic', () => {
      expect(Up.parseInline('I loved my _Game Boy_, though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.Italic([
            new Up.PlainText('Game Boy'),
          ]),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Links', () => {
      expect(Up.parseInline('I loved my [Game Boy] (example.com/gb), though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.Link([
            new Up.PlainText('Game Boy'),
          ], 'https://example.com/gb'),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Bare URLs', () => {
      expect(Up.parseInline('I went to https://nintendo.com and read everything I could find.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I went to '),
          new Up.Link([
            new Up.PlainText('nintendo.com'),
          ], 'https://nintendo.com'),
          new Up.PlainText(' and read everything I could find.')
        ]))
    })

    specify('Parnetheses', () => {
      expect(Up.parseInline('I loved my (Nintendo) Game Boy, though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.NormalParenthetical([
            new Up.PlainText('(Nintendo)'),
          ]),
          new Up.PlainText(' Game Boy, though I never took it with me when I left home.')
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.parseInline('I loved my [Nintendo] Game Boy, though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.SquareParenthetical([
            new Up.PlainText('[Nintendo]'),
          ]),
          new Up.PlainText(' Game Boy, though I never took it with me when I left home.')
        ]))
    })

    specify('Stress', () => {
      expect(Up.parseInline('I loved my **Game Boy**, though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my '),
          new Up.Stress([
            new Up.PlainText('Game Boy'),
          ]),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Video', () => {
      expect(Up.parseInline('Watch this: [video: cricket meowing] (example.com/meow.webm)')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('Watch this: '),
          new Up.Video('cricket meowing', 'https://example.com/meow.webm')
        ]))
    })


    context('Typography:', () => {
      specify('En dashes', () => {
        expect(Up.parseInline('Pages 141--145 explain why Abra is the best Pokémon.')).to.deep.equal(
          new Up.InlineDocument([
            new Up.PlainText('Pages 141–145 explain why Abra is the best Pokémon.')
          ]))
      })

      specify('Em dashes', () => {
        expect(Up.parseInline('Yeah---I believe you.')).to.deep.equal(
          new Up.InlineDocument([
            new Up.PlainText('Yeah—I believe you.')
          ]))
      })

      specify('Ellipses', () => {
        expect(Up.parseInline('Yeah... I believe you.')).to.deep.equal(
          new Up.InlineDocument([
            new Up.PlainText('Yeah… I believe you.')
          ]))
      })

      specify('Plus-minus signs', () => {
        expect(Up.parseInline('I would love 10 burgers please, +-9.')).to.deep.equal(
          new Up.InlineDocument([
            new Up.PlainText('I would love 10 burgers please, ±9.')
          ]))
      })
    })
  })


  context('Footnotes in inline documents are treated as normal parentheticals. This includes when:', () => {
    specify('A footnote produced by square brackets is at the top level of the document', () => {
      expect(Up.parseInline('I loved my Game Boy [^ from Nintendo], though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my Game Boy '),
          new Up.NormalParenthetical([
            new Up.PlainText('(from Nintendo)')
          ]),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('A footnote produced by parentheses is at the top level of the document', () => {
      expect(Up.parseInline('I loved my Game Boy (^ from Nintendo), though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my Game Boy '),
          new Up.NormalParenthetical([
            new Up.PlainText('(from Nintendo)')
          ]),
          new Up.PlainText(', though I never took it with me when I left home.')
        ]))
    })

    specify('Both kinds of footnotes are at the top level of the document', () => {
      expect(Up.parseInline('I loved my Game Boy [^ from Nintendo], though I never (^ well, maybe once) took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved my Game Boy '),
          new Up.NormalParenthetical([
            new Up.PlainText('(from Nintendo)')
          ]),
          new Up.PlainText(', though I never '),
          new Up.NormalParenthetical([
            new Up.PlainText('(well, maybe once)')
          ]),
          new Up.PlainText(' took it with me when I left home.')
        ]))
    })

    specify('Both kinds of footnotes are nested within other inline conventions', () => {
      expect(Up.parseInline('[SPOILER: *I loved my Game Boy [^ from Nintendo], though I never (^ well, maybe once) took it with me when I left home.*]')).to.deep.equal(
        new Up.InlineDocument([
          new Up.InlineSpoiler([
            new Up.Emphasis([
              new Up.PlainText('I loved my Game Boy '),
              new Up.NormalParenthetical([
                new Up.PlainText('(from Nintendo)')
              ]),
              new Up.PlainText(', though I never '),
              new Up.NormalParenthetical([
                new Up.PlainText('(well, maybe once)')
              ]),
              new Up.PlainText(' took it with me when I left home.')
            ])
          ])
        ]))
    })

    specify('A footnote is overlapped by another convention with continuity priority equal to that of parenthetical conventions (and naturally less than that of footnotes)', () => {
      expect(Up.parseInline('I loved **my very own [^ beloved** Nintendo] Game Boy, though I never took it with me when I left home.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('I loved '),
          new Up.Stress([
            new Up.PlainText('my very own '),
            new Up.NormalParenthetical([
              new Up.PlainText('(beloved')
            ])
          ]),
          new Up.NormalParenthetical([
            new Up.PlainText(' Nintendo)')
          ]),
          new Up.PlainText(' Game Boy, though I never took it with me when I left home.')
        ]))
    })
  })


  context('Internal topic links are totally ignored. The markup is instead parsed as a parenthetical of the appropriate bracket type.', () => {
    specify('An otherwise-valid reference indicated by square brackets produces a square parenthetical node', () => {
      expect(Up.parseInline('My favorite section of the textbook [Section: Why Math Is Great] was damaged by water.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('My favorite section of the textbook '),
          new Up.SquareParenthetical([
            new Up.PlainText('[Section: Why Math Is Great]'),
          ]),
          new Up.PlainText(' was damaged by water.')
        ]))
    })

    specify('An otherwise-valid reference indicated by parentheses produces a normal parenthetical node', () => {
      expect(Up.parseInline('My favorite section of the textbook (Section: Why Math Is Great) was damaged by water.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('My favorite section of the textbook '),
          new Up.NormalParenthetical([
            new Up.PlainText('(Section: Why Math Is Great)'),
          ]),
          new Up.PlainText(' was damaged by water.')
        ]))
    })

    specify('Because the convention is ignored, other inline conventions within the brackets are evaluated', () => {
      expect(Up.parseInline('My favorite discussion topic in class [topic: why math *is* great] is no longer allowed.')).to.deep.equal(
        new Up.InlineDocument([
          new Up.PlainText('My favorite discussion topic in class '),
          new Up.SquareParenthetical([
            new Up.PlainText('[topic: why math '),
            new Up.Emphasis([new Up.PlainText('is')]),
            new Up.PlainText(' great]'),
          ]),
          new Up.PlainText(' is no longer allowed.')
        ]))
    })
  })
})
