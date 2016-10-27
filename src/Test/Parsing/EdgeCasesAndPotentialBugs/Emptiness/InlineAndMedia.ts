import { expect } from 'chai'
import * as Up from '../../../../Up'
import { insideDocumentAndParagraph } from '../../Helpers'


context('Most inline conventions are recognized even when they are empty or blank.', () => {
  context('Empty:', () => {
    specify('Inline revealables', () => {
      expect(Up.parse('[SPOILER:]')).to.eql(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([])
        ]))
    })

    specify('Section links', () => {
      expect(Up.parse('[topic:]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SectionLink('')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new Up.Footnote([], { referenceNumber: 1 })

      expect(Up.parse('(^)')).to.eql(
        new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('Parentheses', () => {
      expect(Up.parse('()')).to.eql(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.Text('()')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.parse('[]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.Text('[]')
          ])
        ]))
    })

    specify('Example input', () => {
      expect(Up.parse('{}')).to.eql(
        insideDocumentAndParagraph([
          new Up.ExampleInput('')
        ]))
    })
  })


  context('Blank:', () => {
    specify('Inline revealables', () => {
      expect(Up.parse('[SPOILER:  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([])
        ]))
    })

    specify('Section links', () => {
      expect(Up.parse('[section:  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SectionLink('')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new Up.Footnote([], { referenceNumber: 1 })

      expect(Up.parse('(^  \t \t )')).to.eql(
        new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('Example input', () => {
      expect(Up.parse('{  \t  \t }')).to.eql(
        insideDocumentAndParagraph([
          new Up.ExampleInput('')
        ]))
    })
  })
})


context('The opening bracket for parenthetical conventions cannot be followed by whitespace:', () => {
  specify('Normal parentheticals', () => {
    expect(Up.parse('(  \t  \t )')).to.eql(
      insideDocumentAndParagraph([
        new Up.Text('(  \t  \t )')
      ]))
  })

  specify('Square parentheticals', () => {
    expect(Up.parse('[  \t  \t ]')).to.eql(
      insideDocumentAndParagraph([
        new Up.Text('[  \t  \t ]')
      ]))
  })
})


context("Due to syntax for forgiving conventions, they cannot be empty or blank.", () => {
  context('With asterisks:', () => {
    specify('Emphasis', () => {
      // If the asterisks were alone on a line, they would be interpreted as a nested unordered list.
      expect(Up.parse('Stars! * \t \t *')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('Stars! * \t \t *')
        ]))
    })

    specify('Stress', () => {
      expect(Up.parse('**\t  \t**')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('**\t  \t**')
        ]))
    })

    specify('Combined inflection', () => {
      expect(Up.parse('*** \t \t ***')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('*** \t \t ***')
        ]))
    })

    specify('Imbalanced delimiters', () => {
      expect(Up.parse('*****\t  \t***')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('*****\t  \t***')
        ]))
    })


    context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
      specify('1 character', () => {
        expect(Up.parse('*')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('*')
          ]))
      })

      specify('2 characters', () => {
        expect(Up.parse('**')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('**')
          ]))
      })

      specify('3 characters', () => {
        // If the asterisks were alone on a line, they would be interpreted as a thematic break streak.
        expect(Up.parse('Stars! ***')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('Stars! ***')
          ]))
      })

      specify('4 characters', () => {
        // If the asterisks were alone on a line, they would be interpreted as a thematic break streak.
        expect(Up.parse('Stars! ****')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('Stars! ****')
          ]))
      })
    })
  })

  context('With underscores:', () => {
    specify('Italics', () => {
      expect(Up.parse('_ \t \t _')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('_ \t \t _')
        ]))
    })

    specify('Bold', () => {
      expect(Up.parse('__\t  \t__')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('__\t  \t__')
        ]))
    })

    specify('Combined inflection', () => {
      expect(Up.parse('___ \t \t ___')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('___ \t \t ___')
        ]))
    })

    specify('Imbalanced delimiters', () => {
      expect(Up.parse('_____\t  \t___')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('_____\t  \t___')
        ]))
    })


    context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
      specify('1 character', () => {
        expect(Up.parse('_')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('_')
          ]))
      })

      specify('2 characters', () => {
        expect(Up.parse('__')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('__')
          ]))
      })

      specify('3 characters', () => {
        expect(Up.parse('___')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('___')
          ]))
      })

      specify('4 characters', () => {
        expect(Up.parse('____')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('____')
          ]))
      })
    })
  })


  context('With doublequotes (for inline quotes):', () => {
    specify('Surrounded by 1', () => {
      expect(Up.parse('" \t \t "')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('" \t \t "')
        ]))
    })

    specify('Surrounded by 2', () => {
      expect(Up.parse('""\t  \t""')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('""\t  \t""')
        ]))
    })

    specify('Surrounded by 3', () => {
      expect(Up.parse('""" \t \t """')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('""" \t \t """')
        ]))
    })

    specify('Surrounded by 5', () => {
      expect(Up.parse('"""""\t  \t"""')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('"""""\t  \t"""')
        ]))
    })


    context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
      specify('1 character', () => {
        expect(Up.parse('"')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('"')
          ]))
      })

      specify('2 characters', () => {
        expect(Up.parse('""')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('""')
          ]))
      })

      specify('3 characters', () => {
        expect(Up.parse('"""')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('"""')
          ]))
      })

      specify('4 characters', () => {
        expect(Up.parse('""""')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('""""')
          ]))
      })
    })
  })


  context('With equal signs (for highlighting):', () => {
    specify('Surrounded by 2', () => {
      expect(Up.parse('==\t  \t==')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('==\t  \t==')
        ]))
    })

    specify('Surrounded by 3', () => {
      expect(Up.parse('=== \t \t ===')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('=== \t \t ===')
        ]))
    })

    specify('Surrounded by 4', () => {
      expect(Up.parse('==== \t \t ====')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('==== \t \t ====')
        ]))
    })

    specify('Surrounded by 5', () => {
      expect(Up.parse('=====\t  \t===')).to.eql(
        insideDocumentAndParagraph([
          new Up.Text('=====\t  \t===')
        ]))
    })


    context('Umatched delimiters are preserved as plain text. This includes delimiters with a length of...', () => {
      specify('2 characters', () => {
        expect(Up.parse('==')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('==')
          ]))
      })

      specify('3 characters', () => {
        expect(Up.parse('===')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('===')
          ]))
      })

      specify('4 characters', () => {
        expect(Up.parse('====')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('====')
          ]))
      })

      specify('5 characters', () => {
        expect(Up.parse('=====')).to.eql(
          insideDocumentAndParagraph([
            new Up.Text('=====')
          ]))
      })
    })
  })
})


context('When a link has empty or blank content, its URL serves as its content:', () => {
  specify("Empty content", () => {
    expect(Up.parse('()[https://google.com]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('https://google.com')
        ], 'https://google.com'),
      ]))
  })

  it("Blank content", () => {
    expect(Up.parse('[ \t ](ftp://google.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('ftp://google.com')
        ], 'ftp://google.com'),
      ]))
  })
})


context('An otherwise-valid link:', () => {
  describe('With an empty URL', () => {
    it("does not produce a link", () => {
      expect(Up.parse('[*Yggdra Union*][]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.Text('['),
            new Up.Emphasis([
              new Up.Text('Yggdra Union')
            ]),
            new Up.Text(']')
          ]),
          new Up.SquareParenthetical([
            new Up.Text('[]')
          ])
        ]))
    })
  })


  describe('With a blank URL', () => {
    it("does not produce a link", () => {
      expect(Up.parse('[*Yggdra Union*]( \t )')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.Text('['),
            new Up.Emphasis([
              new Up.Text('Yggdra Union')
            ]),
            new Up.Text(']')
          ]),
          new Up.Text('( \t )')
        ]))
    })
  })


  describe('With empty content and an empty URL', () => {
    it('is treated as consecutive empty brackets', () => {
      expect(Up.parse('Hello, [][]!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Hello, '),
          new Up.SquareParenthetical([
            new Up.Text('[]')
          ]),
          new Up.SquareParenthetical([
            new Up.Text('[]')
          ]),
          new Up.Text('!'),
        ]))
    })
  })


  describe('With blank content and a blank URL', () => {
    it('is treated as consecutive blank brackets', () => {
      expect(Up.parse('Beep boop, [ ][\t]!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Beep boop, [ ][\t]!')
        ]))
    })
  })


  describe('with escaped blank content', () => {
    specify('produces a link with its URL as its content', () => {
      expect(Up.parse('[\\ ][https://google.com]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text('https://google.com')
          ], 'https://google.com')
        ]))
    })
  })


  describe('with an escaped blank URL', () => {
    it("does not produce a link", () => {
      expect(Up.parse('[*Yggdra Union*](\\ )')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.Text('['),
            new Up.Emphasis([
              new Up.Text('Yggdra Union')
            ]),
            new Up.Text(']')
          ]),
          new Up.NormalParenthetical([
            new Up.Text('( )')
          ])
        ]))
    })
  })
})


context("When an image's description is empty or blank, its URL serves as its description:", () => {
  specify('Blank', () => {
    expect(Up.parse('[image:][example.com/hauntedhouse.svg]')).to.deep.equal(
      new Up.Document([
        new Up.Image('https://example.com/hauntedhouse.svg', 'https://example.com/hauntedhouse.svg')
      ]))
  })

  specify('Empty', () => {
    expect(Up.parse('[image:\t  ][example.com/hauntedhouse.svg]')).to.deep.equal(
      new Up.Document([
        new Up.Image('https://example.com/hauntedhouse.svg', 'https://example.com/hauntedhouse.svg')
      ]))
  })
})


describe('An otherwise-valid image with an empty URL', () => {
  it("does not produce an image", () => {
    expect(Up.parse('[image: Yggdra Union]()')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[image: Yggdra Union]')
        ]),
        new Up.NormalParenthetical([
          new Up.Text('()')
        ])
      ]))
  })
})


describe('An otherwise-valid image with a blank URL', () => {
  it("does not produce an image", () => {
    expect(Up.parse('[image: Yggdra Union]( \t \t)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[image: Yggdra Union]')
        ]),
        new Up.Text('( \t \t)')
      ]))
  })
})


describe("An otherwise-valid image missing its bracketed URL is treated as bracketed text. This applies when the bracketed description is followed by:", () => {
  specify('Nothing', () => {
    expect(Up.parse('[image: haunted house]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[image: haunted house]')
        ])
      ]))
  })

  specify('Something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
    expect(Up.parse('[image: haunted house] was written on the desk')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[image: haunted house]')
        ]),
        new Up.Text(' was written on the desk')
      ]))
  })

  specify('Something other than a bracketed URL, even when bracketed text eventually follows', () => {
    expect(Up.parse('[image: haunted house] was written on the desk [really]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[image: haunted house]')
        ]),
        new Up.Text(' was written on the desk '),
        new Up.SquareParenthetical([
          new Up.Text('[really]')
        ])
      ]))
  })
})


context("When an audio convention's description is empty or blank, its URL serves as its description", () => {
  specify('Blank', () => {
    expect(Up.parse('[audio:][example.com/hauntedhouse.ogg]')).to.deep.equal(
      new Up.Document([
        new Up.Audio('https://example.com/hauntedhouse.ogg', 'https://example.com/hauntedhouse.ogg')
      ]))
  })

  specify('Empty', () => {
    expect(Up.parse('[audio:\t  ][example.com/hauntedhouse.ogg]')).to.deep.equal(
      new Up.Document([
        new Up.Audio('https://example.com/hauntedhouse.ogg', 'https://example.com/hauntedhouse.ogg')
      ]))
  })
})


describe('An audio convention with an empty URL', () => {
  it("does not produce an audio convention", () => {
    expect(Up.parse('(audio: Yggdra Union)[]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.Text('(audio: Yggdra Union)')
        ]),
        new Up.SquareParenthetical([
          new Up.Text('[]')
        ])
      ]))
  })
})


describe('An otherwise-valid audio convention with an empty URL', () => {
  it("does not produce an audio node", () => {
    expect(Up.parse('[audio: Yggdra Union][ \t \t]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[audio: Yggdra Union]')
        ]),
        new Up.Text('[ \t \t]')
      ]))
  })
})


describe("An otherwise-valid audio convention missing its bracketed URL is treated as bracketed text. This applies when the bracketed description is followed by:", () => {
  specify('Nothing', () => {
    expect(Up.parse('[audio: haunted house]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[audio: haunted house]')
        ])
      ]))
  })

  specify('Something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
    expect(Up.parse('[audio: haunted house] was written on the desk')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[audio: haunted house]')
        ]),
        new Up.Text(' was written on the desk')
      ]))
  })

  specify('Something other than a bracketed URL, even when bracketed text eventually follows', () => {
    expect(Up.parse('[audio: haunted house] was written on the desk [really]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[audio: haunted house]')
        ]),
        new Up.Text(' was written on the desk '),
        new Up.SquareParenthetical([
          new Up.Text('[really]')
        ])
      ]))
  })
})


context("When a video's description is empty or blank, its URL serves as its description:", () => {
  specify('Blank', () => {
    expect(Up.parse('[video:][example.com/hauntedhouse.webm]')).to.deep.equal(
      new Up.Document([
        new Up.Video('https://example.com/hauntedhouse.webm', 'https://example.com/hauntedhouse.webm')
      ]))
  })

  specify('Empty', () => {
    expect(Up.parse('[video:\t  ][example.com/hauntedhouse.webm]')).to.deep.equal(
      new Up.Document([
        new Up.Video('https://example.com/hauntedhouse.webm', 'https://example.com/hauntedhouse.webm')
      ]))
  })
})


describe('An otherwise-valid video with an empty URL', () => {
  it("does not produce a video", () => {
    expect(Up.parse('(video: Yggdra Union)[]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.Text('(video: Yggdra Union)')
        ]),
        new Up.SquareParenthetical([
          new Up.Text('[]')
        ])
      ]))
  })
})


describe('An otherwise-valid video with a blank URL', () => {
  it("does not produce a video", () => {
    expect(Up.parse('[video: Yggdra Union][ \t \t]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[video: Yggdra Union]')
        ]),
        new Up.Text('[ \t \t]')
      ]))
  })
})


context("An otherwise-valid video missing its bracketed URL is treated as bracketed text. This applies when the bracketed description is followed by:", () => {
  specify('Nothing', () => {
    expect(Up.parse('[video: haunted house]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[video: haunted house]')
        ])
      ]))
  })

  specify('Something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
    expect(Up.parse('[video: haunted house] was written on the desk')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[video: haunted house]')
        ]),
        new Up.Text(' was written on the desk')
      ]))
  })

  specify('Something other than a bracketed URL, even when bracketed text eventually follows', () => {
    expect(Up.parse('[video: haunted house] was written on the desk [really]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[video: haunted house]')
        ]),
        new Up.Text(' was written on the desk '),
        new Up.SquareParenthetical([
          new Up.Text('[really]')
        ])
      ]))
  })
})


context("Conventions aren't linkified if the bracketed URL is...", () => {
  context('Empty:', () => {
    specify('Inline revealables', () => {
      expect(Up.parse('[SPOILER: Ash fights Gary][]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('Ash fights Gary')
          ]),
          new Up.SquareParenthetical([
            new Up.Text('[]')
          ])
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new Up.Footnote([
        new Up.Text('Ash fights Gary')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^ Ash fights Gary]()')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.NormalParenthetical([
              new Up.Text('()')
            ])
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.parse('[audio: Ash fights Gary](example.com/audio)()')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Audio('Ash fights Gary', 'https://example.com/audio'),
          new Up.NormalParenthetical([
            new Up.Text('()')
          ])
        ]))
    })

    specify('Images', () => {
      expect(Up.parse('[image: Ash fights Gary](example.com/image)[]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Image('Ash fights Gary', 'https://example.com/image'),
          new Up.SquareParenthetical([
            new Up.Text('[]')
          ])
        ]))
    })

    specify('Videos', () => {
      expect(Up.parse('[video: Ash fights Gary](example.com/video)[]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('Ash fights Gary', 'https://example.com/video'),
          new Up.SquareParenthetical([
            new Up.Text('[]')
          ])
        ]))
    })
  })


  context('Blank:', () => {
    specify('Inline revealables', () => {
      expect(Up.parse('[SPOILER: Ash fights Gary](\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineRevealable([
            new Up.Text('Ash fights Gary')
          ]),
          new Up.Text('(\t \t \t)')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new Up.Footnote([
        new Up.Text('Ash fights Gary')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^ Ash fights Gary](\t \t \t)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.Text('(\t \t \t)')
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.parse('[audio: Ash fights Gary](example.com/audio)(\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Audio('Ash fights Gary', 'https://example.com/audio'),
          new Up.Text('(\t \t \t)')
        ]))
    })

    specify('Images', () => {
      expect(Up.parse('[image: Ash fights Gary](example.com/image)[\t \t \t]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Image('Ash fights Gary', 'https://example.com/image'),
          new Up.Text('[\t \t \t]')
        ]))
    })

    specify('Videos', () => {
      expect(Up.parse('[video: Ash fights Gary](example.com/video)(\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('Ash fights Gary', 'https://example.com/video'),
          new Up.Text('(\t \t \t)')
        ]))
    })
  })
})


describe('An inline revealable convention with escaped blank content', () => {
  it('produces an inline revealable node containing its content (whitespace)', () => {
    expect(Up.parse("The moral of this severely exciting, enriching story is [SPOILER:\\  ]. I hope it didn't take you too long to read it.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('The moral of this severely exciting, enriching story is '),
        new Up.InlineRevealable([
          new Up.Text('  ')
        ]),
        new Up.Text(". I hope it didn't take you too long to read it.")
      ]))
  })
})


describe('An otherwise-linified revealable convention with escaped blank content', () => {
  it("is not linkified. Instead, the bracketed URL is treated as the appropriate bracketed convention", () => {
    expect(Up.parse("On Professor Oak's right arm is a tattoo of [NSFW: a naked Mr. Mime](\\ )")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text("On Professor Oak's right arm is a tattoo of "),
        new Up.InlineRevealable([
          new Up.Text('a naked Mr. Mime')
        ]),
        new Up.NormalParenthetical([
          new Up.Text('( )')
        ])
      ]))
  })
})
