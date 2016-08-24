import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { Image } from '../../../SyntaxNodes/Image'
import { Audio } from '../../../SyntaxNodes/Audio'
import { Video } from '../../../SyntaxNodes/Video'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { Link } from '../../../SyntaxNodes/Link'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'


const up = new Up({
  defaultUrlScheme: 'my-app:'
})


describe('The "defaultUrlScheme" config setting', () => {
  it('is prefixed to schemeless link URLs', () => {
    const markup = '[Chrono Cross](wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'my-app:wiki/Chrono_Chross')
      ]))
  })

  it('is prefixed to schemeless image URLs', () => {
    const markup = '[image: Chrono Cross logo](cc-logo.png)'

    expect(up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Image('Chrono Cross logo', 'my-app:cc-logo.png')
      ]))
  })

  it('is prefixed to schemeless audio URLs', () => {
    const markup = '[audio: Chrono Cross ending theme](radical dreamers.mp3)'

    expect(up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Audio('Chrono Cross ending theme', 'my-app:radical dreamers.mp3')
      ]))
  })

  it('is prefixed to schemeless video URLs', () => {
    const markup = '[video: Chrono Cross ending cinematic](radical dreamers.webm)'

    expect(up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Video('Chrono Cross ending cinematic', 'my-app:radical dreamers.webm')
      ]))
  })

  it('is prefixed to schemeless linkified spoiler URLs', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth](wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineSpoiler([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'my-app:wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to schemeless linkified NSFW URLs', () => {
    const markup = 'Walter White produces [NSFW: Blue Sky meth](wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfw([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'my-app:wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to schemeless linkified NSFLW URLs', () => {
    const markup = 'Walter White produces [NSFL: Blue Sky meth](wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfl([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'my-app:wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to schemeless linkified footnote URLs", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.)(cereals/lucky-charms?show=nutrition) Never have."

    const footnote = new Footnote([
      new Link([
        new PlainText('Well, I eat one.')
      ], 'my-app:cereals/lucky-charms?show=nutrition')
    ], { referenceNumber: 1 })

    expect(up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new PlainText(" Never have."),
        ]),
        new FootnoteBlock([footnote])
      ]))
  })

  it('is prefixed to schemeless linkified audio URLs', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg)(wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Audio('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'my-app:wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to schemeless linkified image URLs', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png)(wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Image('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'my-app:wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to schemeless linkified video URLs', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm)(wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Video('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'my-app:wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to schemeless link URLs when the link content and URL are separated by whitespace', () => {
    const markup = '[Chrono Cross] (example.wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'my-app:example.wiki/Chrono_Chross')
      ]))
  })

  it('is prefixed to linkified schemeless spoiler URLs when the spoiler part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth] (example.wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineSpoiler([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'my-app:example.wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to schemeless linkified NSFW URLs when the NSFW part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [NSFW: Blue Sky meth] (example.wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfw([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'my-app:example.wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to schemeless linkified NSFL URLs when the NSFL part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [NSFL: Blue Sky meth] (example.wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfl([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'my-app:example.wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to schemeless linkified footnote URLs when the footnote part and the URL are separated by whitespace", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.) [cereals.com/lucky-charms?show=nutrition] Never have."

    const footnote = new Footnote([
      new Link([
        new PlainText('Well, I eat one.')
      ], 'my-app:cereals.com/lucky-charms?show=nutrition')
    ], { referenceNumber: 1 })

    expect(up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new PlainText(" Never have."),
        ]),
        new FootnoteBlock([footnote])
      ]))
  })

  it('is prefixed to schemeless linkified audio URLs when the audio part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg) (wiki.com/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Audio('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'my-app:wiki.com/Blue_Sky')
      ]))
  })

  it('is prefixed to schemeless linkified image URLs when the image part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png) (wiki.com/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Image('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'my-app:wiki.com/Blue_Sky')
      ]))
  })

  it('is prefixed to schemeless linkified video URLs when the video part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm) (wiki.com/Blue_Sky)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Video('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'my-app:wiki.com/Blue_Sky')
      ]))
  })

  it('is not prefixed to URLs with an explicit scheme', () => {
    const markup = '[Chrono Cross](their-app:localhost/wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'their-app:localhost/wiki/Chrono_Chross')
      ]))
  })
})
