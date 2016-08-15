import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'
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
import { UpDocument } from '../../../SyntaxNodes/UpDocument'


const up = new Up({
  baseForUrlsStartingWithHashMark: 'https://example.com/page'
})


describe('The "baseForUrlsStartingWithFragmentIdentifier" config setting', () => {
  it('is prefixed to link URLs that start with a hash mark ("#")', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: '#some-page',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this site')
        ], '#some-page')
      ])
    })
  })

  it('is prefixed to image URLs that start with a hash mark', () => {
    const markup = '[image: Chrono Cross logo](#cc-logo.png)'

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ImageNode('Chrono Cross logo', 'https://example.com/page#cc-logo.png')
      ]))
  })

  it('is prefixed to audio URLs that start with a hash mark', () => {
    const markup = '[audio: Chrono Cross ending theme](#radical dreamers.mp3)'

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new AudioNode('Chrono Cross ending theme', 'https://example.com/page#radical dreamers.mp3')
      ]))
  })

  it('is prefixed to video URLs that start with a hash mark', () => {
    const markup = '[video: Chrono Cross ending cinematic][#radical dreamers.webm]'

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new VideoNode('Chrono Cross ending cinematic', 'https://example.com/page#radical dreamers.webm')
      ]))
  })

  it('is prefixed to linkified spoiler URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth](#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineSpoilerNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFW URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [NSFW: Blue Sky meth](#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineNsfwNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFL URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [NSFL: Blue Sky meth](#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to linkified footnote URLs that start with a hash mark", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.)[#cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I eat one.')
      ], 'https://example.com/page#cereals/lucky-charms?show=nutrition')
    ], 1)

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('is prefixed to linkified audio URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg)(#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new AudioNode('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified image URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png)(#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new ImageNode('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified video URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm)(#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new VideoNode('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to link URLs that start with a hash mark when the link content and URL are separated by whitespace', () => {
    const markup = '[Chrono Cross] (#wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'https://example.com/page#wiki/Chrono_Chross')
      ]))
  })

  it('is prefixed to linkified spoiler URLs that start with a hash mark when the spoiler part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth] (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineSpoilerNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFW URLs that start with a hash mark when the NSFW part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [NSFW: Blue Sky meth] (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineNsfwNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFL URLs that start with a hash mark when the NSFL part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [NSFL: Blue Sky meth] (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to linkified footnote URLs that start with a hash mark when the footnote part and the URL are separated by whitespace", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.) [#cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I eat one.')
      ], 'https://example.com/page#cereals/lucky-charms?show=nutrition')
    ], 1)

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('is prefixed to linkified audio URLs that start with a hash mark when the audio part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg) (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new AudioNode('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified image URLs that start with a hash mark when the image part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png) (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new ImageNode('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified video URLs that start with a hash mark when the video part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm) (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new LinkNode([
          new VideoNode('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is not prefixed to schemeless URLs not starting with a hash mark (the default URL scheme is prefixed instead)', () => {
    const markup = '[Chrono Cross](localhost/#wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'https://localhost/#wiki/Chrono_Chross')
      ]))
  })

  it('is not prefixed to URLs that have a scheme (which by definition cannot start with a hash mark)', () => {
    const markup = '[Chrono Cross](my-app:localhost/wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'my-app:localhost/wiki/Chrono_Chross')
      ]))
  })
})
