import { expect } from 'chai'
import { Up } from '../../../../Up'
import { insideDocumentAndParagraph } from '../../Helpers'
import { Document } from '../../../../SyntaxNodes/Document'
import { Paragraph } from '../../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../../SyntaxNodes/PlainText'
import { Link } from '../../../../SyntaxNodes/Link'
import { Emphasis } from '../../../../SyntaxNodes/Emphasis'
import { NormalParenthetical } from '../../../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../../../SyntaxNodes/SquareParenthetical'
import { Footnote } from '../../../../SyntaxNodes/Footnote'
import { Image } from '../../../../SyntaxNodes/Image'
import { Audio } from '../../../../SyntaxNodes/Audio'
import { Video } from '../../../../SyntaxNodes/Video'
import { Highlight } from '../../../../SyntaxNodes/Highlight'
import { InlineNsfw } from '../../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../../SyntaxNodes/InlineNsfl'
import { InlineSpoiler } from '../../../../SyntaxNodes/InlineSpoiler'
import { SectionLink } from '../../../../SyntaxNodes/SectionLink'
import { FootnoteBlock } from '../../../../SyntaxNodes/FootnoteBlock'


context('Inline conventions are not recognized if they are empty or blank.', () => {
  context('Empty:', () => {
    specify('Highlights', () => {
      expect(Up.parse('[highlight:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[highlight:]')
          ])
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.parse('[SPOILER:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[SPOILER:]')
          ])
        ]))
    })

    specify('NSFW', () => {
      expect(Up.parse('[NSFW:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[NSFW:]')
          ])
        ]))
    })

    specify('NSFL', () => {
      expect(Up.parse('[NSFL:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[NSFL:]')
          ])
        ]))
    })

    specify('Section links', () => {
      expect(Up.parse('[topic:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[topic:]')
          ])
        ]))
    })

    specify('Footnotes', () => {
      expect(Up.parse('(^)')).to.eql(
        insideDocumentAndParagraph([
          new NormalParenthetical([
            new PlainText('(^)')
          ])
        ]))
    })

    specify('Parentheses', () => {
      expect(Up.parse('()')).to.eql(
        insideDocumentAndParagraph([
          new PlainText('()')
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.parse('[]')).to.eql(
        insideDocumentAndParagraph([
          new PlainText('[]')
        ]))
    })

    specify('Example input', () => {
      expect(Up.parse('[]')).to.eql(
        insideDocumentAndParagraph([
          new PlainText('[]')
        ]))
    })
  })


  context('Blank:', () => {
    specify('Highlights', () => {
      expect(Up.parse('[highlight:  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[highlight:  \t  \t ]')
          ])
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.parse('[SPOILER:  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[SPOILER:  \t  \t ]')
          ])
        ]))
    })

    specify('NSFW', () => {
      expect(Up.parse('(NSFW:  \t  \t )')).to.eql(
        insideDocumentAndParagraph([
          new NormalParenthetical([
            new PlainText('(NSFW:  \t  \t )')
          ])
        ]))
    })

    specify('NSFL', () => {
      expect(Up.parse('[NSFL:  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[NSFL:  \t  \t ]')
          ])
        ]))
    })

    specify('Section links', () => {
      expect(Up.parse('[section:  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[section:  \t  \t ]')
          ])
        ]))
    })

    specify('Footnotes', () => {
      expect(Up.parse('(^  \t \t )')).to.eql(
        insideDocumentAndParagraph([
          new NormalParenthetical([
            new PlainText('(^  \t \t )')
          ])
        ]))
    })

    specify('Parentheses', () => {
      expect(Up.parse('(  \t  \t )')).to.eql(
        insideDocumentAndParagraph([
          new PlainText('(  \t  \t )')
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.parse('[  \t  \t ]')).to.eql(
        insideDocumentAndParagraph([
          new PlainText('[  \t  \t ]')
        ]))
    })

    specify('Example input', () => {
      expect(Up.parse('{  \t  \t }')).to.eql(
        insideDocumentAndParagraph([
          new PlainText('{  \t  \t }')
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
            new PlainText('Stars! * \t \t *')
          ]))
      })

      specify('Stress', () => {
        expect(Up.parse('**\t  \t**')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('**\t  \t**')
          ]))
      })

      specify('Combined inflection', () => {
        expect(Up.parse('*** \t \t ***')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('*** \t \t ***')
          ]))
      })

      specify('Imbalanced delimiters', () => {
        expect(Up.parse('*****\t  \t***')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('*****\t  \t***')
          ]))
      })


      context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
        specify('1 character', () => {
          expect(Up.parse('*')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('*')
            ]))
        })

        specify('2 characters', () => {
          expect(Up.parse('**')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('**')
            ]))
        })

        specify('3 characters', () => {
          // If the asterisks were alone on a line, they would be interpreted as a thematic break streak.
          expect(Up.parse('Stars! ***')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('Stars! ***')
            ]))
        })

        specify('4 characters', () => {
          // If the asterisks were alone on a line, they would be interpreted as a thematic break streak.
          expect(Up.parse('Stars! ****')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('Stars! ****')
            ]))
        })
      })
    })

    context('With underscores:', () => {
      specify('Italics', () => {
        expect(Up.parse('_ \t \t _')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('_ \t \t _')
          ]))
      })

      specify('Bold', () => {
        expect(Up.parse('__\t  \t__')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('__\t  \t__')
          ]))
      })

      specify('Combined inflection', () => {
        expect(Up.parse('___ \t \t ___')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('___ \t \t ___')
          ]))
      })

      specify('Imbalanced delimiters', () => {
        expect(Up.parse('_____\t  \t___')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('_____\t  \t___')
          ]))
      })


      context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
        specify('1 character', () => {
          expect(Up.parse('_')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('_')
            ]))
        })

        specify('2 characters', () => {
          expect(Up.parse('__')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('__')
            ]))
        })

        specify('3 characters', () => {
          expect(Up.parse('___')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('___')
            ]))
        })

        specify('4 characters', () => {
          expect(Up.parse('____')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('____')
            ]))
        })
      })
    })


    context('With doublequotes:', () => {
      specify('Surrounded by 1', () => {
        expect(Up.parse('" \t \t "')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('" \t \t "')
          ]))
      })

      specify('Surrounded by 2', () => {
        expect(Up.parse('""\t  \t""')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('""\t  \t""')
          ]))
      })

      specify('Surrounded by 3', () => {
        expect(Up.parse('""" \t \t """')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('""" \t \t """')
          ]))
      })

      specify('Surrounded by 5', () => {
        expect(Up.parse('"""""\t  \t"""')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('"""""\t  \t"""')
          ]))
      })


      context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
        specify('1 character', () => {
          expect(Up.parse('"')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('"')
            ]))
        })

        specify('2 characters', () => {
          expect(Up.parse('""')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('""')
            ]))
        })

        specify('3 characters', () => {
          expect(Up.parse('"""')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('"""')
            ]))
        })

        specify('4 characters', () => {
          expect(Up.parse('""""')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('""""')
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
          new SquareParenthetical([
            new PlainText('['),
            new Emphasis([
              new PlainText('Yggdra Union')
            ]),
            new PlainText(']')
          ]),
          new PlainText('[]')
        ]))
    })
  })


  describe('with a blank URL', () => {
    it("does not produce a link. Instead, its content is treated as the appropriate bracketed convention, and its blank bracketed URL is treated as normal blank brackets", () => {
      expect(Up.parse('[*Yggdra Union*]( \t )')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('['),
            new Emphasis([
              new PlainText('Yggdra Union')
            ]),
            new PlainText(']')
          ]),
          new PlainText('( \t )')
        ]))
    })
  })


  describe('with empty content', () => {
    it("does not produce a link. Instead, its content is treated as normal empty brackets, and its bracketed URL is treated as the appropriate bracketed convention", () => {
      expect(Up.parse('()[https://google.com]')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('()'),
          new SquareParenthetical([
            new PlainText('['),
            new Link([
              new PlainText('google.com')
            ], 'https://google.com'),
            new PlainText(']')
          ])
        ]))
    })
  })


  describe('with blank content', () => {
    it("does not produce a link. Instead, its content is treated as normal blank brackets, and its bracketed URL is treated as the appropriate bracketed convention", () => {
      expect(Up.parse('[ \t ](https://google.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('[ \t ]'),
          new NormalParenthetical([
            new PlainText('('),
            new Link([
              new PlainText('google.com')
            ], 'https://google.com'),
            new PlainText(')')
          ])
        ]))
    })
  })


  describe('with empty content and an empty URL', () => {
    it('is treated as consecutive empty brackets', () => {
      expect(Up.parse('Hello, [][]!')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Hello, [][]!')
        ]))
    })
  })


  describe('with blank content and a blank URL', () => {
    it('is treated as consecutive blank brackets', () => {
      expect(Up.parse('Beep boop, [ ][\t]!')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Beep boop, [ ][\t]!')
        ]))
    })
  })


  describe('with escaped blank content', () => {
    specify('produces a link with its URL as its content', () => {
      expect(Up.parse('[\\ ][https://google.com]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('https://google.com')
          ], 'https://google.com')
        ]))
    })
  })


  describe('with an escaped blank URL', () => {
    it("does not produce a link. Instead, its content is treated as the appropriate bracketed convention, and its bracketed URL is treated as the appropriate bracketed convention", () => {
      expect(Up.parse('[*Yggdra Union*](\\ )')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('['),
            new Emphasis([
              new PlainText('Yggdra Union')
            ]),
            new PlainText(']')
          ]),
          new NormalParenthetical([
            new PlainText('( )')
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
          new Link([
            new PlainText('image:')
          ], 'http://example.com/hauntedhouse.svg')
        ]))
    })
  })


  describe('An otherwise-valid image with a blank description', () => {
    it('produces a link instead', () => {
      expect(Up.parse('[image:\t  ][http://example.com/hauntedhouse.svg]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('image:\t  ')
          ], 'http://example.com/hauntedhouse.svg')
        ]))
    })
  })


  describe('An otherwise-valid image with an empty URL', () => {
    it("does not produce an image", () => {
      expect(Up.parse('[image: Yggdra Union]()')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[image: Yggdra Union]')
          ]),
          new PlainText('()')
        ]))
    })
  })


  describe('An otherwise-valid image with a blank URL', () => {
    it("does not produce an image", () => {
      expect(Up.parse('[image: Yggdra Union]( \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[image: Yggdra Union]')
          ]),
          new PlainText('( \t \t)')
        ]))
    })
  })


  describe("An otherwise-valid image missing its bracketed URL is treated as bracketed text, not an image. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.parse('[image: haunted house]')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[image: haunted house]')
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.parse('[image: haunted house] was written on the desk')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[image: haunted house]')
          ]),
          new PlainText(' was written on the desk')
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.parse('[image: haunted house] was written on the desk [really]')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[image: haunted house]')
          ]),
          new PlainText(' was written on the desk '),
          new SquareParenthetical([
            new PlainText('[really]')
          ])
        ]))
    })
  })
})


describe('An otherwise-valid audio convention with an empty description', () => {
  it('produces a link instead', () => {
    expect(Up.parse('[audio:][http://example.com/hauntedhouse.ogg]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('audio:')
        ], 'http://example.com/hauntedhouse.ogg')
      ]))
  })


  describe('An otherwise-valid audio convention with a blank description', () => {
    it('produces a link instead', () => {
      expect(Up.parse('[audio:\t  ][http://example.com/hauntedhouse.ogg]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('audio:\t  ')
          ], 'http://example.com/hauntedhouse.ogg')
        ]))
    })
  })


  describe('An audio convention with an empty URL', () => {
    it("does not produce an audio convention", () => {
      expect(Up.parse('(audio: Yggdra Union)[]')).to.deep.equal(
        insideDocumentAndParagraph([
          new NormalParenthetical([
            new PlainText('(audio: Yggdra Union)')
          ]),
          new PlainText('[]')
        ]))
    })
  })


  describe('An otherwise-valid audio convention with an empty URL', () => {
    it("does not produce an audio node", () => {
      expect(Up.parse('[audio: Yggdra Union][ \t \t]')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[audio: Yggdra Union]')
          ]),
          new PlainText('[ \t \t]')
        ]))
    })
  })


  describe("An otherwise-valid audio convention missing its bracketed URL is treated as bracketed text, not An audio convention. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.parse('[audio: haunted house]')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[audio: haunted house]')
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.parse('[audio: haunted house] was written on the desk')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[audio: haunted house]')
          ]),
          new PlainText(' was written on the desk')
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.parse('[audio: haunted house] was written on the desk [really]')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[audio: haunted house]')
          ]),
          new PlainText(' was written on the desk '),
          new SquareParenthetical([
            new PlainText('[really]')
          ])
        ]))
    })
  })
})


describe('An otherwise-valid video with an empty description', () => {
  it('produces a link instead', () => {
    expect(Up.parse('[video:][http://example.com/hauntedhouse.webm]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('video:')
        ], 'http://example.com/hauntedhouse.webm')
      ]))
  })
})


describe('An otherwise-valid video with a blank description', () => {
  it('produces a link instead', () => {
    expect(Up.parse('[video:\t  ][http://example.com/hauntedhouse.webm]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('video:\t  ')
        ], 'http://example.com/hauntedhouse.webm')
      ]))
  })
})


describe('An otherwise-valid video with an empty URL', () => {
  it("does not produce a video", () => {
    expect(Up.parse('(video: Yggdra Union)[]')).to.deep.equal(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('(video: Yggdra Union)')
        ]),
        new PlainText('[]')
      ]))
  })
})


describe('An otherwise-valid video with a blank URL', () => {
  it("does not produce a video", () => {
    expect(Up.parse('[video: Yggdra Union][ \t \t]')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[video: Yggdra Union]')
        ]),
        new PlainText('[ \t \t]')
      ]))
  })
})


context("An otherwise-valid video missing its bracketed URL is treated as bracketed text, not A video. This applies when the bracketed description is followed by...", () => {
  specify('nothing', () => {
    expect(Up.parse('[video: haunted house]')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[video: haunted house]')
        ])
      ]))
  })

  specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
    expect(Up.parse('[video: haunted house] was written on the desk')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[video: haunted house]')
        ]),
        new PlainText(' was written on the desk')
      ]))
  })

  specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
    expect(Up.parse('[video: haunted house] was written on the desk [really]')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[video: haunted house]')
        ]),
        new PlainText(' was written on the desk '),
        new SquareParenthetical([
          new PlainText('[really]')
        ])
      ]))
  })
})


context("Conventions aren't linkified if the bracketed URL is...", () => {
  context('Empty:', () => {
    specify('Highlights', () => {
      expect(Up.parse('[highlight: Ash fights Gary]()')).to.deep.equal(
        insideDocumentAndParagraph([
          new Highlight([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('()')
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.parse('[SPOILER: Ash fights Gary][]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('[]')
        ]))
    })

    specify('NSFW', () => {
      expect(Up.parse('[NSFW: Ash fights Gary]()')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('()')
        ]))
    })

    specify('NSFL', () => {
      expect(Up.parse('[NSFL: Ash fights Gary][]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfl([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('[]')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new Footnote([
        new PlainText('Ash fights Gary')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^ Ash fights Gary]()')).to.deep.equal(
        new Document([
          new Paragraph([
            footnote,
            new PlainText('()')
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.parse('[audio: Ash fights Gary](example.com/audio)()')).to.deep.equal(
        insideDocumentAndParagraph([
          new Audio('Ash fights Gary', 'https://example.com/audio'),
          new PlainText('()')
        ]))
    })

    specify('Images', () => {
      expect(Up.parse('[image: Ash fights Gary](example.com/image)[]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('Ash fights Gary', 'https://example.com/image'),
          new PlainText('[]')
        ]))
    })

    specify('Videos', () => {
      expect(Up.parse('[video: Ash fights Gary](example.com/video)[]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Video('Ash fights Gary', 'https://example.com/video'),
          new PlainText('[]')
        ]))
    })
  })


  context('Blank:', () => {
    specify('Highlights', () => {
      expect(Up.parse('[highlight: Ash fights Gary](\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Highlight([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('(\t \t \t)')
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.parse('[SPOILER: Ash fights Gary](\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('(\t \t \t)')
        ]))
    })

    specify('NSFW', () => {
      expect(Up.parse('[NSFW: Ash fights Gary](\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('(\t \t \t)')
        ]))
    })

    specify('NSFL', () => {
      expect(Up.parse('[NSFL: Ash fights Gary][\t \t \t]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfl([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('[\t \t \t]')
        ]))
    })

    specify('Section links', () => {
      expect(Up.parse('[topic: Ash fights Gary][\t \t \t]')).to.deep.equal(
        insideDocumentAndParagraph([
          new SectionLink('Ash fights Gary'),
          new PlainText('[\t \t \t]')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new Footnote([
        new PlainText('Ash fights Gary')
      ], { referenceNumber: 1 })

      expect(Up.parse('[^ Ash fights Gary](\t \t \t)')).to.deep.equal(
        new Document([
          new Paragraph([
            footnote,
            new PlainText('(\t \t \t)')
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.parse('[audio: Ash fights Gary](example.com/audio)(\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Audio('Ash fights Gary', 'https://example.com/audio'),
          new PlainText('(\t \t \t)')
        ]))
    })

    specify('Images', () => {
      expect(Up.parse('[image: Ash fights Gary](example.com/image)[\t \t \t]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('Ash fights Gary', 'https://example.com/image'),
          new PlainText('[\t \t \t]')
        ]))
    })

    specify('Videos', () => {
      expect(Up.parse('[video: Ash fights Gary](example.com/video)(\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Video('Ash fights Gary', 'https://example.com/video'),
          new PlainText('(\t \t \t)')
        ]))
    })
  })
})


describe('An inline spoiler convention with escaped blank content', () => {
  it('produces an inline spoiler node containing its content (whitespace)', () => {
    expect(Up.parse("The moral of this severely exciting, enriching story is [SPOILER:\\  ]. I hope it didn't take you too long to read it.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('The moral of this severely exciting, enriching story is '),
        new InlineSpoiler([
          new PlainText('  ')
        ]),
        new PlainText(". I hope it didn't take you too long to read it.")
      ]))
  })
})


describe('An otherwise-linkified NSFW convention with escaped blank content', () => {
  it("is not linkified. Instead, the bracketed URL is treated as the appropriate bracketed convention", () => {
    expect(Up.parse("On Professor Oak's right arm is a tattoo of [NSFW: a naked Mr. Mime](\\ )")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("On Professor Oak's right arm is a tattoo of "),
        new InlineNsfw([
          new PlainText('a naked Mr. Mime')
        ]),
        new NormalParenthetical([
          new PlainText('( )')
        ])
      ]))
  })
})
