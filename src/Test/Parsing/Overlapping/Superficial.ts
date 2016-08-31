import { expect } from 'chai'
import Up from'../../../index'
import { insideDocumentAndParagraph } from'.././Helpers'
import { Link } from'../../../SyntaxNodes/Link'
import { PlainText } from'../../../SyntaxNodes/PlainText'
import { Emphasis } from'../../../SyntaxNodes/Emphasis'
import { Stress } from'../../../SyntaxNodes/Stress'
import { Bold } from'../../../SyntaxNodes/Bold'
import { Italic } from'../../../SyntaxNodes/Italic'
import { InlineQuote } from'../../../SyntaxNodes/InlineQuote'
import { InlineSpoiler } from'../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfl } from'../../../SyntaxNodes/InlineNsfl'
import { InlineNsfw } from'../../../SyntaxNodes/InlineNsfw'
import { NormalParenthetical } from'../../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from'../../../SyntaxNodes/SquareParenthetical'
import { Highlight } from'../../../SyntaxNodes/Highlight'


context('When most otherwise-nested conventions overlap by only their start delimiters, they nest without being split.', () => {
  context('This includes:', () => {
    specify('Two "freely-splittable" conventions (e.g. stress, italics) overlap a third (e.g. quoted text)', () => {
      expect(Up.toDocument('**_"Hello_ good** friend!" Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineQuote([
            new Stress([
              new Italic([
                new PlainText('Hello')
              ]),
              new PlainText(' good')
            ]),
            new PlainText(' friend!')
          ]),
          new PlainText(' Hi!')
        ]))
    })

    specify('Two "only-split-when-necessary" conventions (e.g. NSFL, link) overlapping a freely-splittable convention (e.g. stress)', () => {
      expect(Up.toDocument('[NSFL: (**Ash)(example.com) is] a friend!** Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Stress([
            new InlineNsfl([
              new Link([
                new PlainText('Ash')
              ], 'https://example.com'),
              new PlainText(' is')
            ]),
            new PlainText(' a friend!')
          ]),
          new PlainText(' Hi!')
        ]))
    })

    specify('Quoted text and italics', () => {
      expect(Up.toDocument('"_Oh" why would you do this?_')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new InlineQuote([
              new PlainText('Oh')
            ]),
            new PlainText(' why would you do this?')
          ])
        ]))
    })

    specify("A link whose content is wrapped in square brackets and emphasis", () => {
      expect(Up.toDocument("*[Yes*, I watched it live](example.com/replay).")).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new Emphasis([
              new PlainText('Yes'),
            ]),
            new PlainText(", I watched it live")
          ], 'https://example.com/replay'),
          new PlainText('.')
        ]))
    })

    specify("Emphasis and a link whose content is wrapped in square brackets and emphasis", () => {
      expect(Up.toDocument("[*Yes, I watched it live](example.com/replay) yesterday*.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Emphasis([
            new Link([
              new PlainText('Yes, I watched it live'),
            ], 'https://example.com/replay'),
            new PlainText(' yesterday')
          ]),
          new PlainText('.')
        ]))
    })
  })


  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.toDocument('"(Oh" why would you do this?)')).to.deep.equal(
        insideDocumentAndParagraph([
          new NormalParenthetical([
            new InlineQuote([
              new PlainText('(Oh')
            ]),
            new PlainText(' why would you do this?)')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toDocument('"[Oh" why would you do this?]')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new InlineQuote([
              new PlainText('[Oh')
            ]),
            new PlainText(' why would you do this?]')
          ])
        ]))
    })
  })
})


context('When most otherwise-nested conventions overlap by only their end delimiters, they nest without being split.', () => {
  context('This includes:', () => {
    specify('Two "freely-splittable" conventions (e.g. stress, italics) being overlapped by a third (e.g. quoted text)', () => {
      expect(Up.toDocument('"Hello **good _friend!"_** Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineQuote([
            new PlainText('Hello '),
            new Stress([
              new PlainText('good '),
              new Italic([
                new PlainText('friend!')
              ])
            ])
          ]),
          new PlainText(' Hi!')
        ]))
    })

    specify('Two conventions (e.g. NSFL, bold) being overlapped by a third with a priority in between the first two (e.g. spoiler)', () => {
      expect(Up.toDocument('(SPOILER: There was another [NSFL: rotten __body)__] Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('There was another '),
            new InlineNsfl([
              new PlainText('rotten '),
              new Bold([
                new PlainText('body')
              ]),
            ]),
          ]),
          new PlainText(' Hi!')
        ]))
    })

    specify('Two "only-split-when-necessary" conventions (e.g. NSFL, NSFW) being overlapped by a freely-splittable convention (e.g. italics)', () => {
      expect(Up.toDocument('_There was another [NSFL: rotten body (NSFW: squish_)] Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new PlainText('There was another '),
            new InlineNsfl([
              new PlainText('rotten body '),
              new InlineNsfw([
                new PlainText('squish')
              ]),
            ]),
          ]),
          new PlainText(' Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping each other', () => {
      expect(Up.toDocument('**There _was (SPOILER: another [NSFL: loud __stomp_**)__]. Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Stress([
            new PlainText('There '),
            new Italic([
              new PlainText('was '),
              new InlineSpoiler([
                new PlainText('another '),
                new InlineNsfl([
                  new PlainText('loud '),
                  new Bold([
                    new PlainText('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new PlainText('. Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping a single freely-splittable convention', () => {
      expect(Up.toDocument('**There _was (SPOILER: another [NSFL: loud __stomp_**)]__. Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Stress([
            new PlainText('There '),
            new Italic([
              new PlainText('was '),
              new InlineSpoiler([
                new PlainText('another '),
                new InlineNsfl([
                  new PlainText('loud '),
                  new Bold([
                    new PlainText('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new PlainText('. Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping a single convention that should only be split when necessary', () => {
      expect(Up.toDocument('**There _was "another [NSFL: loud (SPOILER: stomp_**"]). Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Stress([
            new PlainText('There '),
            new Italic([
              new PlainText('was '),
              new InlineQuote([
                new PlainText('another '),
                new InlineNsfl([
                  new PlainText('loud '),
                  new InlineSpoiler([
                    new PlainText('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new PlainText('. Hi!')
        ]))
    })

    specify("An inline spoiler and a link", () => {
      expect(Up.toDocument('[SPOILER: Mario fell off the platform. (splat])(example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('Mario fell off the platform. '),
            new Link([
              new PlainText('splat')
            ], 'https://example.com')
          ])
        ]))
    })

    specify("A link and an inline spoiler", () => {
      expect(Up.toDocument("(loudly sings [SPOILER: Jigglypuff's Lullaby)(example.com)]")).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('loudly sings '),
            new InlineSpoiler([
              new PlainText("Jigglypuff's Lullaby")
            ])
          ], 'https://example.com')
        ]))
    })

    specify("Emphasis and a link", () => {
      expect(Up.toDocument("*I watched it [live*](example.com/replay)")).to.deep.equal(
        insideDocumentAndParagraph([
          new Emphasis([
            new PlainText('I watched it '),
            new Link([
              new PlainText("live")
            ], 'https://example.com/replay')
          ])
        ]))
    })

    specify("A link and highlighted text", () => {
      expect(Up.toDocument('[Mario fell off the platform. (highlight: splat][example.com/game-over])')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('Mario fell off the platform. '),
            new Highlight([
              new PlainText('splat')
            ])
          ], 'https://example.com/game-over')
        ]))
    })

    specify("Highlighted text and a link", () => {
      expect(Up.toDocument('(highlight: loud [thwomp)](example.com/thwomp)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Highlight([
            new PlainText('loud '),
            new Link([
              new PlainText('thwomp')
            ], 'https://example.com/thwomp')
          ])
        ]))
    })
  })


  context('When the convention closing last is linkified, and when the convention overlapping the linkified convention is linkifiable', () => {
    specify("the convention closing last remains linkified despite being nested inside the linkifiable convention", () => {
      expect(Up.toDocument('(SPOILER: There was another [NSFL: rotten body)] (example.com/rotten) Hi!')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('There was another '),
            new InlineNsfl([
              new Link([
                new PlainText('rotten body'),
              ], 'https://example.com/rotten')
            ]),
          ]),
          new PlainText(' Hi!')
        ]))
    })
  })


  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.toDocument('_Oh (why would you do this?_)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new PlainText('Oh '),
            new NormalParenthetical([
              new PlainText('(why would you do this?')
            ]),
          ]),
          new NormalParenthetical([
            new PlainText(')')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toDocument('"Oh [why would you do this?"]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineQuote([
            new PlainText('Oh '),
            new SquareParenthetical([
              new PlainText('[why would you do this?')
            ]),
          ]),
          new SquareParenthetical([
            new PlainText(']')
          ])
        ]))
    })
  })
})


context('When most conventions completely overlap, they nest perfectly, with the conventions closing last becoming outermost.', () => {
  context('This includes:', () => {
    specify('Italics and stress', () => {
      expect(Up.toDocument('_**Why would you do this?_**')).to.deep.equal(
        insideDocumentAndParagraph([
          new Stress([
            new Italic([
              new PlainText('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('An inline spoiler and emphasis', () => {
      expect(Up.toDocument('[SPOILER: *Why would you do this?]*')).to.deep.equal(
        insideDocumentAndParagraph([
          new Emphasis([
            new InlineSpoiler([
              new PlainText('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('Emphasis and an inline spoiler', () => {
      expect(Up.toDocument('*[SPOILER: Why would you do this?*]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new Emphasis([
              new PlainText('Why would you do this?')
            ])
          ])
        ]))
    })
  })

  specify('Italics and parentheses', () => {
    expect(Up.toDocument('_(Why would you do this?_)')).to.deep.equal(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new Italic([
            new PlainText('(Why would you do this?')
          ]),
          new PlainText(')')
        ])
      ]))
  })

  specify('Quoted text and square brackets', () => {
    expect(Up.toDocument('"[Why would you do this?"]')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new InlineQuote([
            new PlainText('[Why would you do this?')
          ]),
          new PlainText(']')
        ])
      ]))
  })

  specify('Parentheses and italics', () => {
    expect(Up.toDocument('_(Why would you do this?_)')).to.deep.equal(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new Italic([
            new PlainText('(Why would you do this?')
          ]),
          new PlainText(')')
        ])
      ]))
  })

  specify('Square brackets and quoted text', () => {
    expect(Up.toDocument('["Why would you do this?]"')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('['),
          new InlineQuote([
            new PlainText('Why would you do this?]')
          ]),
        ])
      ]))
  })
})


context("When most conventions overlap by only the first convention's end delimiter and the second convention's start delimiter, the conventions are treated as though the first closed before the second", () => {
  context('This includes:', () => {
    specify('Highlightex text and quoted text', () => {
      expect(Up.toDocument('[highlight: Oh "]why would you do this?"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Highlight([
            new PlainText('Oh ')
          ]),
          new InlineQuote([
            new PlainText('why would you do this?')
          ])
        ]))
    })

    specify('A spoiler and a link whose content is wrapped in square brackets', () => {
      expect(Up.toDocument('(SPOILER: Oh [)why would you do this?](example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('Oh ')
          ]),
          new Link([
            new PlainText('why would you do this?')
          ], 'https://example.com')
        ]))
    })

    specify('A link whose content is wrapped in square brackets and quoted text', () => {
      expect(Up.toDocument('[Well, well, "](example.com) why would you do this?"')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('Well, well, ')
          ], 'https://example.com'),
          new InlineQuote([
            new PlainText(' why would you do this?')
          ])
        ]))
    })
  })

  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.toDocument('_Oh (_why would you do this?)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Italic([
            new PlainText('Oh '),
            new NormalParenthetical([
              new PlainText('(')
            ]),
          ]),
          new NormalParenthetical([
            new PlainText('why would you do this?)')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toDocument('"Oh ["why would you do this?]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineQuote([
            new PlainText('Oh '),
            new SquareParenthetical([
              new PlainText('[')
            ]),
          ]),
          new SquareParenthetical([
            new PlainText('why would you do this?]')
          ])
        ]))
    })
  })
})
