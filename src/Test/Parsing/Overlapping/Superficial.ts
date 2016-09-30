import { expect } from 'chai'
import * as Up from '../../../Up'
import { insideDocumentAndParagraph } from '.././Helpers'


context('When most otherwise-nested conventions overlap by only their start delimiters, they nest without being split. This includes:', () => {
  specify('Two "freely-splittable" conventions (e.g. stress, italics) overlap a third (e.g. highlighting)', () => {
    expect(Up.parse('**_[highlight: Hello_ good** friend!] Hi!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Stress([
            new Up.Italics([
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

  specify("Emphasis and a link", () => {
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

  specify("A link and epmhasis", () => {
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

  specify('Quoted text and italics', () => {
    expect(Up.parse('"_Oh" why would you do this?_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italics([
          new Up.InlineQuote([
            new Up.Text('Oh')
          ]),
          new Up.Text(' why would you do this?')
        ])
      ]))
  })

  specify('Italics and quoted text', () => {
    expect(Up.parse('_"Oh_ why would you do this?"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Italics([
            new Up.Text('Oh')
          ]),
          new Up.Text(' why would you do this?')
        ])
      ]))
  })


  context('But not parenthetical conventions:', () => {
    specify('Parentheses and emphasis', () => {
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

    specify('Emphasis and parentheses', () => {
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

    specify('Square brackets and emphasis', () => {
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

    specify('Emphasis and square brackets', () => {
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

    specify('Quoted text and parentheses', () => {
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

    specify('Parentheses and quoted text', () => {
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
              new Up.Italics([
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
          new Up.Italics([
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
            new Up.Italics([
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
            new Up.Italics([
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
            new Up.Italics([
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

    specify("An inline revealable and a link", () => {
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

    specify("A link and an inline revealable", () => {
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


  context('But not parenthetical conventions:', () => {
    specify('Italics and parentheses', () => {
      expect(Up.parse('_Oh (why would you do this?_)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italics([
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

    specify('Italics and square brackets', () => {
      expect(Up.parse('_Oh [why would you do this?_]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Italics([
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
      expect(Up.parse('(SPOILER: There was another [highlight: rotten vegetable)] (example.com/rotten) Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('There was another '),
            new Up.Highlight([
              new Up.Link([
                new Up.Text('rotten vegetable'),
              ], 'https://example.com/rotten')
            ]),
          ]),
          new Up.Text(' Hi!')
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
            new Up.Italics([
              new Up.Text('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('An inline revealable and emphasis', () => {
      expect(Up.parse('[SPOILER: *Why would you do this?]*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Emphasis([
            new Up.InlineRevealable([
              new Up.Text('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('Emphasis and an inline revealable', () => {
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

  specify('Quoted text and italics', () => {
    expect(Up.parse('"_Why would you do this?"_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italics([
          new Up.InlineQuote([
            new Up.Text('Why would you do this?')
          ]),
        ])
      ]))
  })

  specify('Italics and quoted text', () => {
    expect(Up.parse('_"Why would you do this?_"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Italics([
            new Up.Text('Why would you do this?')
          ]),
        ])
      ]))
  })


  context('But not parenthetical conventions:', () => {
    specify('Parentheses and italics', () => {
      expect(Up.parse('(_Why would you do this?)_')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.Text('('),
            new Up.Italics([
              new Up.Text('Why would you do this?)')
            ]),
          ])
        ]))
    })

    specify('Italics and parentheses', () => {
      expect(Up.parse('_(Why would you do this?_)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.Italics([
              new Up.Text('(Why would you do this?')
            ]),
            new Up.Text(')')
          ])
        ]))
    })

    specify('Square brackets and italics', () => {
      expect(Up.parse('[_Why would you do this?]_')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.Text('['),
            new Up.Italics([
              new Up.Text('Why would you do this?]')
            ])
          ])
        ]))
    })

    specify('Italics and square brackets', () => {
      expect(Up.parse('_[Why would you do this?_]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.Italics([
              new Up.Text('[Why would you do this?')
            ]),
            new Up.Text(']'),
          ])
        ]))
    })
  })

  specify('Quoted text and square brackets', () => {
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

  specify('Square brackets and quoted text', () => {
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


context("When most conventions overlap by only the first convention's end delimiter and the second convention's start delimiter, the conventions are treated as though the first closed before the second.", () => {
  context('This includes:', () => {
    specify('Highlighted text and italics', () => {
      expect(Up.parse('[highlight: Oh _]why would you do this?_')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.Text('Oh ')
          ]),
          new Up.Italics([
            new Up.Text('why would you do this?')
          ])
        ]))
    })

    specify('A spoiler and a link', () => {
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

    specify('A link whose content is wrapped in square brackets and stress', () => {
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
  })

  specify('Highlight and inline quotes', () => {
    expect(Up.parse('(highlight: Oh ")why would you do this?"')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Text('Oh '),
        ]),
        new Up.InlineQuote([
          new Up.Text('why would you do this?')
        ])
      ]))
  })

  context('But not parenthetical conventions:', () => {
    specify('Parentheses and highlights', () => {
      expect(Up.parse('(Oh [highlight:) why would you do this?]')).to.deep.equal(
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

    specify('Highlighted text and parentheses', () => {
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

    specify('Square brackets and highlights', () => {
      expect(Up.parse('[Oh (highlight:] why would you do this?)')).to.deep.equal(
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

    specify('Highlighted text and square brackets', () => {
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
