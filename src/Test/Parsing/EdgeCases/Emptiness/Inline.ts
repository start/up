import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph } from '../../Helpers'
import { UpDocument } from '../../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../../SyntaxNodes/Paragraph'
import { RevisionInsertion } from '../../../../SyntaxNodes/RevisionInsertion'
import { RevisionDeletion } from '../../../../SyntaxNodes/RevisionDeletion'
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
import { FootnoteBlock } from '../../../../SyntaxNodes/FootnoteBlock'


context('Most inline conventions are not applied if they have no content.', () => {
  context('Specifically:', () => {
    specify('Highlights', () => {
      expect(Up.toDocument('[highlight:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[highlight:]')
          ])
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.toDocument('[SPOILER:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[SPOILER:]')
          ])
        ]))
    })

    specify('NSFW', () => {
      expect(Up.toDocument('[NSFW:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[NSFW:]')
          ])
        ]))
    })

    specify('NSFL', () => {
      expect(Up.toDocument('[NSFL:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[NSFL:]')
          ])
        ]))
    })

    specify('Footnotes', () => {
      expect(Up.toDocument('(^)')).to.eql(
        insideDocumentAndParagraph([
          new NormalParenthetical([
            new PlainText('(^)')
          ])
        ]))
    })

    specify('Parentheses', () => {
      expect(Up.toDocument('()')).to.eql(
        insideDocumentAndParagraph([
          new PlainText('()')
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toDocument('[]')).to.eql(
        insideDocumentAndParagraph([
          new PlainText('[]')
        ]))
    })

    specify('Input instructions', () => {
      expect(Up.toDocument('{}')).to.eql(
        insideDocumentAndParagraph([
          new PlainText('{}')
        ]))
    })

    specify('Revision insertion', () => {
      // If the revision insertion delimiters were alone on a line, they would be interpreted as a thematic break streak. 
      expect(Up.toDocument('Spiders.++++')).to.eql(
        insideDocumentAndParagraph([
          new PlainText('Spiders.++++')
        ]))
    })

    specify('Revision insertion', () => {
      // If the revision deletion delimiters were alone on a line, they would be interpreted as a thematic break streak.
      expect(Up.toDocument('Spiders.~~~~')).to.eql(
        insideDocumentAndParagraph([
          new PlainText('Spiders.~~~~')
        ]))
    })


    context('Of those conventions, only the revision conventions apply when containing only unescaped whitespace.', () => {
      specify('Revision insertion applies.', () => {
        expect(Up.toDocument('no++ ++one')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('no'),
            new RevisionInsertion([
              new PlainText(' ')
            ]),
            new PlainText('one')
          ]))
      })

      specify('Revision deletion applies.', () => {
        expect(Up.toDocument('e~~ ~~mail')).to.eql(
          insideDocumentAndParagraph([
            new PlainText('e'),
            new RevisionDeletion([
              new PlainText(' ')
            ]),
            new PlainText('mail')
          ]))
      })


      context("These don't:", () => {
        specify('Highlights', () => {
          expect(Up.toDocument('[highlight:  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new SquareParenthetical([
                new PlainText('[highlight:  \t  \t ]')
              ])
            ]))
        })

        specify('Spoilers', () => {
          expect(Up.toDocument('[SPOILER:  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new SquareParenthetical([
                new PlainText('[SPOILER:  \t  \t ]')
              ])
            ]))
        })

        specify('NSFW', () => {
          expect(Up.toDocument('(NSFW:  \t  \t )')).to.eql(
            insideDocumentAndParagraph([
              new NormalParenthetical([
                new PlainText('(NSFW:  \t  \t )')
              ])
            ]))
        })

        specify('NSFL', () => {
          expect(Up.toDocument('[NSFL:  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new SquareParenthetical([
                new PlainText('[NSFL:  \t  \t ]')
              ])
            ]))
        })

        specify('Footnotes', () => {
          expect(Up.toDocument('(^  \t \t )')).to.eql(
            insideDocumentAndParagraph([
              new NormalParenthetical([
                new PlainText('(^  \t \t )')
              ])
            ]))
        })

        specify('Parentheses', () => {
          expect(Up.toDocument('(  \t  \t )')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('(  \t  \t )')
            ]))
        })

        specify('Square brackets', () => {
          expect(Up.toDocument('[  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('[  \t  \t ]')
            ]))
        })

        specify('Input instructions', () => {
          expect(Up.toDocument('{  \t  \t }')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('{  \t  \t }')
            ]))
        })
      })
    })
  })


  context("Due to the nature of the inflection syntax, inflection conventions cannot be empty or blank.", () => {
    context("Delimiters containing only whitespace are preserved as plain text.", () => {
      context('With asterisks:', () => {
        specify('Emphasis', () => {
          // If the asterisks were alone on a line, they would be interpreted as a nested unordered list.
          expect(Up.toDocument('Stars! * \t \t *')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('Stars! * \t \t *')
            ]))
        })

        specify('Stress', () => {
          expect(Up.toDocument('**\t  \t**')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('**\t  \t**')
            ]))
        })

        specify('Combined inflection', () => {
          expect(Up.toDocument('*** \t \t ***')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('*** \t \t ***')
            ]))
        })

        specify('Imbalanced delimiters', () => {
          expect(Up.toDocument('*****\t  \t***')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('*****\t  \t***')
            ]))
        })


        context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
          specify('1 character', () => {
            expect(Up.toDocument('*')).to.eql(
              insideDocumentAndParagraph([
                new PlainText('*')
              ]))
          })

          specify('2 characters', () => {
            expect(Up.toDocument('**')).to.eql(
              insideDocumentAndParagraph([
                new PlainText('**')
              ]))
          })

          specify('3 characters', () => {
            // If the asterisks were alone on a line, they would be interpreted as a thematic break streak.
            expect(Up.toDocument('Stars! ***')).to.eql(
              insideDocumentAndParagraph([
                new PlainText('Stars! ***')
              ]))
          })

          specify('4 characters', () => {
            // If the asterisks were alone on a line, they would be interpreted as a thematic break streak.
            expect(Up.toDocument('Stars! ****')).to.eql(
              insideDocumentAndParagraph([
                new PlainText('Stars! ****')
              ]))
          })
        })
      })

      context('With underscores:', () => {
        specify('Italics', () => {
          expect(Up.toDocument('_ \t \t _')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('_ \t \t _')
            ]))
        })

        specify('Bold', () => {
          expect(Up.toDocument('__\t  \t__')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('__\t  \t__')
            ]))
        })

        specify('Combined inflection', () => {
          expect(Up.toDocument('___ \t \t ___')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('___ \t \t ___')
            ]))
        })

        specify('Imbalanced delimiters', () => {
          expect(Up.toDocument('_____\t  \t___')).to.eql(
            insideDocumentAndParagraph([
              new PlainText('_____\t  \t___')
            ]))
        })


        context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
          specify('1 character', () => {
            expect(Up.toDocument('_')).to.eql(
              insideDocumentAndParagraph([
                new PlainText('_')
              ]))
          })

          specify('2 characters', () => {
            expect(Up.toDocument('__')).to.eql(
              insideDocumentAndParagraph([
                new PlainText('__')
              ]))
          })

          specify('3 characters', () => {
            expect(Up.toDocument('___')).to.eql(
              insideDocumentAndParagraph([
                new PlainText('___')
              ]))
          })

          specify('4 characters', () => {
            expect(Up.toDocument('____')).to.eql(
              insideDocumentAndParagraph([
                new PlainText('____')
              ]))
          })
        })
      })
    })
  })
})



context('Links are handled a bit differently, because they also have a URL to worry about. An otherwise-valid link...', () => {
  describe('with an empty URL', () => {
    it("does not produce a link. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('[*Yggdra Union*][]')).to.deep.equal(
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
      expect(Up.toDocument('[*Yggdra Union*]( \t )')).to.deep.equal(
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
      expect(Up.toDocument('()[https://google.com]')).to.deep.equal(
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
      expect(Up.toDocument('[ \t ](https://google.com)')).to.deep.equal(
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
      expect(Up.toDocument('Hello, [][]!')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Hello, [][]!')
        ]))
    })
  })


  describe('with blank content and a blank URL', () => {
    it('is treated as consecutive blank brackets', () => {
      expect(Up.toDocument('Beep boop, [ ][\t]!')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('Beep boop, [ ][\t]!')
        ]))
    })
  })


  describe('with escaped blank content', () => {
    specify('produces a link with its URL as its content', () => {
      expect(Up.toDocument('[\\ ][https://google.com]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('https://google.com')
          ], 'https://google.com')
        ]))
    })
  })


  describe('with an escaped blank URL', () => {
    it("does not produce a link. Instead, its content is treated as the appropriate bracketed convention, and its bracketed URL is treated as the appropriate bracketed convention", () => {
      expect(Up.toDocument('[*Yggdra Union*](\\ )')).to.deep.equal(
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


context("Media conventions are handled a bit differently, because they also have URL.", () => {
  describe('An image with an empty description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[image:][http://example.com/hauntedhouse.svg]')).to.deep.equal(
        new UpDocument([
          new Image('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
        ]))
    })
  })


  describe('An image with a blank description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[image:\t  ][http://example.com/hauntedhouse.svg]')).to.deep.equal(
        new UpDocument([
          new Image('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
        ]))
    })
  })


  describe('An image with an empty URL', () => {
    it("does not produce an image. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('[image: Yggdra Union]{}')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[image: Yggdra Union]')
          ]),
          new PlainText('{}')
        ]))
    })
  })


  describe('An image with a blank URL', () => {
    it("does not produce an image. Instead, its content is treated as the appropriate bracketed convention, and its blank bracketed URL is treated as normal blank brackets", () => {
      expect(Up.toDocument('[image: Yggdra Union]{ \t \t}')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[image: Yggdra Union]')
          ]),
          new PlainText('{ \t \t}')
        ]))
    })
  })


  describe("An otherwise-valid image missing its bracketed URL is treated as bracketed text, not an image. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.toDocument('[image: haunted house]')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new SquareParenthetical([
              new PlainText('[image: haunted house]')
            ])
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.toDocument('[image: haunted house] was written on the desk')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new SquareParenthetical([
              new PlainText('[image: haunted house]')
            ]),
            new PlainText(' was written on the desk')
          ])
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.toDocument('[image: haunted house] was written on the desk [really]')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new SquareParenthetical([
              new PlainText('[image: haunted house]')
            ]),
            new PlainText(' was written on the desk '),
            new SquareParenthetical([
              new PlainText('[really]')
            ]),
          ])
        ]))
    })
  })


  describe('An audio convention with an empty description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[audio:][http://example.com/hauntedhouse.ogg]')).to.deep.equal(
        new UpDocument([
          new Audio('http://example.com/hauntedhouse.ogg', 'http://example.com/hauntedhouse.ogg')
        ]))
    })
  })


  describe('An audio convention with a blank description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[audio:\t  ][http://example.com/hauntedhouse.ogg]')).to.deep.equal(
        new UpDocument([
          new Audio('http://example.com/hauntedhouse.ogg', 'http://example.com/hauntedhouse.ogg')
        ]))
    })
  })


  describe('An audio convention with an empty URL', () => {
    it("does not produce An audio convention. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('(audio: Yggdra Union){}')).to.deep.equal(
        insideDocumentAndParagraph([
          new NormalParenthetical([
            new PlainText('(audio: Yggdra Union)')
          ]),
          new PlainText('{}')
        ]))
    })
  })


  describe('An audio convention with an empty URL', () => {
    it("does not produce an audio convention. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('[audio: Yggdra Union]{ \t \t}')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[audio: Yggdra Union]')
          ]),
          new PlainText('{ \t \t}')
        ]))
    })
  })


  describe("An otherwise-valid audio convention missing its bracketed URL is treated as bracketed text, not An audio convention. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.toDocument('[audio: haunted house]')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new SquareParenthetical([
              new PlainText('[audio: haunted house]')
            ])
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.toDocument('[audio: haunted house] was written on the desk')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new SquareParenthetical([
              new PlainText('[audio: haunted house]')
            ]),
            new PlainText(' was written on the desk')
          ])
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.toDocument('[audio: haunted house] was written on the desk [really]')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new SquareParenthetical([
              new PlainText('[audio: haunted house]')
            ]),
            new PlainText(' was written on the desk '),
            new SquareParenthetical([
              new PlainText('[really]')
            ]),
          ])
        ]))
    })
  })


  describe('A video with an empty description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[video:][http://example.com/hauntedhouse.webm]')).to.deep.equal(
        new UpDocument([
          new Video('http://example.com/hauntedhouse.webm', 'http://example.com/hauntedhouse.webm')
        ]))
    })
  })


  describe('A video with a blank description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[video:\t  ][http://example.com/hauntedhouse.webm]')).to.deep.equal(
        new UpDocument([
          new Video('http://example.com/hauntedhouse.webm', 'http://example.com/hauntedhouse.webm')
        ]))
    })
  })


  describe('A video with an empty URL', () => {
    it("does not produce A video. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('(video: Yggdra Union){}')).to.deep.equal(
        insideDocumentAndParagraph([
          new NormalParenthetical([
            new PlainText('(video: Yggdra Union)')
          ]),
          new PlainText('{}')
        ]))
    })
  })


  describe('An audio convention with a blank URL', () => {
    it("does not produce a video. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('[video: Yggdra Union]{ \t \t}')).to.deep.equal(
        insideDocumentAndParagraph([
          new SquareParenthetical([
            new PlainText('[video: Yggdra Union]')
          ]),
          new PlainText('{ \t \t}')
        ]))
    })
  })


  describe("An otherwise-valid video missing its bracketed URL is treated as bracketed text, not A video. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.toDocument('[video: haunted house]')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new SquareParenthetical([
              new PlainText('[video: haunted house]')
            ])
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.toDocument('[video: haunted house] was written on the desk')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new SquareParenthetical([
              new PlainText('[video: haunted house]')
            ]),
            new PlainText(' was written on the desk')
          ])
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.toDocument('[video: haunted house] was written on the desk [really]')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new SquareParenthetical([
              new PlainText('[video: haunted house]')
            ]),
            new PlainText(' was written on the desk '),
            new SquareParenthetical([
              new PlainText('[really]')
            ]),
          ])
        ]))
    })
  })
})


context("Conventions aren't linkified if the bracketed URL is...", () => {
  context('Empty:', () => {
    specify('highlight', () => {
      expect(Up.toDocument('[highlight: Ash fights Gary]()')).to.deep.equal(
        insideDocumentAndParagraph([
          new Highlight([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('()')
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.toDocument('[SPOILER: Ash fights Gary]{}')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('{}')
        ]))
    })

    specify('NSFW', () => {
      expect(Up.toDocument('[NSFW: Ash fights Gary]()')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('()')
        ]))
    })

    specify('NSFL', () => {
      expect(Up.toDocument('[NSFL: Ash fights Gary][]')).to.deep.equal(
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

      expect(Up.toDocument('[^ Ash fights Gary]()')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText('()')
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.toDocument('[audio: Ash fights Gary](example.com/audio)()')).to.deep.equal(
        insideDocumentAndParagraph([
          new Audio('Ash fights Gary', 'https://example.com/audio'),
          new PlainText('()')
        ]))
    })

    specify('Images', () => {
      expect(Up.toDocument('[image: Ash fights Gary](example.com/image)[]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('Ash fights Gary', 'https://example.com/image'),
          new PlainText('[]')
        ]))
    })

    specify('Videos', () => {
      expect(Up.toDocument('[video: Ash fights Gary](example.com/video){}')).to.deep.equal(
        insideDocumentAndParagraph([
          new Video('Ash fights Gary', 'https://example.com/video'),
          new PlainText('{}')
        ]))
    })
  })

  context('Blank:', () => {
    specify('Highlights', () => {
      expect(Up.toDocument('[highlight: Ash fights Gary]{\t \t \t}')).to.deep.equal(
        insideDocumentAndParagraph([
          new Highlight([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('{\t \t \t}')
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.toDocument('[SPOILER: Ash fights Gary]{\t \t \t}')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('{\t \t \t}')
        ]))
    })

    specify('NSFW', () => {
      expect(Up.toDocument('[NSFW: Ash fights Gary](\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('(\t \t \t)')
        ]))
    })

    specify('NSFL', () => {
      expect(Up.toDocument('[NSFL: Ash fights Gary][\t \t \t]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfl([
            new PlainText('Ash fights Gary')
          ]),
          new PlainText('[\t \t \t]')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new Footnote([
        new PlainText('Ash fights Gary')
      ], { referenceNumber: 1 })

      expect(Up.toDocument('[^ Ash fights Gary](\t \t \t)')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            footnote,
            new PlainText('(\t \t \t)')
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.toDocument('[audio: Ash fights Gary](example.com/audio)(\t \t \t)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Audio('Ash fights Gary', 'https://example.com/audio'),
          new PlainText('(\t \t \t)')
        ]))
    })

    specify('Images', () => {
      expect(Up.toDocument('[image: Ash fights Gary](example.com/image)[\t \t \t]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Image('Ash fights Gary', 'https://example.com/image'),
          new PlainText('[\t \t \t]')
        ]))
    })

    specify('Videos', () => {
      expect(Up.toDocument('[video: Ash fights Gary](example.com/video){\t \t \t}')).to.deep.equal(
        insideDocumentAndParagraph([
          new Video('Ash fights Gary', 'https://example.com/video'),
          new PlainText('{\t \t \t}')
        ]))
    })
  })
})


describe('Revision insertion containing an empty revision deletion', () => {
  it('produces a revision insertion convention containing the plain text delimiters of revision deletion', () => {
    expect(Up.toDocument('I built a trail: ++~~~~++')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I built a trail: '),
        new RevisionInsertion([
          new PlainText('~~~~')
        ])
      ]))
  })
})


describe('An inline spoiler convention with escaped blank content', () => {
  it('produces an inline spoiler node containing its content (whitespace)', () => {
    expect(Up.toDocument("The moral of this severely exciting, enriching story is [SPOILER:\\  ]. I hope it didn't take you too long to read it.")).to.deep.equal(
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
    expect(Up.toDocument("On Professor Oak's right arm is a tattoo of [NSFW: a naked Mr. Mime](\\ )")).to.deep.equal(
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
