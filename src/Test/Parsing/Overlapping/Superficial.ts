import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from'.././Helpers'


context('When most otherwise-nested conventions overlap by only their start delimiters, they nest without being split.', () => {
  context('This includes:', () => {
    specify('Two "freely-splittable" conventions (e.g. stress, italics) overlap a third (e.g. quoted text)', () => {
      expect(Up.parse('**_"Hello_ good** friend!" Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.Stress([
              new Up.Italic([
                new Up.PlainText('Hello')
              ]),
              new Up.PlainText(' good')
            ]),
            new Up.PlainText(' friend!')
          ]),
          new Up.PlainText(' Hi!')
        ]))
    })

    specify('Two "only-split-when-necessary" conventions (e.g. NSFL, link) overlapping a freely-splittable convention (e.g. stress)', () => {
      expect(Up.parse('[NSFL: (**Ash)(example.com) is] a friend!** Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.InlineNsfl([
              new Up.Link([
                new Up.PlainText('Ash')
              ], 'https://example.com'),
              new Up.PlainText(' is')
            ]),
            new Up.PlainText(' a friend!')
          ]),
          new Up.PlainText(' Hi!')
        ]))
    })

    specify('Quoted text and italics', () => {
      expect(Up.parse('"_Oh" why would you do this?_')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.InlineQuote([
              new Up.PlainText('Oh')
            ]),
            new Up.PlainText(' why would you do this?')
          ])
        ]))
    })

    specify("A link whose content is wrapped in square brackets and emphasis", () => {
      expect(Up.parse("*[Yes*, I watched it live](example.com/replay).")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Emphasis([
              new Up.PlainText('Yes'),
            ]),
            new Up.PlainText(", I watched it live")
          ], 'https://example.com/replay'),
          new Up.PlainText('.')
        ]))
    })

    specify("Emphasis and a link whose content is wrapped in square brackets and emphasis", () => {
      expect(Up.parse("[*Yes, I watched it live](example.com/replay) yesterday*.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.Link([
              new Up.PlainText('Yes, I watched it live'),
            ], 'https://example.com/replay'),
            new Up.PlainText(' yesterday')
          ]),
          new Up.PlainText('.')
        ]))
    })
  })


  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.parse('"(Oh" why would you do this?)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.InlineQuote([
              new Up.PlainText('(Oh')
            ]),
            new Up.PlainText(' why would you do this?)')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.parse('"[Oh" why would you do this?]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.InlineQuote([
              new Up.PlainText('[Oh')
            ]),
            new Up.PlainText(' why would you do this?]')
          ])
        ]))
    })
  })
})


context('When most otherwise-nested conventions overlap by only their end delimiters, they nest without being split.', () => {
  context('This includes:', () => {
    specify('Two "freely-splittable" conventions (e.g. stress, italics) being overlapped by a third (e.g. quoted text)', () => {
      expect(Up.parse('"Hello **good _friend!"_** Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.PlainText('Hello '),
            new Up.Stress([
              new Up.PlainText('good '),
              new Up.Italic([
                new Up.PlainText('friend!')
              ])
            ])
          ]),
          new Up.PlainText(' Hi!')
        ]))
    })

    specify('Two conventions (e.g. NSFL, bold) being overlapped by a third with a priority in between the first two (e.g. spoiler)', () => {
      expect(Up.parse('(SPOILER: There was another [NSFL: rotten __body)__] Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.PlainText('There was another '),
            new Up.InlineNsfl([
              new Up.PlainText('rotten '),
              new Up.Bold([
                new Up.PlainText('body')
              ]),
            ]),
          ]),
          new Up.PlainText(' Hi!')
        ]))
    })

    specify('Two "only-split-when-necessary" conventions (e.g. NSFL, NSFW) being overlapped by a freely-splittable convention (e.g. italics)', () => {
      expect(Up.parse('_There was another [NSFL: rotten body (NSFW: squish_)] Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.PlainText('There was another '),
            new Up.InlineNsfl([
              new Up.PlainText('rotten body '),
              new Up.InlineNsfw([
                new Up.PlainText('squish')
              ]),
            ]),
          ]),
          new Up.PlainText(' Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping each other', () => {
      expect(Up.parse('**There _was (SPOILER: another [NSFL: loud __stomp_**)__]. Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.PlainText('There '),
            new Up.Italic([
              new Up.PlainText('was '),
              new Up.InlineSpoiler([
                new Up.PlainText('another '),
                new Up.InlineNsfl([
                  new Up.PlainText('loud '),
                  new Up.Bold([
                    new Up.PlainText('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new Up.PlainText('. Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping a single freely-splittable convention', () => {
      expect(Up.parse('**There _was (SPOILER: another [NSFL: loud __stomp_**)]__. Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.PlainText('There '),
            new Up.Italic([
              new Up.PlainText('was '),
              new Up.InlineSpoiler([
                new Up.PlainText('another '),
                new Up.InlineNsfl([
                  new Up.PlainText('loud '),
                  new Up.Bold([
                    new Up.PlainText('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new Up.PlainText('. Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping a single convention that should only be split when necessary', () => {
      expect(Up.parse('**There _was "another [NSFL: loud (SPOILER: stomp_**"]). Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.PlainText('There '),
            new Up.Italic([
              new Up.PlainText('was '),
              new Up.InlineQuote([
                new Up.PlainText('another '),
                new Up.InlineNsfl([
                  new Up.PlainText('loud '),
                  new Up.InlineSpoiler([
                    new Up.PlainText('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new Up.PlainText('. Hi!')
        ]))
    })

    specify("An inline spoiler and a link", () => {
      expect(Up.parse('[SPOILER: Mario fell off the platform. (splat])(example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.PlainText('Mario fell off the platform. '),
            new Up.Link([
              new Up.PlainText('splat')
            ], 'https://example.com')
          ])
        ]))
    })

    specify("A link and an inline spoiler", () => {
      expect(Up.parse("(loudly sings [SPOILER: Jigglypuff's Lullaby)(example.com)]")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('loudly sings '),
            new Up.InlineSpoiler([
              new Up.PlainText("Jigglypuff's Lullaby")
            ])
          ], 'https://example.com')
        ]))
    })

    specify("Emphasis and a link", () => {
      expect(Up.parse("*I watched it [live*](example.com/replay)")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.PlainText('I watched it '),
            new Up.Link([
              new Up.PlainText("live")
            ], 'https://example.com/replay')
          ])
        ]))
    })

    specify("A link and highlighted text", () => {
      expect(Up.parse('[Mario fell off the platform. (highlight: splat][example.com/game-over])')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('Mario fell off the platform. '),
            new Up.Highlight([
              new Up.PlainText('splat')
            ])
          ], 'https://example.com/game-over')
        ]))
    })

    specify("Highlighted text and a link", () => {
      expect(Up.parse('(highlight: loud [thwomp)](example.com/thwomp)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('loud '),
            new Up.Link([
              new Up.PlainText('thwomp')
            ], 'https://example.com/thwomp')
          ])
        ]))
    })
  })


  context('When the convention closing last is linkified, and when the convention overlapping the linkified convention is linkifiable,', () => {
    specify("the convention closing last remains linkified despite being nested inside the linkifiable convention", () => {
      expect(Up.parse('(SPOILER: There was another [NSFL: rotten body)] (example.com/rotten) Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.PlainText('There was another '),
            new Up.InlineNsfl([
              new Up.Link([
                new Up.PlainText('rotten body'),
              ], 'https://example.com/rotten')
            ]),
          ]),
          new Up.PlainText(' Hi!')
        ]))
    })
  })


  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.parse('_Oh (why would you do this?_)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.PlainText('Oh '),
            new Up.NormalParenthetical([
              new Up.PlainText('(why would you do this?')
            ]),
          ]),
          new Up.NormalParenthetical([
            new Up.PlainText(')')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.parse('"Oh [why would you do this?"]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
            new Up.PlainText('Oh '),
            new Up.SquareParenthetical([
              new Up.PlainText('[why would you do this?')
            ]),
          ]),
          new Up.SquareParenthetical([
            new Up.PlainText(']')
          ])
        ]))
    })
  })
})


context('When most conventions completely overlap, they nest perfectly, with the conventions closing last becoming outermost.', () => {
  context('This includes:', () => {
    specify('Italics and stress', () => {
      expect(Up.parse('_**Why would you do this?_**')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.Italic([
              new Up.PlainText('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('An inline spoiler and emphasis', () => {
      expect(Up.parse('[SPOILER: *Why would you do this?]*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.InlineSpoiler([
              new Up.PlainText('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('Emphasis and an inline spoiler', () => {
      expect(Up.parse('*[SPOILER: Why would you do this?*]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Emphasis([
              new Up.PlainText('Why would you do this?')
            ])
          ])
        ]))
    })
  })

  specify('Italics and parentheses', () => {
    expect(Up.parse('_(Why would you do this?_)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.Italic([
            new Up.PlainText('(Why would you do this?')
          ]),
          new Up.PlainText(')')
        ])
      ]))
  })

  specify('Quoted text and square brackets', () => {
    expect(Up.parse('"[Why would you do this?"]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.InlineQuote([
            new Up.PlainText('[Why would you do this?')
          ]),
          new Up.PlainText(']')
        ])
      ]))
  })

  specify('Parentheses and italics', () => {
    expect(Up.parse('_(Why would you do this?_)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.Italic([
            new Up.PlainText('(Why would you do this?')
          ]),
          new Up.PlainText(')')
        ])
      ]))
  })

  specify('Square brackets and quoted text', () => {
    expect(Up.parse('["Why would you do this?]"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('['),
          new Up.InlineQuote([
            new Up.PlainText('Why would you do this?]')
          ]),
        ])
      ]))
  })
})


context("When most conventions overlap by only the first convention's end delimiter and the second convention's start delimiter, the conventions are treated as though the first closed before the second.", () => {
  context('This includes:', () => {
    specify('Highlightex text and quoted text', () => {
      expect(Up.parse('[highlight: Oh "]why would you do this?"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('Oh ')
          ]),
          new Up.InlineQuote([
            new Up.PlainText('why would you do this?')
          ])
        ]))
    })

    specify('A spoiler and a link whose content is wrapped in square brackets', () => {
      expect(Up.parse('(SPOILER: Oh [)why would you do this?](example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.PlainText('Oh ')
          ]),
          new Up.Link([
            new Up.PlainText('why would you do this?')
          ], 'https://example.com')
        ]))
    })

    specify('A link whose content is wrapped in square brackets and quoted text', () => {
      expect(Up.parse('[Well, well, "](example.com) why would you do this?"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('Well, well, ')
          ], 'https://example.com'),
          new Up.InlineQuote([
            new Up.PlainText(' why would you do this?')
          ])
        ]))
    })
  })

  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.parse('[highlight: Oh (]why would you do this?)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('Oh '),
            new Up.NormalParenthetical([
              new Up.PlainText('(')
            ]),
          ]),
          new Up.NormalParenthetical([
            new Up.PlainText('why would you do this?)')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.parse('(highlight: Oh [)why would you do this?]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('Oh '),
            new Up.SquareParenthetical([
              new Up.PlainText('[')
            ]),
          ]),
          new Up.SquareParenthetical([
            new Up.PlainText('why would you do this?]')
          ])
        ]))
    })
  })
})
