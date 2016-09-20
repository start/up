import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '.././Helpers'


context('When most otherwise-nested conventions overlap by only their start delimiters, they nest without being split.', () => {
  context('This includes:', () => {
    specify('Two "freely-splittable" conventions (e.g. stress, italics) overlap a third (e.g. quoted text)', () => {
      expect(Up.parse('**_"Hello_ good** friend!" Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
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

    specify('Two "only-split-when-necessary" conventions (e.g. NSFL, link) overlapping a freely-splittable convention (e.g. stress)', () => {
      expect(Up.parse('[NSFL: (**Ash)(example.com) is] a friend!** Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.InlineNsfl([
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

    specify('Quoted text and italics', () => {
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

    specify("A link whose content is wrapped in square brackets and emphasis", () => {
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

    specify("Emphasis and a link whose content is wrapped in square brackets and emphasis", () => {
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
  })


  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.parse('"(Oh" why would you do this?)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.InlineQuote([
              new Up.Text('(Oh')
            ]),
            new Up.Text(' why would you do this?)')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.parse('"[Oh" why would you do this?]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.InlineQuote([
              new Up.Text('[Oh')
            ]),
            new Up.Text(' why would you do this?]')
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
            new Up.Text('Hello '),
            new Up.Stress([
              new Up.Text('good '),
              new Up.Italic([
                new Up.Text('friend!')
              ])
            ])
          ]),
          new Up.Text(' Hi!')
        ]))
    })

    specify('Two conventions (e.g. NSFL, bold) being overlapped by a third with a priority in between the first two (e.g. spoiler)', () => {
      expect(Up.parse('(SPOILER: There was another [NSFL: rotten __body)__] Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Text('There was another '),
            new Up.InlineNsfl([
              new Up.Text('rotten '),
              new Up.Bold([
                new Up.Text('body')
              ]),
            ]),
          ]),
          new Up.Text(' Hi!')
        ]))
    })

    specify('Two "only-split-when-necessary" conventions (e.g. NSFL, NSFW) being overlapped by a freely-splittable convention (e.g. italics)', () => {
      expect(Up.parse('_There was another [NSFL: rotten body (NSFW: squish_)] Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italic([
            new Up.Text('There was another '),
            new Up.InlineNsfl([
              new Up.Text('rotten body '),
              new Up.InlineNsfw([
                new Up.Text('squish')
              ]),
            ]),
          ]),
          new Up.Text(' Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping each other', () => {
      expect(Up.parse('**There _was (SPOILER: another [NSFL: loud __stomp_**)__]. Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.Text('There '),
            new Up.Italic([
              new Up.Text('was '),
              new Up.InlineSpoiler([
                new Up.Text('another '),
                new Up.InlineNsfl([
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

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping a single freely-splittable convention', () => {
      expect(Up.parse('**There _was (SPOILER: another [NSFL: loud __stomp_**)]__. Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.Text('There '),
            new Up.Italic([
              new Up.Text('was '),
              new Up.InlineSpoiler([
                new Up.Text('another '),
                new Up.InlineNsfl([
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

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping a single convention that should only be split when necessary', () => {
      expect(Up.parse('**There _was "another [NSFL: loud (SPOILER: stomp_**"]). Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.Text('There '),
            new Up.Italic([
              new Up.Text('was '),
              new Up.InlineQuote([
                new Up.Text('another '),
                new Up.InlineNsfl([
                  new Up.Text('loud '),
                  new Up.InlineSpoiler([
                    new Up.Text('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new Up.Text('. Hi!')
        ]))
    })

    specify("An inline spoiler and a link", () => {
      expect(Up.parse('[SPOILER: Mario fell off the platform. (splat])(example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Text('Mario fell off the platform. '),
            new Up.Link([
              new Up.Text('splat')
            ], 'https://example.com')
          ])
        ]))
    })

    specify("A link and an inline spoiler", () => {
      expect(Up.parse("(loudly sings [SPOILER: Jigglypuff's Lullaby)(example.com)]")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text('loudly sings '),
            new Up.InlineSpoiler([
              new Up.Text("Jigglypuff's Lullaby")
            ])
          ], 'https://example.com')
        ]))
    })

    specify("Emphasis and a link", () => {
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

    specify("A link and highlighted text", () => {
      expect(Up.parse('[Mario fell off the platform. (highlight: splat][example.com/game-over])')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text('Mario fell off the platform. '),
            new Up.Highlight([
              new Up.Text('splat')
            ])
          ], 'https://example.com/game-over')
        ]))
    })

    specify("Highlighted text and a link", () => {
      expect(Up.parse('(highlight: loud [thwomp)](example.com/thwomp)')).to.deep.equal(
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


  context('When the convention closing last is linkified, and when the convention overlapping the linkified convention is linkifiable,', () => {
    specify("the convention closing last remains linkified despite being nested inside the linkifiable convention", () => {
      expect(Up.parse('(SPOILER: There was another [NSFL: rotten body)] (example.com/rotten) Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Text('There was another '),
            new Up.InlineNsfl([
              new Up.Link([
                new Up.Text('rotten body'),
              ], 'https://example.com/rotten')
            ]),
          ]),
          new Up.Text(' Hi!')
        ]))
    })
  })


  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
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

    specify('Square brackets', () => {
      expect(Up.parse('"Oh [why would you do this?"]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineQuote([
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
})


context('When most conventions completely overlap, they nest perfectly, with the conventions closing last becoming outermost.', () => {
  context('This includes:', () => {
    specify('Italics and stress', () => {
      expect(Up.parse('_**Why would you do this?_**')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Stress([
            new Up.Italic([
              new Up.Text('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('An inline spoiler and emphasis', () => {
      expect(Up.parse('[SPOILER: *Why would you do this?]*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.InlineSpoiler([
              new Up.Text('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('Emphasis and an inline spoiler', () => {
      expect(Up.parse('*[SPOILER: Why would you do this?*]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Emphasis([
              new Up.Text('Why would you do this?')
            ])
          ])
        ]))
    })
  })

  specify('Italics and parentheses', () => {
    expect(Up.parse('_(Why would you do this?_)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.NormalParenthetical([
            new Up.Text('(Why would you do this?)')
          ]),
        ])
      ]))
  })

  specify('Quoted text and square brackets', () => {
    expect(Up.parse('"[Why would you do this?"]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('['),
          new Up.InlineQuote([
            new Up.Text('Why would you do this?')
          ]),
          new Up.Text(']')
        ])
      ]))
  })

  specify('Parentheses and italics', () => {
    expect(Up.parse('_(Why would you do this?_)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Italic([
            new Up.Text('Why would you do this?')
          ]),
          new Up.Text(')'),
        ])
      ]))
  })

  specify('Square brackets and quoted text', () => {
    expect(Up.parse('["Why would you do this?]"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.SquareParenthetical([
            new Up.Text('[Why would you do this?]')
          ])
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
            new Up.Text('Oh ')
          ]),
          new Up.InlineQuote([
            new Up.Text('why would you do this?')
          ])
        ]))
    })

    specify('A spoiler and a link whose content is wrapped in square brackets', () => {
      expect(Up.parse('(SPOILER: Oh [)why would you do this?](example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Text('Oh ')
          ]),
          new Up.Link([
            new Up.Text('why would you do this?')
          ], 'https://example.com')
        ]))
    })

    specify('A link whose content is wrapped in square brackets and quoted text', () => {
      expect(Up.parse('[Well, well, "](example.com) why would you do this?"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text('Well, well, ')
          ], 'https://example.com'),
          new Up.InlineQuote([
            new Up.Text(' why would you do this?')
          ])
        ]))
    })
  })

  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.parse('[highlight: Oh (]why would you do this?)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
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

    specify('Square brackets', () => {
      expect(Up.parse('(highlight: Oh [)why would you do this?]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
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
