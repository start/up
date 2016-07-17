import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph } from '../../Helpers'
import { DocumentNode } from '../../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../../SyntaxNodes/ParagraphNode'
import { RevisionInsertionNode } from '../../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../../SyntaxNodes/RevisionDeletionNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../../SyntaxNodes/LinkNode'
import { EmphasisNode } from '../../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../../SyntaxNodes/StressNode'
import { ActionNode } from '../../../../SyntaxNodes/ActionNode'
import { ParenthesizedNode } from '../../../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../../../SyntaxNodes/SquareBracketedNode'
import { FootnoteNode } from '../../../../SyntaxNodes/FootnoteNode'
import { ImageNode } from '../../../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../../../SyntaxNodes/VideoNode'
import { NsfwNode } from '../../../../SyntaxNodes/NsfwNode'
import { InlineNsflNode } from '../../../../SyntaxNodes/InlineNsflNode'
import { SpoilerNode } from '../../../../SyntaxNodes/SpoilerNode'
import { FootnoteBlockNode } from '../../../../SyntaxNodes/FootnoteBlockNode'


context('Most inline conventions are not applied if they have no content.', () => {
  context('Specifically:', () => {
    specify('Spoilers', () => {
      expect(Up.toAst('[SPOILER:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[SPOILER:]')
          ])
        ]))
    })

    specify('NSFW', () => {
      expect(Up.toAst('[NSFW:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[NSFW:]')
          ])
        ]))
    })

    specify('NSFL', () => {
      expect(Up.toAst('[NSFL:]')).to.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[NSFL:]')
          ])
        ]))
    })

    specify('Footnotes', () => {
      expect(Up.toAst('(^)')).to.eql(
        insideDocumentAndParagraph([
          new ParenthesizedNode([
            new PlainTextNode('(^)')
          ])
        ]))
    })

    specify('Parentheses', () => {
      expect(Up.toAst('()')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('()')
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toAst('[]')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[]')
        ]))
    })

    specify('Actions', () => {
      expect(Up.toAst('{}')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('{}')
        ]))
    })

    specify('Revision insertion', () => {
      // If the revision insertion delimiters were alone on a line, they would be interpreted as a section separator streak. 
      expect(Up.toAst('Spiders.++++')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Spiders.++++')
        ])
      )
    })

    specify('Revision insertion', () => {
      // If the revision deletion delimiters were alone on a line, they would be interpreted as a section separator streak.
      expect(Up.toAst('Spiders.~~~~')).to.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Spiders.~~~~')
        ])
      )
    })


    context('Of those conventions, only the revision conventions apply when containing only unescaped whitespace.', () => {
      specify('Revision insertion applies.', () => {
        expect(Up.toAst('no++ ++one')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('no'),
            new RevisionInsertionNode([
              new PlainTextNode(' ')
            ]),
            new PlainTextNode('one')
          ])
        )
      })

      specify('Revision deletion applies.', () => {
        expect(Up.toAst('e~~ ~~mail')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('e'),
            new RevisionDeletionNode([
              new PlainTextNode(' ')
            ]),
            new PlainTextNode('mail')
          ])
        )
      })


      context("These don't:", () => {
        specify('Spoilers', () => {
          expect(Up.toAst('[SPOILER:  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new SquareBracketedNode([
                new PlainTextNode('[SPOILER:  \t  \t ]')
              ])
            ]))
        })

        specify('NSFW', () => {
          expect(Up.toAst('(NSFW:  \t  \t )')).to.eql(
            insideDocumentAndParagraph([
              new ParenthesizedNode([
                new PlainTextNode('(NSFW:  \t  \t )')
              ])
            ]))
        })

        specify('NSFL', () => {
          expect(Up.toAst('[NSFL:  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new SquareBracketedNode([
                new PlainTextNode('[NSFL:  \t  \t ]')
              ])
            ]))
        })

        specify('Footnotes', () => {
          expect(Up.toAst('(^  \t \t )')).to.eql(
            insideDocumentAndParagraph([
              new ParenthesizedNode([
                new PlainTextNode('(^  \t \t )')
              ])
            ]))
        })

        specify('Parentheses', () => {
          expect(Up.toAst('(  \t  \t )')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('(  \t  \t )')
            ]))
        })

        specify('Square brackets', () => {
          expect(Up.toAst('[  \t  \t ]')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('[  \t  \t ]')
            ]))
        })

        specify('Actions', () => {
          expect(Up.toAst('{  \t  \t }')).to.eql(
            insideDocumentAndParagraph([
              new PlainTextNode('{  \t  \t }')
            ]))
        })
      })
    })
  })


  context("Due to the nature of the raised voice syntax, raised voice conventions cannot be empty or blank.", () => {
    context("Delimiters containing only whitespace are preserved as plain text", () => {
      specify('Emphasis', () => {
        // If the raised voice delimiters were alone on a line, they would be interpreted as an unordered list.
        expect(Up.toAst('Stars! * \t \t *')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('Stars! * \t \t *')
          ]))
      })

      specify('Stress', () => {
        expect(Up.toAst('Stars! **\t  \t**')).to.eql(
          // If the raised voice delimiters were alone on a line, they would be interpreted as a section separator streak.
          insideDocumentAndParagraph([
            new PlainTextNode('Stars! **\t  \t**')
          ]))
      })

      specify('Shouting (emphasis and stress together)', () => {
        expect(Up.toAst('Stars! *** \t \t ***')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('Stars! *** \t \t ***')
          ]))
      })

      specify('Shouting with imbalanced delimiters', () => {
        expect(Up.toAst('Stars! *****\t  \t***')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('Stars! *****\t  \t***')
          ]))
      })
    })


    context("Umatched delimiters are preserved as plain text. This includes delimiters with a length of...", () => {
      specify('1 character', () => {
        expect(Up.toAst('*')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('*')
          ]))
      })

      specify('2 characters', () => {
        expect(Up.toAst('**')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('**')
          ]))
      })

      specify('3 characters', () => {
        expect(Up.toAst('Stars! ***')).to.eql(
          insideDocumentAndParagraph([
            new PlainTextNode('Stars! ***')
          ]))
      })

      specify('4 characters', () => {
        expect(Up.toAst('Stars! ****')).to.eql(
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
      expect(Up.toAst('[*Yggdra Union*][]')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
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
      expect(Up.toAst('[*Yggdra Union*]( \t )')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
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
      expect(Up.toAst('()[https://google.com]')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('()'),
          new SquareBracketedNode([
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
      expect(Up.toAst('[ \t ](https://google.com)')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[ \t ]'),
          new ParenthesizedNode([
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
      expect(Up.toAst('Hello, [][]!')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Hello, [][]!')
        ]))
    })
  })


  describe('with blank content and a blank URL', () => {
    it('is treated as consecutive blank brackets', () => {
      expect(Up.toAst('Beep boop, [ ][\t]!')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Beep boop, [ ][\t]!')
        ]))
    })
  })


  describe('with escaped blank content', () => {
    specify('produces a link with its URL as its content', () => {
      expect(Up.toAst('[\\ ][https://google.com]')).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('https://google.com')
          ], 'https://google.com')
        ]))
    })
  })


  describe('with an escaped blank URL', () => {
    it("does not produce a link. Instead, its content is treated as the appropriate bracketed convention, and its bracketed URL is treated as the appropriate bracketed convention", () => {
      expect(Up.toAst('[*Yggdra Union*](\\ )')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('['),
            new EmphasisNode([
              new PlainTextNode('Yggdra Union')
            ]),
            new PlainTextNode(']')
          ]),
          new ParenthesizedNode([
            new PlainTextNode('( )')
          ])
        ]))
    })
  })
})


context("Media conventions are handled a bit differently, because they also have URL.", () => {
  describe('An image with an empty description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toAst('[image:][http://example.com/hauntedhouse.svg]')).to.be.eql(
        new DocumentNode([
          new ImageNode('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
        ]))
    })
  })


  describe('An image with a blank description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toAst('[image:\t  ][http://example.com/hauntedhouse.svg]')).to.be.eql(
        new DocumentNode([
          new ImageNode('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
        ]))
    })
  })


  describe('An image with an empty URL', () => {
    it("does not produce an image. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toAst('[image: Yggdra Union]{}')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[image: Yggdra Union]')
          ]),
          new PlainTextNode('{}')
        ]))
    })
  })


  describe('An image with a blank URL', () => {
    it("does not produce an image. Instead, its content is treated as the appropriate bracketed convention, and its blank bracketed URL is treated as normal blank brackets", () => {
      expect(Up.toAst('[image: Yggdra Union]{ \t \t}')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[image: Yggdra Union]')
          ]),
          new PlainTextNode('{ \t \t}')
        ]))
    })
  })


  describe("An otherwise-valid image missing its bracketed URL is treated as bracketed text, not an image. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.toAst('[image: haunted house]')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new SquareBracketedNode([
              new PlainTextNode('[image: haunted house]')
            ])
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.toAst('[image: haunted house] was written on the desk')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new SquareBracketedNode([
              new PlainTextNode('[image: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk')
          ])
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.toAst('[image: haunted house] was written on the desk [really]')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new SquareBracketedNode([
              new PlainTextNode('[image: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk '),
            new SquareBracketedNode([
              new PlainTextNode('[really]')
            ]),
          ])
        ]))
    })
  })


  describe('An audio convention with an empty description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toAst('[audio:][http://example.com/hauntedhouse.ogg]')).to.be.eql(
        new DocumentNode([
          new AudioNode('http://example.com/hauntedhouse.ogg', 'http://example.com/hauntedhouse.ogg')
        ]))
    })
  })


  describe('An audio convention with a blank description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toAst('[audio:\t  ][http://example.com/hauntedhouse.ogg]')).to.be.eql(
        new DocumentNode([
          new AudioNode('http://example.com/hauntedhouse.ogg', 'http://example.com/hauntedhouse.ogg')
        ]))
    })
  })


  describe('An audio convention with an empty URL', () => {
    it("does not produce An audio convention. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toAst('(audio: Yggdra Union){}')).to.be.eql(
        insideDocumentAndParagraph([
          new ParenthesizedNode([
            new PlainTextNode('(audio: Yggdra Union)')
          ]),
          new PlainTextNode('{}')
        ]))
    })
  })


  describe('An audio convention with an empty URL', () => {
    it("does not produce an audio convention. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toAst('[audio: Yggdra Union]{ \t \t}')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[audio: Yggdra Union]')
          ]),
          new PlainTextNode('{ \t \t}')
        ]))
    })
  })


  describe("An otherwise-valid audio convention missing its bracketed URL is treated as bracketed text, not An audio convention. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.toAst('[audio: haunted house]')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new SquareBracketedNode([
              new PlainTextNode('[audio: haunted house]')
            ])
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.toAst('[audio: haunted house] was written on the desk')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new SquareBracketedNode([
              new PlainTextNode('[audio: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk')
          ])
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.toAst('[audio: haunted house] was written on the desk [really]')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new SquareBracketedNode([
              new PlainTextNode('[audio: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk '),
            new SquareBracketedNode([
              new PlainTextNode('[really]')
            ]),
          ])
        ]))
    })
  })


  describe('A video with an empty description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toAst('[video:][http://example.com/hauntedhouse.webm]')).to.be.eql(
        new DocumentNode([
          new VideoNode('http://example.com/hauntedhouse.webm', 'http://example.com/hauntedhouse.webm')
        ]))
    })
  })


  describe('A video with a blank description', () => {
    it('has its URL treated as its description', () => {
      expect(Up.toAst('[video:\t  ][http://example.com/hauntedhouse.webm]')).to.be.eql(
        new DocumentNode([
          new VideoNode('http://example.com/hauntedhouse.webm', 'http://example.com/hauntedhouse.webm')
        ]))
    })
  })


  describe('A video with an empty URL', () => {
    it("does not produce A video. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toAst('{video: Yggdra Union}{}')).to.be.eql(
        insideDocumentAndParagraph([
          new ActionNode([
            new PlainTextNode('video: Yggdra Union')
          ]),
          new PlainTextNode('{}')
        ]))
    })
  })


  describe('An audio convention with a blank URL', () => {
    it("does not produce a video. Instead, its content is treated as the appropriate bracketed convention, and its empty bracketed URL is treated as normal empty brackets", () => {
      expect(Up.toAst('[video: Yggdra Union]{ \t \t}')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new PlainTextNode('[video: Yggdra Union]')
          ]),
          new PlainTextNode('{ \t \t}')
        ]))
    })
  })


  describe("An otherwise-valid video missing its bracketed URL is treated as bracketed text, not A video. This applies when the bracketed description is followed by...", () => {
    specify('nothing', () => {
      expect(Up.toAst('[video: haunted house]')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new SquareBracketedNode([
              new PlainTextNode('[video: haunted house]')
            ])
          ])
        ]))
    })

    specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
      expect(Up.toAst('[video: haunted house] was written on the desk')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new SquareBracketedNode([
              new PlainTextNode('[video: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk')
          ])
        ]))
    })

    specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
      expect(Up.toAst('[video: haunted house] was written on the desk [really]')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new SquareBracketedNode([
              new PlainTextNode('[video: haunted house]')
            ]),
            new PlainTextNode(' was written on the desk '),
            new SquareBracketedNode([
              new PlainTextNode('[really]')
            ]),
          ])
        ]))
    })
  })
})


context("Conventions aren't linkified if the bracketed URL is...", () => {
  context('Empty:', () => {
    specify('NSFW', () => {
      expect(Up.toAst('[NSFW: Ash fights Gary]()')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('()')
        ]))
    })

    specify('NSFL', () => {
      expect(Up.toAst('[NSFL: Ash fights Gary][]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('[]')
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.toAst('[SPOILER: Ash fights Gary]{}')).to.be.eql(
        insideDocumentAndParagraph([
          new SpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('{}')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('Ash fights Gary')
      ], 1)

      expect(Up.toAst('[^ Ash fights Gary]()')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode('()')
          ]),
          new FootnoteBlockNode([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.toAst('[audio: Ash fights Gary](example.com/audio)()')).to.be.eql(
        insideDocumentAndParagraph([
          new AudioNode('Ash fights Gary', 'https://example.com/audio'),
          new PlainTextNode('()')
        ]))
    })

    specify('Images', () => {
      expect(Up.toAst('[image: Ash fights Gary](example.com/image)[]')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('Ash fights Gary', 'https://example.com/image'),
          new PlainTextNode('[]')
        ]))
    })

    specify('Videos', () => {
      expect(Up.toAst('[video: Ash fights Gary](example.com/video){}')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('Ash fights Gary', 'https://example.com/video'),
          new PlainTextNode('{}')
        ]))
    })
  })

  context('Blank:', () => {
    specify('NSFW', () => {
      expect(Up.toAst('[NSFW: Ash fights Gary](\t \t \t)')).to.be.eql(
        insideDocumentAndParagraph([
          new NsfwNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('(\t \t \t)')
        ]))
    })

    specify('NSFL', () => {
      expect(Up.toAst('[NSFL: Ash fights Gary][\t \t \t]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('[\t \t \t]')
        ]))
    })

    specify('Spoilers', () => {
      expect(Up.toAst('[SPOILER: Ash fights Gary]{\t \t \t}')).to.be.eql(
        insideDocumentAndParagraph([
          new SpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new PlainTextNode('{\t \t \t}')
        ]))
    })

    specify('Footnotes', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('Ash fights Gary')
      ], 1)

      expect(Up.toAst('[^ Ash fights Gary](\t \t \t)')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            footnote,
            new PlainTextNode('(\t \t \t)')
          ]),
          new FootnoteBlockNode([footnote])
        ]))
    })

    specify('Audio', () => {
      expect(Up.toAst('[audio: Ash fights Gary](example.com/audio)(\t \t \t)')).to.be.eql(
        insideDocumentAndParagraph([
          new AudioNode('Ash fights Gary', 'https://example.com/audio'),
          new PlainTextNode('(\t \t \t)')
        ]))
    })

    specify('Images', () => {
      expect(Up.toAst('[image: Ash fights Gary](example.com/image)[\t \t \t]')).to.be.eql(
        insideDocumentAndParagraph([
          new ImageNode('Ash fights Gary', 'https://example.com/image'),
          new PlainTextNode('[\t \t \t]')
        ]))
    })

    specify('Videos', () => {
      expect(Up.toAst('[video: Ash fights Gary](example.com/video){\t \t \t}')).to.be.eql(
        insideDocumentAndParagraph([
          new VideoNode('Ash fights Gary', 'https://example.com/video'),
          new PlainTextNode('{\t \t \t}')
        ]))
    })
  })
})


describe('Revision insertion containing an empty revision deletion', () => {
  it('produces a revision insertion convention containing the plain text delimiters of revision deletion', () => {
    expect(Up.toAst('I built a trail: ++~~~~++')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I built a trail: '),
        new RevisionInsertionNode([
          new PlainTextNode('~~~~')
        ])
      ]))
  })
})


describe('A spoiler convention with escaped blank content', () => {
  it('produces a spoiler node containing its content (whitespace)', () => {
    expect(Up.toAst("The moral of this severely exciting, enriching story is [SPOILER:\\  ]. I hope it didn't take you too long to read it.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('The moral of this severely exciting, enriching story is '),
        new SpoilerNode([
          new PlainTextNode('  ')
        ]),
        new PlainTextNode(". I hope it didn't take you too long to read it.")
      ]))
  })
})


describe('An otherwise-linkified NSFW convention with escaped blank content', () => {
  it("is not linkified. Instead, the bracketed URL is treated as the appropriate bracketed convention", () => {
    expect(Up.toAst("On Professor Oak's right arm is a tattoo of [NSFW: a naked Mr. Mime](\\ )")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("On Professor Oak's right arm is a tattoo of "),
        new NsfwNode([
          new PlainTextNode('a naked Mr. Mime')
        ]),
        new ParenthesizedNode([
          new PlainTextNode('( )')
        ])
      ]))
  })
})