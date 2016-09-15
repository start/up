import { expect } from 'chai'
import * as Up from '../../../../index'
import { insideDocumentAndParagraph } from '../../Helpers'


context('Inline conventions are not recognized if they are empty or blank.', () => {
  context('Empty:', () => {
    specify('Highlights', () => {
      expect(Up.parse('[highlight:]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[highlight:]')
          ])
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.parse('[SPOILER:]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[SPOILER:]')
          ])
        ]))
    })

    specify('NSFW', () => {
      expect(Up.parse('[NSFW:]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[NSFW:]')
          ])
        ]))
    })

    specify('NSFL', () => {
      expect(Up.parse('[NSFL:]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[NSFL:]')
          ])
        ]))
    })

    specify('Section links', () => {
      expect(Up.parse('[topic:]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[topic:]')
          ])
        ]))
    })

    specify('Footnotes', () => {
      expect(Up.parse('(^)')).to.eql(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.PlainText('(^)')
          ])
        ]))
    })

    specify('Parentheses', () => {
      expect(Up.parse('()')).to.eql(
        insideDocumentAndParagraph([
          new Up.PlainText('()')
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.parse('[]')).to.eql(
        insideDocumentAndParagraph([
          new Up.PlainText('[]')
        ]))
    })

    specify('Example input', () => {
      expect(Up.parse('[]')).to.eql(
        insideDocumentAndParagraph([
          new Up.PlainText('[]')
        ]))
    })
  })


  context('Blank:', () => {
    specify('Highlights', () => {
      expect(Up.parse('[highlight:  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[highlight:  \t  \t ]')
          ])
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.parse('[SPOILER:  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[SPOILER:  \t  \t ]')
          ])
        ]))
    })

    specify('NSFW', () => {
      expect(Up.parse('(NSFW:  \t  \t )')).to.eql(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.PlainText('(NSFW:  \t  \t )')
          ])
        ]))
    })

    specify('NSFL', () => {
      expect(Up.parse('[NSFL:  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[NSFL:  \t  \t ]')
          ])
        ]))
    })

    specify('Section links', () => {
      expect(Up.parse('[section:  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[section:  \t  \t ]')
          ])
        ]))
    })

    specify('Footnotes', () => {
      expect(Up.parse('(^  \t \t )')).to.eql(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.PlainText('(^  \t \t )')
          ])
        ]))
    })

    specify('Parentheses', () => {
      expect(Up.parse('(  \t  \t )')).to.eql(
        insideDocumentAndParagraph([
          new Up.PlainText('(  \t  \t )')
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.parse('[  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new Up.PlainText('[  \t  \t ]')
        ]))
    })

    specify('Example input', () => {
      expect(Up.parse('{  \t  \t }')).to.eql(
        insideDocumentAndParagraph([
          new Up.PlainText('{  \t  \t }')
        ]))
    })
  })
})


context("Due to the nature of the inflection syntax, inflection conventions cannot be empty or blank.", () => {
  context("Delimiters containing only whitespace are preserved as plain text.", () => {
    context('With asterisks:', () => {
      specify('Emphasis', () => {
        // If the asterisks were alone on a line, they would be interpreted as a nested unordered list.
        expect(Up.parse('Stars! * \t \t *')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('Stars! * \t \t *')
          ]))
      })

      specify('Stress', () => {
        expect(Up.parse('**\t  \t**')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('**\t  \t**')
          ]))
      })

      specify('Combined inflection', () => {
        expect(Up.parse('*** \t \t ***')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('*** \t \t ***')
          ]))
      })

      specify('Imbalanced delimiters', () => {
        expect(Up.parse('*****\t  \t***')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('*****\t  \t***')
          ]))
      })


      context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
        specify('1 character', () => {
          expect(Up.parse('*')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('*')
            ]))
        })

        specify('2 characters', () => {
          expect(Up.parse('**')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('**')
            ]))
        })

        specify('3 characters', () => {
          // If the asterisks were alone on a line, they would be interpreted as a thematic break streak.
          expect(Up.parse('Stars! ***')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('Stars! ***')
            ]))
        })

        specify('4 characters', () => {
          // If the asterisks were alone on a line, they would be interpreted as a thematic break streak.
          expect(Up.parse('Stars! ****')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('Stars! ****')
            ]))
        })
      })
    })

    context('With underscores:', () => {
      specify('Italics', () => {
        expect(Up.parse('_ \t \t _')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('_ \t \t _')
          ]))
      })

      specify('Bold', () => {
        expect(Up.parse('__\t  \t__')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('__\t  \t__')
          ]))
      })

      specify('Combined inflection', () => {
        expect(Up.parse('___ \t \t ___')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('___ \t \t ___')
          ]))
      })

      specify('Imbalanced delimiters', () => {
        expect(Up.parse('_____\t  \t___')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('_____\t  \t___')
          ]))
      })


      context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
        specify('1 character', () => {
          expect(Up.parse('_')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('_')
            ]))
        })

        specify('2 characters', () => {
          expect(Up.parse('__')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('__')
            ]))
        })

        specify('3 characters', () => {
          expect(Up.parse('___')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('___')
            ]))
        })

        specify('4 characters', () => {
          expect(Up.parse('____')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('____')
            ]))
        })
      })
    })


    context('With doublequotes:', () => {
      specify('Surrounded by 1', () => {
        expect(Up.parse('" \t \t "')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('" \t \t "')
          ]))
      })

      specify('Surrounded by 2', () => {
        expect(Up.parse('""\t  \t""')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('""\t  \t""')
          ]))
      })

      specify('Surrounded by 3', () => {
        expect(Up.parse('""" \t \t """')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('""" \t \t """')
          ]))
      })

      specify('Surrounded by 5', () => {
        expect(Up.parse('"""""\t  \t"""')).to.eql(
          insideDocumentAndParagraph([
            new Up.PlainText('"""""\t  \t"""')
          ]))
      })


      context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
        specify('1 character', () => {
          expect(Up.parse('"')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('"')
            ]))
        })

        specify('2 characters', () => {
          expect(Up.parse('""')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('""')
            ]))
        })

        specify('3 characters', () => {
          expect(Up.parse('"""')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('"""')
            ]))
        })

        specify('4 characters', () => {
          expect(Up.parse('""""')).to.eql(
            insideDocumentAndParagraph([
              new Up.PlainText('""""')
            ]))
        })
      })
    })
  })
})


context('Links are handled a bit differently, because they also have a URL to worry about. An otherwise-valid link...', () => {
  describe('with an empty URL', () => {
    it("does not produce a link. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.parse('[*Yggdra Union*][]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('['),
            new Up.Emphasis([
              new Up.PlainText('Yggdra Union')
            ]),
            new Up.PlainText(']')
          ]),
          new Up.PlainText('[]')
        ]))
    })
  })


  describe('with a blank URL', () => {
    it("does not produce a link. Instead, its content is treated as the appropriate bracketed convention, and its blank bracketed URL is treated as normal blank brackets", () => {
      expect(Up.parse('[*Yggdra Union*]( \t )')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('['),
            new Up.Emphasis([
              new Up.PlainText('Yggdra Union')
            ]),
            new Up.PlainText(']')
          ]),
          new Up.PlainText('( \t )')
        ]))
    })
  })


  describe('with empty content', () => {
    it("does not produce a link. Instead, its content is treated as normal empty brackets, and its bracketed URL is treated as the appropriate bracketed convention", () => {
      expect(Up.parse('()[https://google.com]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('()'),
          new Up.SquareParenthetical([
            new Up.PlainText('['),
            new Up.Link([
              new Up.PlainText('google.com')
            ], 'https://google.com'),
            new Up.PlainText(']')
          ])
        ]))
    })
  })


  describe('with blank content', () => {
    it("does not produce a link. Instead, its content is treated as normal blank brackets, and its bracketed URL is treated as the appropriate bracketed convention", () => {
      expect(Up.parse('[ \t ](https://google.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('[ \t ]'),
          new Up.NormalParenthetical([
            new Up.PlainText('('),
            new Up.Link([
              new Up.PlainText('google.com')
            ], 'https://google.com'),
            new Up.PlainText(')')
          ])
        ]))
    })
  })


  describe('with empty content and an empty URL', () => {
    it('is treated as consecutive empty brackets', () => {
      expect(Up.parse('Hello, [][]!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Hello, [][]!')
        ]))
    })
  })


  describe('with blank content and a blank URL', () => {
    it('is treated as consecutive blank brackets', () => {
      expect(Up.parse('Beep boop, [ ][\t]!')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Beep boop, [ ][\t]!')
        ]))
    })
  })


  describe('with escaped blank content', () => {
    specify('produces a link with its URL as its content', () => {
      expect(Up.parse('[\\ ][https://google.com]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('https://google.com')
          ], 'https://google.com')
        ]))
    })
  })


  describe('with an escaped blank URL', () => {
    it("does not produce a link. Instead, its content is treated as the appropriate bracketed convention, and its bracketed URL is treated as the appropriate bracketed convention", () => {
      expect(Up.parse('[*Yggdra Union*](\\ )')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('['),
            new Up.Emphasis([
              new Up.PlainText('Yggdra Union')
            ]),
            new Up.PlainText(']')
          ]),
          new Up.NormalParenthetical([
            new Up.PlainText('( )')
          ])
        ]))
    })
  })
})


context("Media conventions must have both a URL and a description.", () => {
  describe('An otherwise-valid image with an empty description', () => {
    it('produces a link instead', () => {
      expect(Up.parse('[image:][http://example.com/hauntedhouse.svg]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('image:')
          ], 'http://example.com/hauntedhouse.svg')
        ]))
    })
  })


  describe('An otherwise-valid image with a blank description', () => {
    it('produces a link instead', () => {
      expect(Up.parse('[image:\t  ][http://example.com/hauntedhouse.svg]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('image:\t  ')
          ], 'http://example.com/hauntedhouse.svg')
        ]))
    })
  })


  describe('An otherwise-valid image with an empty URL', () => {
    it("does not produce an image", () => {
      expect(Up.parse('[image: Yggdra Union]()')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[image: Yggdra Union]')
          ]),
          new Up.PlainText('()')
        ]))
    })
  })


  describe('An otherwise-valid image with a blank URL', () => {
    it("does not produce an image", () => {
      expect(Up.parse('[image: Yggdra Union]( \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[image: Yggdra Union]')
          ]),
          new Up.PlainText('( \t \t)')
        ]))
    })
  })


  describe("An otherwise-valid image missing its bracketed URL is treated as bracketed text, not an image. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.parse('[image: haunted house]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[image: haunted house]')
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.parse('[image: haunted house] was written on the desk')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[image: haunted house]')
          ]),
          new Up.PlainText(' was written on the desk')
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.parse('[image: haunted house] was written on the desk [really]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[image: haunted house]')
          ]),
          new Up.PlainText(' was written on the desk '),
          new Up.SquareParenthetical([
            new Up.PlainText('[really]')
          ])
        ]))
    })
  })
})


describe('An otherwise-valid audio convention with an empty description', () => {
  it('produces a link instead', () => {
    expect(Up.parse('[audio:][http://example.com/hauntedhouse.ogg]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('audio:')
        ], 'http://example.com/hauntedhouse.ogg')
      ]))
  })


  describe('An otherwise-valid audio convention with a blank description', () => {
    it('produces a link instead', () => {
      expect(Up.parse('[audio:\t  ][http://example.com/hauntedhouse.ogg]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.PlainText('audio:\t  ')
          ], 'http://example.com/hauntedhouse.ogg')
        ]))
    })
  })


  describe('An audio convention with an empty URL', () => {
    it("does not produce an audio convention", () => {
      expect(Up.parse('(audio: Yggdra Union)[]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.NormalParenthetical([
            new Up.PlainText('(audio: Yggdra Union)')
          ]),
          new Up.PlainText('[]')
        ]))
    })
  })


  describe('An otherwise-valid audio convention with an empty URL', () => {
    it("does not produce an audio node", () => {
      expect(Up.parse('[audio: Yggdra Union][ \t \t]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[audio: Yggdra Union]')
          ]),
          new Up.PlainText('[ \t \t]')
        ]))
    })
  })


  describe("An otherwise-valid audio convention missing its bracketed URL is treated as bracketed text, not An audio convention. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.parse('[audio: haunted house]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[audio: haunted house]')
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.parse('[audio: haunted house] was written on the desk')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[audio: haunted house]')
          ]),
          new Up.PlainText(' was written on the desk')
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.parse('[audio: haunted house] was written on the desk [really]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SquareParenthetical([
            new Up.PlainText('[audio: haunted house]')
          ]),
          new Up.PlainText(' was written on the desk '),
          new Up.SquareParenthetical([
            new Up.PlainText('[really]')
          ])
        ]))
    })
  })
})


describe('An otherwise-valid video with an empty description', () => {
  it('produces a link instead', () => {
    expect(Up.parse('[video:][http://example.com/hauntedhouse.webm]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('video:')
        ], 'http://example.com/hauntedhouse.webm')
      ]))
  })
})


describe('An otherwise-valid video with a blank description', () => {
  it('produces a link instead', () => {
    expect(Up.parse('[video:\t  ][http://example.com/hauntedhouse.webm]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('video:\t  ')
        ], 'http://example.com/hauntedhouse.webm')
      ]))
  })
})


describe('An otherwise-valid video with an empty URL', () => {
  it("does not produce a video", () => {
    expect(Up.parse('(video: Yggdra Union)[]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText('(video: Yggdra Union)')
        ]),
        new Up.PlainText('[]')
      ]))
  })
})


describe('An otherwise-valid video with a blank URL', () => {
  it("does not produce a video", () => {
    expect(Up.parse('[video: Yggdra Union][ \t \t]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('[video: Yggdra Union]')
        ]),
        new Up.PlainText('[ \t \t]')
      ]))
  })
})


context("An otherwise-valid video missing its bracketed URL is treated as bracketed text, not A video. This applies when the bracketed description is followed by...", () => {
  specify('nothing', () => {
    expect(Up.parse('[video: haunted house]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('[video: haunted house]')
        ])
      ]))
  })

  specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
    expect(Up.parse('[video: haunted house] was written on the desk')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('[video: haunted house]')
        ]),
        new Up.PlainText(' was written on the desk')
      ]))
  })

  specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
    expect(Up.parse('[video: haunted house] was written on the desk [really]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('[video: haunted house]')
        ]),
        new Up.PlainText(' was written on the desk '),
        new Up.SquareParenthetical([
          new Up.PlainText('[really]')
        ])
      ]))
  })
})


context("Conventions aren't linkified if the bracketed URL is...", () => {
  context('Empty:', () => {
    specify('Highlights', () => {
      expect(Up.parse('[highlight: Ash fights Gary]()')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('Ash fights Gary')
          ]),
          new Up.PlainText('()')
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.parse('[SPOILER: Ash fights Gary][]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.PlainText('Ash fights Gary')
          ]),
          new Up.PlainText('[]')
        ]))
    })

    specify('NSFW', () => {
      expect(Up.parse('[NSFW: Ash fights Gary]()')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineNsfw([
            new Up.PlainText('Ash fights Gary')
          ]),
          new Up.PlainText('()')
        ]))
    })

    specify('NSFL', () => {
      expect(Up.parse('[NSFL: Ash fights Gary][]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineNsfl([
            new Up.PlainText('Ash fights Gary')
          ]),
          new Up.PlainText('[]')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new Up.Footnote([
        new Up.PlainText('Ash fights Gary')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^ Ash fights Gary]()')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.PlainText('()')
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.parse('[audio: Ash fights Gary](example.com/audio)()')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Audio('Ash fights Gary', 'https://example.com/audio'),
          new Up.PlainText('()')
        ]))
    })

    specify('Images', () => {
      expect(Up.parse('[image: Ash fights Gary](example.com/image)[]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Image('Ash fights Gary', 'https://example.com/image'),
          new Up.PlainText('[]')
        ]))
    })

    specify('Videos', () => {
      expect(Up.parse('[video: Ash fights Gary](example.com/video)[]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('Ash fights Gary', 'https://example.com/video'),
          new Up.PlainText('[]')
        ]))
    })
  })


  context('Blank:', () => {
    specify('Highlights', () => {
      expect(Up.parse('[highlight: Ash fights Gary](\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Highlight([
            new Up.PlainText('Ash fights Gary')
          ]),
          new Up.PlainText('(\t \t \t)')
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.parse('[SPOILER: Ash fights Gary](\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.PlainText('Ash fights Gary')
          ]),
          new Up.PlainText('(\t \t \t)')
        ]))
    })

    specify('NSFW', () => {
      expect(Up.parse('[NSFW: Ash fights Gary](\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineNsfw([
            new Up.PlainText('Ash fights Gary')
          ]),
          new Up.PlainText('(\t \t \t)')
        ]))
    })

    specify('NSFL', () => {
      expect(Up.parse('[NSFL: Ash fights Gary][\t \t \t]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineNsfl([
            new Up.PlainText('Ash fights Gary')
          ]),
          new Up.PlainText('[\t \t \t]')
        ]))
    })

    specify('Section links', () => {
      expect(Up.parse('[topic: Ash fights Gary][\t \t \t]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SectionLink('Ash fights Gary'),
          new Up.PlainText('[\t \t \t]')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new Up.Footnote([
        new Up.PlainText('Ash fights Gary')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^ Ash fights Gary](\t \t \t)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            footnote,
            new Up.PlainText('(\t \t \t)')
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.parse('[audio: Ash fights Gary](example.com/audio)(\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Audio('Ash fights Gary', 'https://example.com/audio'),
          new Up.PlainText('(\t \t \t)')
        ]))
    })

    specify('Images', () => {
      expect(Up.parse('[image: Ash fights Gary](example.com/image)[\t \t \t]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Image('Ash fights Gary', 'https://example.com/image'),
          new Up.PlainText('[\t \t \t]')
        ]))
    })

    specify('Videos', () => {
      expect(Up.parse('[video: Ash fights Gary](example.com/video)(\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Video('Ash fights Gary', 'https://example.com/video'),
          new Up.PlainText('(\t \t \t)')
        ]))
    })
  })
})


describe('An inline spoiler convention with escaped blank content', () => {
  it('produces an inline spoiler node containing its content (whitespace)', () => {
    expect(Up.parse("The moral of this severely exciting, enriching story is [SPOILER:\\  ]. I hope it didn't take you too long to read it.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('The moral of this severely exciting, enriching story is '),
        new Up.InlineSpoiler([
          new Up.PlainText('  ')
        ]),
        new Up.PlainText(". I hope it didn't take you too long to read it.")
      ]))
  })
})


describe('An otherwise-linkified NSFW convention with escaped blank content', () => {
  it("is not linkified. Instead, the bracketed URL is treated as the appropriate bracketed convention", () => {
    expect(Up.parse("On Professor Oak's right arm is a tattoo of [NSFW: a naked Mr. Mime](\\ )")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText("On Professor Oak's right arm is a tattoo of "),
        new Up.InlineNsfw([
          new Up.PlainText('a naked Mr. Mime')
        ]),
        new Up.NormalParenthetical([
          new Up.PlainText('( )')
        ])
      ]))
  })
})
