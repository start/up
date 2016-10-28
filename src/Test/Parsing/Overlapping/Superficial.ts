import { expect } from 'chai'
import * as Up from '../../../Up'
import { insideDocumentAndParagraph } from '.././Helpers'


context('When most otherwise-nested conventions overlap by only their start delimiters, they nest without being split. This includes:', () => {
  specify('Two "freely-splittable" conventions (e.g. stress, italics) overlapping a third (e.g. highlighting)', () => {
    expect(Up.parse('**_==Hello_ good** friend!== Hi!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Stress([
            new Up.Italic([
              new Up.Text('Hello')
            ]),
            new Up.Text(' good')
          ]),
          new Up.Text(' friend!')
        ]),
        new Up.Text(' Hi!')
      ]))
  })

  specify('Two "only-split-when-necessary" conventions (e.g. inline revealable, link) overlapping a freely-splittable convention (e.g. stress)', () => {
    expect(Up.parse('[NSFL: (**Ash)(example.com) is] a friend!** Hi!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.InlineRevealable([
            new Up.Link([
              new Up.Text('Ash')
            ], 'https://example.com'),
            new Up.Text(' is')
          ]),
          new Up.Text(' a friend!')
        ]),
        new Up.Text(' Hi!')
      ]))
  })

  specify("Emphasis overlapping a link", () => {
    expect(Up.parse("*[Yes*, I watched it live](example.com/replay).")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Emphasis([
            new Up.Text('Yes'),
          ]),
          new Up.Text(", I watched it live")
        ], 'https://example.com/replay'),
        new Up.Text('.')
      ]))
  })

  specify("A link overlapping epmhasis", () => {
    expect(Up.parse("[*Yes, I watched it live](example.com/replay) yesterday*.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Link([
            new Up.Text('Yes, I watched it live'),
          ], 'https://example.com/replay'),
          new Up.Text(' yesterday')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('Quoted text overlapping italics', () => {
    expect(Up.parse('"_Oh" why would you do this?_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.InlineQuote([
            new Up.Text('Oh')
          ]),
          new Up.Text(' why would you do this?')
        ])
      ]))
  })

  specify('Italics overlapping quoted text', () => {
    expect(Up.parse('_"Oh_ why would you do this?"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Italic([
            new Up.Text('Oh')
          ]),
          new Up.Text(' why would you do this?')
        ])
      ]))
  })


  context('But not parenthetical conventions:', () => {
    specify('Parenthesized text overlapping emphasis', () => {
      expect(Up.parse('(*Oh) why would you do this?*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.Text('('),
            new Up.Emphasis([
              new Up.Text('Oh)')
            ]),
          ]),
          new Up.Emphasis([
            new Up.Text(' why would you do this?')
          ])
        ]))
    })

    specify('Emphasis overlapping parenthesized text', () => {
      expect(Up.parse('*(Oh* why would you do this?)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.Emphasis([
              new Up.Text('(Oh')
            ]),
            new Up.Text(' why would you do this?)')
          ])
        ]))
    })

    specify('Square bracketed text overlapping emphasis', () => {
      expect(Up.parse('[*Oh] why would you do this?*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.Text('['),
            new Up.Emphasis([
              new Up.Text('Oh]')
            ]),
          ]),
          new Up.Emphasis([
            new Up.Text(' why would you do this?')
          ])
        ]))
    })

    specify('Emphasis overlapping square bracketed text', () => {
      expect(Up.parse('*[Oh* why would you do this?]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.Emphasis([
              new Up.Text('[Oh')
            ]),
            new Up.Text(' why would you do this?]')
          ])
        ]))
    })

    specify('Quoted text overlapping parenthesized text', () => {
      expect(Up.parse('"(Oh" why would you do this?)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.InlineQuote([
              new Up.Text('(Oh'),
            ]),
            new Up.Text(' why would you do this?)')
          ])
        ]))
    })

    specify('Parenthesized text overlapping quoted text', () => {
      expect(Up.parse('("Oh) why would you do this?"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.Text('(')
          ]),
          new Up.InlineQuote([
            new Up.NormalParenthetical([
              new Up.Text('Oh)'),
            ]),
            new Up.Text(' why would you do this?')
          ])
        ]))
    })
  })
})


context('When most otherwise-nested conventions overlap by only their end delimiters, they nest without being split.', () => {
  context('This includes:', () => {
    specify('Two "freely-splittable" conventions (e.g. stress, italics) being overlapped by a third (e.g. emphasis)', () => {
      expect(Up.parse('*Hello **good _friend!*_** Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.Text('Hello '),
            new Up.Stress([
              new Up.Text('good '),
              new Up.Italic([
                new Up.Text('friend!')
              ])
            ]),
          ]),
          new Up.Text(' Hi!')
        ]))
    })

    specify('Two conventions (e.g. inline quote, bold) being overlapped by a third with continuity priority in between the first two (e.g. inline revealable)', () => {
      expect(Up.parse('(SPOILER: There was another "rotten __body)__" Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('There was another '),
            new Up.InlineQuote([
              new Up.Text('rotten '),
              new Up.Bold([
                new Up.Text('body')
              ]),
            ]),
          ]),
          new Up.Text(' Hi!')
        ]))
    })

    specify('Two conventions with continuity priority (e.g. inline revealable, quote) being overlapped by a freely-splittable convention (e.g. italics)', () => {
      expect(Up.parse('_There was another [NSFL: rotten body "squish_"] Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.Text('There was another '),
            new Up.InlineRevealable([
              new Up.Text('rotten body '),
              new Up.InlineQuote([
                new Up.Text('squish')
              ]),
            ]),
          ]),
          new Up.Text(' Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some with continuity priority) overlapping each other', () => {
      expect(Up.parse('**There _was (SPOILER: another "loud __stomp_**)__". Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.Text('There '),
            new Up.Italic([
              new Up.Text('was '),
              new Up.InlineRevealable([
                new Up.Text('another '),
                new Up.InlineQuote([
                  new Up.Text('loud '),
                  new Up.Bold([
                    new Up.Text('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new Up.Text('. Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some with continuity priority) overlapping a single freely-splittable convention', () => {
      expect(Up.parse('**There _was "another [NSFL: loud __stomp_**"]__. Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.Text('There '),
            new Up.Italic([
              new Up.Text('was '),
              new Up.InlineQuote([
                new Up.Text('another '),
                new Up.InlineRevealable([
                  new Up.Text('loud '),
                  new Up.Bold([
                    new Up.Text('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new Up.Text('. Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some with continuity priority) overlapping two conventions that should only be split when necessary', () => {
      expect(Up.parse('**There _was __another "loud (SPOILER: stomp_**__"). Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.Text('There '),
            new Up.Italic([
              new Up.Text('was '),
              new Up.Bold([
                new Up.Text('another '),
                new Up.InlineQuote([
                  new Up.Text('loud '),
                  new Up.InlineRevealable([
                    new Up.Text('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new Up.Text('. Hi!')
        ]))
    })

    specify("An inline revealable overlapping a link", () => {
      expect(Up.parse('[SPOILER: Mario fell off the platform. (splat])(example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('Mario fell off the platform. '),
            new Up.Link([
              new Up.Text('splat')
            ], 'https://example.com')
          ])
        ]))
    })

    specify("A link overlapping an inline revealable", () => {
      expect(Up.parse("(loudly sings [SPOILER: Jigglypuff's Lullaby)(example.com)]")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text('loudly sings '),
            new Up.InlineRevealable([
              new Up.Text("Jigglypuff's Lullaby")
            ])
          ], 'https://example.com')
        ]))
    })

    specify("Emphasis overlapping a link", () => {
      expect(Up.parse("*I watched it [live*](example.com/replay)")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.Text('I watched it '),
            new Up.Link([
              new Up.Text("live")
            ], 'https://example.com/replay')
          ])
        ]))
    })

    specify("A link overlapping highlighted text", () => {
      expect(Up.parse('[Mario fell off the platform. ==splat][example.com/game-over]==')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text('Mario fell off the platform. '),
            new Up.Highlight([
              new Up.Text('splat')
            ])
          ], 'https://example.com/game-over')
        ]))
    })

    specify("Highlighted text overlapping a link", () => {
      expect(Up.parse('==loud [thwomp==](example.com/thwomp)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.Text('loud '),
            new Up.Link([
              new Up.Text('thwomp')
            ], 'https://example.com/thwomp')
          ])
        ]))
    })
  })


  context('But not parenthetical conventions:', () => {
    specify('Italics overlapping parenthesized text', () => {
      expect(Up.parse('_Oh (why would you do this?_)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.Text('Oh '),
            new Up.NormalParenthetical([
              new Up.Text('(why would you do this?')
            ]),
          ]),
          new Up.NormalParenthetical([
            new Up.Text(')')
          ])
        ]))
    })

    specify('Italics overlapping square bracketed text', () => {
      expect(Up.parse('_Oh [why would you do this?_]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.Text('Oh '),
            new Up.SquareParenthetical([
              new Up.Text('[why would you do this?')
            ]),
          ]),
          new Up.SquareParenthetical([
            new Up.Text(']')
          ])
        ]))
    })
  })


  context('When the convention closing last is linkified, and when the convention overlapping the linkified convention is linkifiable,', () => {
    specify("the convention closing last remains linkified despite being nested inside the linkifiable convention", () => {
      const footnote =
        new Up.Footnote([
          new Up.Link([
            new Up.Text('rotten vegetable')
          ], 'https://example.com/rotten')
        ], { referenceNumber: 1 })

      expect(Up.parse('(SPOILER: There was another [^ rotten vegetable)] (example.com/rotten) Hi!')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.InlineRevealable([
              new Up.Text('There was another'),
              footnote
            ]),
            new Up.Text(' Hi!')
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })
  })
})


context('When most conventions completely overlap, they nest perfectly, with the conventions closing last becoming outermost.', () => {
  context('This includes:', () => {
    specify('Italics overlapping stress', () => {
      expect(Up.parse('_**Why would you do this?_**')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.Italic([
              new Up.Text('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('An inline revealable overlapping emphasis', () => {
      expect(Up.parse('[SPOILER: *Why would you do this?]*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.InlineRevealable([
              new Up.Text('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('Emphasis overlapping an inline revealable', () => {
      expect(Up.parse('*[SPOILER: Why would you do this?*]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Emphasis([
              new Up.Text('Why would you do this?')
            ])
          ])
        ]))
    })
  })

  specify('Quoted text overlapping italics', () => {
    expect(Up.parse('"_Why would you do this?"_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.InlineQuote([
            new Up.Text('Why would you do this?')
          ]),
        ])
      ]))
  })

  specify('Italics overlapping quoted text', () => {
    expect(Up.parse('_"Why would you do this?_"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Italic([
            new Up.Text('Why would you do this?')
          ]),
        ])
      ]))
  })


  context('But not parenthetical conventions:', () => {
    specify('Parenthesized text overlapping italics', () => {
      expect(Up.parse('(_Why would you do this?)_')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.Text('('),
            new Up.Italic([
              new Up.Text('Why would you do this?)')
            ]),
          ])
        ]))
    })

    specify('Italics overlapping parenthesized text', () => {
      expect(Up.parse('_(Why would you do this?_)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.Italic([
              new Up.Text('(Why would you do this?')
            ]),
            new Up.Text(')')
          ])
        ]))
    })

    specify('Square bracketed text overlapping italics', () => {
      expect(Up.parse('[_Why would you do this?]_')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.Text('['),
            new Up.Italic([
              new Up.Text('Why would you do this?]')
            ])
          ])
        ]))
    })

    specify('Italics overlapping square bracketed text', () => {
      expect(Up.parse('_[Why would you do this?_]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.Italic([
              new Up.Text('[Why would you do this?')
            ]),
            new Up.Text(']'),
          ])
        ]))
    })
  })

  specify('Quoted text overlapping square bracketed text', () => {
    expect(Up.parse('"[Why would you do this?"]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.InlineQuote([
            new Up.Text('[Why would you do this?')
          ]),
          new Up.Text(']')
        ])
      ]))
  })

  specify('Square bracketed text overlapping quoted text', () => {
    expect(Up.parse('["Why would you do this?]"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('['),
          new Up.InlineQuote([
            new Up.Text('Why would you do this?]')
          ]),
        ])
      ]))
  })
})


context("When some conventions overlap by only the first convention's end delimiter and the second convention's start delimiter, the conventions are treated as though the first closed before the second.", () => {
  context('This includes:', () => {
    specify('A link overlapping revealable content', () => {
      expect(Up.parse('(Oh [SPOILER:) (google.com) why would you do this?]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text('Oh ')
          ], 'https://google.com'),
          new Up.InlineRevealable([
            new Up.Text(' why would you do this?')
          ]),
        ]))
    })

    specify('Revealable content overlapping a link', () => {
      expect(Up.parse('(SPOILER: Oh [)why would you do this?](example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('Oh ')
          ]),
          new Up.Link([
            new Up.Text('why would you do this?')
          ], 'https://example.com')
        ]))
    })
  })


  context('Forgiving conventions cannot close directly after another convention opens, but other conventions can close directly after forgiving conventions open:', () => {
    specify('A link overlapping stress', () => {
      expect(Up.parse('[Well, well, **](example.com) why would you do this?**')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text('Well, well, ')
          ], 'https://example.com'),
          new Up.Stress([
            new Up.Text(' why would you do this?')
          ])
        ]))
    })

    specify('An inline revealable convention overlapping highlighted text', () => {
      expect(Up.parse('[SPOILER: Well, well, ==] why would you do this?==')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('Well, well, ')
          ]),
          new Up.Highlight([
            new Up.Text(' why would you do this?')
          ])
        ]))
    })
  })


  context('Parenthetical conventions do not follow this rule:', () => {
    specify('Parenthesized text overlapping an inline revealable', () => {
      expect(Up.parse('(Oh ==) why would you do this?==')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.Text('(Oh '),
            new Up.Highlight([
              new Up.Text(')')
            ]),
          ]),
          new Up.Highlight([
            new Up.Text(' why would you do this?')
          ])
        ]))
    })

    specify('Highlighted text overlapping parenthesized text', () => {
      expect(Up.parse('[SPOILER: Oh (]why would you do this?)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('Oh '),
            new Up.NormalParenthetical([
              new Up.Text('(')
            ]),
          ]),
          new Up.NormalParenthetical([
            new Up.Text('why would you do this?)')
          ])
        ]))
    })

    specify('Square bracketed text overlapping highlights', () => {
      expect(Up.parse('[Oh ==] why would you do this?==')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.Text('[Oh '),
            new Up.Highlight([
              new Up.Text(']')
            ]),
          ]),
          new Up.Highlight([
            new Up.Text(' why would you do this?')
          ])
        ]))
    })

    specify('Highlighted text overlapping square bracketed text', () => {
      expect(Up.parse('(SPOILER: Oh [)why would you do this?]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('Oh '),
            new Up.SquareParenthetical([
              new Up.Text('[')
            ]),
          ]),
          new Up.SquareParenthetical([
            new Up.Text('why would you do this?]')
          ])
        ]))
    })
  })
})
