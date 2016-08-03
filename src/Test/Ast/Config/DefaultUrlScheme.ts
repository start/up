import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


const up = new Up({
  defaultUrlScheme: 'my-app:'
})


describe('The "defaultUrlScheme" config setting', () => {
  it('is prefixed to schemeless link URLs', () => {
    const markup = '[Chrono Cross](wiki/Chrono_Chross)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'my-app:wiki/Chrono_Chross')
      ]))
  })

  it('is prefixed to schemeless image URLs', () => {
    const markup = '[image: Chrono Cross logo](cc-logo.png)'

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'my-app:cc-logo.png')
      ]))
  })

  it('is prefixed to schemeless audio URLs', () => {
    const markup = '[audio: Chrono Cross ending theme](radical dreamers.mp3)'

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new AudioNode('Chrono Cross ending theme', 'my-app:radical dreamers.mp3')
      ]))
  })

  it('is prefixed to schemeless video URLs', () => {
    const markup = '[video: Chrono Cross ending cinematic](radical dreamers.webm)'

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new VideoNode('Chrono Cross ending cinematic', 'my-app:radical dreamers.webm')
      ]))
  })

  it('is prefixed to schemeless linkified spoiler URLs', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth](wiki/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineSpoilerNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'my-app:wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to schemeless linkified NSFW URLs', () => {
    const markup = 'Walter White produces [NSFW: Blue Sky meth](wiki/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineNsfwNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'my-app:wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to schemeless linkified NSFLW URLs', () => {
    const markup = 'Walter White produces [NSFL: Blue Sky meth](wiki/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'my-app:wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to schemeless linkified footnote URLs", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.)(cereals/lucky-charms?show=nutrition) Never have."

    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I eat one.')
      ], 'my-app:cereals/lucky-charms?show=nutrition')
    ], 1)

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('is prefixed to schemeless linkified audio URLs', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg)(wiki/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new AudioNode('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'my-app:wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to schemeless linkified image URLs', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png)(wiki/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new ImageNode('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'my-app:wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to schemeless linkified video URLs', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm)(wiki/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new VideoNode('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'my-app:wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to schemeless link URLs when the link content and URL are separated by whitespace', () => {
    const markup = '[Chrono Cross] (example.wiki/Chrono_Chross)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'my-app:example.wiki/Chrono_Chross')
      ]))
  })

  it('is prefixed to linkified schemeless spoiler URLs when the spoiler part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth] (example.wiki/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineSpoilerNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'my-app:example.wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to schemeless linkified NSFW URLs when the NSFW part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [NSFW: Blue Sky meth] (example.wiki/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineNsfwNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'my-app:example.wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to schemeless linkified NSFL URLs when the NSFL part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [NSFL: Blue Sky meth] (example.wiki/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'my-app:example.wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to schemeless linkified footnote URLs when the footnote part and the URL are separated by whitespace", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.) [cereals.com/lucky-charms?show=nutrition] Never have."

    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I eat one.')
      ], 'my-app:cereals.com/lucky-charms?show=nutrition')
    ], 1)

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('is prefixed to schemeless linkified audio URLs when the audio part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg) (wiki.com/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new AudioNode('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'my-app:wiki.com/Blue_Sky')
      ]))
  })

  it('is prefixed to schemeless linkified image URLs when the image part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png) (wiki.com/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new ImageNode('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'my-app:wiki.com/Blue_Sky')
      ]))
  })

  it('is prefixed to schemeless linkified video URLs when the video part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm) (wiki.com/Blue_Sky)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new VideoNode('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'my-app:wiki.com/Blue_Sky')
      ]))
  })

  it('is not prefixed to URLs with an explicit scheme', () => {
    const markup = '[Chrono Cross](their-app:localhost/wiki/Chrono_Chross)'

    expect(up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'their-app:localhost/wiki/Chrono_Chross')
      ]))
  })
})
