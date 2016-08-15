import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph } from '../../Helpers'
import { UpDocument } from '../../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../../SyntaxNodes/ParagraphNode'
import { RevisionInsertionNode } from '../../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../../SyntaxNodes/RevisionDeletionNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../../SyntaxNodes/LinkNode'
import { EmphasisNode } from '../../../../SyntaxNodes/EmphasisNode'
import { NormalParentheticalNode } from '../../../../SyntaxNodes/NormalParentheticalNode'
import { SquareBracketParentheticalNode } from '../../../../SyntaxNodes/SquareBracketParentheticalNode'
import { FootnoteNode } from '../../../../SyntaxNodes/FootnoteNode'
import { ImageNode } from '../../../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../../../SyntaxNodes/VideoNode'
import { HighlightNode } from '../../../../SyntaxNodes/HighlightNode'
import { InlineNsfwNode } from '../../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../../SyntaxNodes/InlineNsflNode'
import { InlineSpoilerNode } from '../../../../SyntaxNodes/InlineSpoilerNode'
import { FootnoteBlockNode } from '../../../../SyntaxNodes/FootnoteBlockNode'


context('Most inline conventions are not applied if they have no content.', () => {
  context('Specifically:', () => {
    specify('Highlights', () => {
      expect(Up.toDocument('[highlight:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareBracketParentheticalNode([
            new PlainTextNode('[highlight:]')
          ])
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.toDocument('[SPOILER:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareBracketParentheticalNode([
            new PlainTextNode('[SPOILER:]')
          ])
        ]))
    })

    specify('NSFW', () => {
      expect(Up.toDocument('[NSFW:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareBracketParentheticalNode([
            new PlainTextNode('[NSFW:]')
          ])
        ]))
    })

    specify('NSFL', () => {
      expect(Up.toDocument('[NSFL:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareBracketParentheticalNode([
            new PlainTextNode('[NSFL:]')
          ])
        ]))
    })

    specify('Footnotes', () => {
      expect(Up.toDocument('(^)')).to.eql(
        insideDocumentAndParagraph([
          new NormalParentheticalNode([
            new PlainTextNode('(^)')
          ])
        ]))
    })

    specify('Parentheses', () => {
      expect(Up.toDocument('()')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('()')
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toDocument('[]')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[]')
        ]))
    })

    specify('Input instructions', () => {
      expect(Up.toDocument('{}')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('{}')
        ]))
    })

    specify('Revision insertion', () => {
      // If the revision insertion delimiters were alone on a line, they would be interpreted as an outline separator streak. 
      expect(Up.toDocument('Spiders.++++')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Spiders.++++')
        ]))
    })

    specify('Revision insertion', () => {
      // If the revision deletion delimiters were alone on a line, they would be interpreted as an outline separator streak.
      expect(Up.toDocument('Spiders.~~~~')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Spiders.~~~~')
        ]))
    })


    context('Of those conventions, only the revision conventions apply when containing only unescaped whitespace.', () => {
      specify('Revision insertion applies.', () => {
        expect(Up.toDocument('no++ ++one')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('no'),
            new RevisionInsertionNode([
              new PlainTextNode(' ')
            ]),
            new PlainTextNode('one')
          ]))
      })

      specify('Revision deletion applies.', () => {
        expect(Up.toDocument('e~~ ~~mail')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('e'),
            new RevisionDeletionNode([
              new PlainTextNode(' ')
            ]),
            new PlainTextNode('mail')
          ]))
      })


      context("These don't:", () => {
        specify('Highlights', () => {
          expect(Up.toDocument('[highlight:  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new SquareBracketParentheticalNode([
                new PlainTextNode('[highlight:  \t  \t ]')
              ])
            ]))
        })

        specify('Spoilers', () => {
          expect(Up.toDocument('[SPOILER:  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new SquareBracketParentheticalNode([
                new PlainTextNode('[SPOILER:  \t  \t ]')
              ])
            ]))
        })

        specify('NSFW', () => {
          expect(Up.toDocument('(NSFW:  \t  \t )')).to.eql(
            insideDocumentAndParagraph([
              new NormalParentheticalNode([
                new PlainTextNode('(NSFW:  \t  \t )')
              ])
            ]))
        })

        specify('NSFL', () => {
          expect(Up.toDocument('[NSFL:  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new SquareBracketParentheticalNode([
                new PlainTextNode('[NSFL:  \t  \t ]')
              ])
            ]))
        })

        specify('Footnotes', () => {
          expect(Up.toDocument('(^  \t \t )')).to.eql(
            insideDocumentAndParagraph([
              new NormalParentheticalNode([
                new PlainTextNode('(^  \t \t )')
              ])
            ]))
        })

        specify('Parentheses', () => {
          expect(Up.toDocument('(  \t  \t )')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('(  \t  \t )')
            ]))
        })

        specify('Square brackets', () => {
          expect(Up.toDocument('[  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('[  \t  \t ]')
            ]))
        })

        specify('Input instructions', () => {
          expect(Up.toDocument('{  \t  \t }')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('{  \t  \t }')
            ]))
        })
      })
    })
  })


  context("Due to the nature of the inflection syntax, inflection conventions cannot be empty or blank.", () => {
    context("Delimiters containing only whitespace are preserved as plain text.", () => {
      context('With asterisks:', () => {
        specify('Emphasis', () => {
          // If the inflection delimiters were alone on a line, they would be interpreted as an unordered list.
          expect(Up.toDocument('Stars! * \t \t *')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('Stars! * \t \t *')
            ]))
        })

        specify('Stress', () => {
          expect(Up.toDocument('Stars! **\t  \t**')).to.eql(
            // If the inflection delimiters were alone on a line, they would be interpreted as an outline separator streak.
            insideDocumentAndParagraph([
              new PlainTextNode('Stars! **\t  \t**')
            ]))
        })

        specify('Shouting (emphasis and stress together)', () => {
          expect(Up.toDocument('Stars! *** \t \t ***')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('Stars! *** \t \t ***')
            ]))
        })

        specify('Shouting with imbalanced delimiters', () => {
          expect(Up.toDocument('Stars! *****\t  \t***')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('Stars! *****\t  \t***')
            ]))
        })
      })

      context('With underscores:', () => {
        specify('Italics', () => {
          // If the inflection delimiters were alone on a line, they would be interpreted as an unordered list.
          expect(Up.toDocument('Stars! _ \t \t _')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('Stars! _ \t \t _')
            ]))
        })

        specify('Bold', () => {
          expect(Up.toDocument('Stars! __\t  \t__')).to.eql(
            // If the inflection delimiters were alone on a line, they would be interpreted as an outline separator streak.
            insideDocumentAndParagraph([
              new PlainTextNode('Stars! __\t  \t__')
            ]))
        })

        specify('Shouting (italics and bold together)', () => {
          expect(Up.toDocument('Stars! ___ \t \t ___')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('Stars! ___ \t \t ___')
            ]))
        })

        specify('Shouting with imbalanced delimiters', () => {
          expect(Up.toDocument('Stars! _____\t  \t___')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('Stars! _____\t  \t___')
            ]))
        })
      })
    })


    context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
      specify('1 character', () => {
        expect(Up.toDocument('*')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('*')
          ]))
      })

      specify('2 characters', () => {
        expect(Up.toDocument('**')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('**')
          ]))
      })

      specify('3 characters', () => {
        expect(Up.toDocument('Stars! ***')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('Stars! ***')
          ]))
      })

      specify('4 characters', () => {
        expect(Up.toDocument('Stars! ****')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('Stars! ****')
          ]))
      })
    })
  })
})



context('Links are handled a bit differently, because they also have a URL to worry about. An otherwise-valid link...', () => {
  describe('with an empty URL', () => {
    it("does not produce a link. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('[*Yggdra Union*][]')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketParentheticalNode([
            new PlainTextNode('['),
            new EmphasisNode([
              new PlainTextNode('Yggdra Union')
            ]),
            new PlainTextNode(']')
          ]),
          new PlainTextNode('[]')
        ]))
    })
  })


  describe('with a blank URL', () => {
    it("does not produce a link. Instead, its content is treated as the appropriate bracketed convention, and its blank bracketed URL is treated as normal blank brackets", () => {
      expect(Up.toDocument('[*Yggdra Union*]( \t )')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketParentheticalNode([
            new PlainTextNode('['),
            new EmphasisNode([
              new PlainTextNode('Yggdra Union')
            ]),
            new PlainTextNode(']')
          ]),
          new PlainTextNode('( \t )')
        ]))
    })
  })


  describe('with empty content', () => {
    it("does not produce a link. Instead, its content is treated as normal empty brackets, and its bracketed URL is treated as the appropriate bracketed convention", () => {
      expect(Up.toDocument('()[https://google.com]')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('()'),
          new SquareBracketParentheticalNode([
            new PlainTextNode('['),
            new LinkNode([
              new PlainTextNode('google.com')
            ], 'https://google.com'),
            new PlainTextNode(']')
          ])
        ]))
    })
  })


  describe('with blank content', () => {
    it("does not produce a link. Instead, its content is treated as normal blank brackets, and its bracketed URL is treated as the appropriate bracketed convention", () => {
      expect(Up.toDocument('[ \t ](https://google.com)')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[ \t ]'),
          new NormalParentheticalNode([
            new PlainTextNode('('),
            new LinkNode([
              new PlainTextNode('google.com')
            ], 'https://google.com'),
            new PlainTextNode(')')
          ])
        ]))
    })
  })


  describe('with empty content and an empty URL', () => {
    it('is treated as consecutive empty brackets', () => {
      expect(Up.toDocument('Hello, [][]!')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Hello, [][]!')
        ]))
    })
  })


  describe('with blank content and a blank URL', () => {
    it('is treated as consecutive blank brackets', () => {
      expect(Up.toDocument('Beep boop, [ ][\t]!')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Beep boop, [ ][\t]!')
        ]))
    })
  })


  describe('with escaped blank content', () => {
    specify('produces a link with its URL as its content', () => {
      expect(Up.toDocument('[\\ ][https://google.com]')).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('https://google.com')
          ], 'https://google.com')
        ]))
    })
  })


  describe('with an escaped blank URL', () => {
    it("does not produce a link. Instead, its content is treated as the appropriate bracketed convention, and its bracketed URL is treated as the appropriate bracketed convention", () => {
      expect(Up.toDocument('[*Yggdra Union*](\\ )')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketParentheticalNode([
            new PlainTextNode('['),
            new EmphasisNode([
              new PlainTextNode('Yggdra Union')
            ]),
            new PlainTextNode(']')
          ]),
          new NormalParentheticalNode([
            new PlainTextNode('( )')
          ])
        ]))
    })
  })
})


context("Media conventions are handled a bit differently, because they also have URL.", () => {
  describe('An image with an empty description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[image:][http://example.com/hauntedhouse.svg]')).to.be.eql(
        new UpDocument([
          new ImageNode('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
        ]))
    })
  })


  describe('An image with a blank description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[image:\t  ][http://example.com/hauntedhouse.svg]')).to.be.eql(
        new UpDocument([
          new ImageNode('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
        ]))
    })
  })


  describe('An image with an empty URL', () => {
    it("does not produce an image. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('[image: Yggdra Union]{}')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketParentheticalNode([
            new PlainTextNode('[image: Yggdra Union]')
          ]),
          new PlainTextNode('{}')
        ]))
    })
  })


  describe('An image with a blank URL', () => {
    it("does not produce an image. Instead, its content is treated as the appropriate bracketed convention, and its blank bracketed URL is treated as normal blank brackets", () => {
      expect(Up.toDocument('[image: Yggdra Union]{ \t \t}')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketParentheticalNode([
            new PlainTextNode('[image: Yggdra Union]')
          ]),
          new PlainTextNode('{ \t \t}')
        ]))
    })
  })


  describe("An otherwise-valid image missing its bracketed URL is treated as bracketed text, not an image. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.toDocument('[image: haunted house]')).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            new SquareBracketParentheticalNode([
              new PlainTextNode('[image: haunted house]')
            ])
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.toDocument('[image: haunted house] was written on the desk')).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            new SquareBracketParentheticalNode([
              new PlainTextNode('[image: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk')
          ])
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.toDocument('[image: haunted house] was written on the desk [really]')).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            new SquareBracketParentheticalNode([
              new PlainTextNode('[image: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk '),
            new SquareBracketParentheticalNode([
              new PlainTextNode('[really]')
            ]),
          ])
        ]))
    })
  })


  describe('An audio convention with an empty description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[audio:][http://example.com/hauntedhouse.ogg]')).to.be.eql(
        new UpDocument([
          new AudioNode('http://example.com/hauntedhouse.ogg', 'http://example.com/hauntedhouse.ogg')
        ]))
    })
  })


  describe('An audio convention with a blank description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[audio:\t  ][http://example.com/hauntedhouse.ogg]')).to.be.eql(
        new UpDocument([
          new AudioNode('http://example.com/hauntedhouse.ogg', 'http://example.com/hauntedhouse.ogg')
        ]))
    })
  })


  describe('An audio convention with an empty URL', () => {
    it("does not produce An audio convention. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('(audio: Yggdra Union){}')).to.be.eql(
        insideDocumentAndParagraph([
          new NormalParentheticalNode([
            new PlainTextNode('(audio: Yggdra Union)')
          ]),
          new PlainTextNode('{}')
        ]))
    })
  })


  describe('An audio convention with an empty URL', () => {
    it("does not produce an audio convention. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('[audio: Yggdra Union]{ \t \t}')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketParentheticalNode([
            new PlainTextNode('[audio: Yggdra Union]')
          ]),
          new PlainTextNode('{ \t \t}')
        ]))
    })
  })


  describe("An otherwise-valid audio convention missing its bracketed URL is treated as bracketed text, not An audio convention. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.toDocument('[audio: haunted house]')).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            new SquareBracketParentheticalNode([
              new PlainTextNode('[audio: haunted house]')
            ])
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.toDocument('[audio: haunted house] was written on the desk')).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            new SquareBracketParentheticalNode([
              new PlainTextNode('[audio: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk')
          ])
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.toDocument('[audio: haunted house] was written on the desk [really]')).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            new SquareBracketParentheticalNode([
              new PlainTextNode('[audio: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk '),
            new SquareBracketParentheticalNode([
              new PlainTextNode('[really]')
            ]),
          ])
        ]))
    })
  })


  describe('A video with an empty description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[video:][http://example.com/hauntedhouse.webm]')).to.be.eql(
        new UpDocument([
          new VideoNode('http://example.com/hauntedhouse.webm', 'http://example.com/hauntedhouse.webm')
        ]))
    })
  })


  describe('A video with a blank description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toDocument('[video:\t  ][http://example.com/hauntedhouse.webm]')).to.be.eql(
        new UpDocument([
          new VideoNode('http://example.com/hauntedhouse.webm', 'http://example.com/hauntedhouse.webm')
        ]))
    })
  })


  describe('A video with an empty URL', () => {
    it("does not produce A video. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('(video: Yggdra Union){}')).to.be.eql(
        insideDocumentAndParagraph([
          new NormalParentheticalNode([
            new PlainTextNode('(video: Yggdra Union)')
          ]),
          new PlainTextNode('{}')
        ]))
    })
  })


  describe('An audio convention with a blank URL', () => {
    it("does not produce a video. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toDocument('[video: Yggdra Union]{ \t \t}')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketParentheticalNode([
            new PlainTextNode('[video: Yggdra Union]')
          ]),
          new PlainTextNode('{ \t \t}')
        ]))
    })
  })


  describe("An otherwise-valid video missing its bracketed URL is treated as bracketed text, not A video. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.toDocument('[video: haunted house]')).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            new SquareBracketParentheticalNode([
              new PlainTextNode('[video: haunted house]')
            ])
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.toDocument('[video: haunted house] was written on the desk')).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            new SquareBracketParentheticalNode([
              new PlainTextNode('[video: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk')
          ])
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.toDocument('[video: haunted house] was written on the desk [really]')).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            new SquareBracketParentheticalNode([
              new PlainTextNode('[video: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk '),
            new SquareBracketParentheticalNode([
              new PlainTextNode('[really]')
            ]),
          ])
        ]))
    })
  })
})


context("Conventions aren't linkified if the bracketed URL is...", () => {
  context('Empty:', () => {
    specify('highlight', () => {
      expect(Up.toDocument('[highlight: Ash fights Gary]()')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('()')
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.toDocument('[SPOILER: Ash fights Gary]{}')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('{}')
        ]))
    })

    specify('NSFW', () => {
      expect(Up.toDocument('[NSFW: Ash fights Gary]()')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsfwNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('()')
        ]))
    })

    specify('NSFL', () => {
      expect(Up.toDocument('[NSFL: Ash fights Gary][]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('[]')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('Ash fights Gary')
      ], 1)

      expect(Up.toDocument('[^ Ash fights Gary]()')).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            footnote,
            new PlainTextNode('()')
          ]),
          new FootnoteBlockNode([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.toDocument('[audio: Ash fights Gary](example.com/audio)()')).to.be.eql(
        insideDocumentAndParagraph([
          new AudioNode('Ash fights Gary', 'https://example.com/audio'),
          new PlainTextNode('()')
        ]))
    })

    specify('Images', () => {
      expect(Up.toDocument('[image: Ash fights Gary](example.com/image)[]')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('Ash fights Gary', 'https://example.com/image'),
          new PlainTextNode('[]')
        ]))
    })

    specify('Videos', () => {
      expect(Up.toDocument('[video: Ash fights Gary](example.com/video){}')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('Ash fights Gary', 'https://example.com/video'),
          new PlainTextNode('{}')
        ]))
    })
  })

  context('Blank:', () => {
    specify('Highlights', () => {
      expect(Up.toDocument('[highlight: Ash fights Gary]{\t \t \t}')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('{\t \t \t}')
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.toDocument('[SPOILER: Ash fights Gary]{\t \t \t}')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('{\t \t \t}')
        ]))
    })

    specify('NSFW', () => {
      expect(Up.toDocument('[NSFW: Ash fights Gary](\t \t \t)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsfwNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('(\t \t \t)')
        ]))
    })

    specify('NSFL', () => {
      expect(Up.toDocument('[NSFL: Ash fights Gary][\t \t \t]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('[\t \t \t]')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('Ash fights Gary')
      ], 1)

      expect(Up.toDocument('[^ Ash fights Gary](\t \t \t)')).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            footnote,
            new PlainTextNode('(\t \t \t)')
          ]),
          new FootnoteBlockNode([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.toDocument('[audio: Ash fights Gary](example.com/audio)(\t \t \t)')).to.be.eql(
        insideDocumentAndParagraph([
          new AudioNode('Ash fights Gary', 'https://example.com/audio'),
          new PlainTextNode('(\t \t \t)')
        ]))
    })

    specify('Images', () => {
      expect(Up.toDocument('[image: Ash fights Gary](example.com/image)[\t \t \t]')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('Ash fights Gary', 'https://example.com/image'),
          new PlainTextNode('[\t \t \t]')
        ]))
    })

    specify('Videos', () => {
      expect(Up.toDocument('[video: Ash fights Gary](example.com/video){\t \t \t}')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('Ash fights Gary', 'https://example.com/video'),
          new PlainTextNode('{\t \t \t}')
        ]))
    })
  })
})


describe('Revision insertion containing an empty revision deletion', () => {
  it('produces a revision insertion convention containing the plain text delimiters of revision deletion', () => {
    expect(Up.toDocument('I built a trail: ++~~~~++')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I built a trail: '),
        new RevisionInsertionNode([
          new PlainTextNode('~~~~')
        ])
      ]))
  })
})


describe('An inline spoiler convention with escaped blank content', () => {
  it('produces an inline spoiler node containing its content (whitespace)', () => {
    expect(Up.toDocument("The moral of this severely exciting, enriching story is [SPOILER:\\  ]. I hope it didn't take you too long to read it.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('The moral of this severely exciting, enriching story is '),
        new InlineSpoilerNode([
          new PlainTextNode('  ')
        ]),
        new PlainTextNode(". I hope it didn't take you too long to read it.")
      ]))
  })
})


describe('An otherwise-linkified NSFW convention with escaped blank content', () => {
  it("is not linkified. Instead, the bracketed URL is treated as the appropriate bracketed convention", () => {
    expect(Up.toDocument("On Professor Oak's right arm is a tattoo of [NSFW: a naked Mr. Mime](\\ )")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("On Professor Oak's right arm is a tattoo of "),
        new InlineNsfwNode([
          new PlainTextNode('a naked Mr. Mime')
        ]),
        new NormalParentheticalNode([
          new PlainTextNode('( )')
        ])
      ]))
  })
})
