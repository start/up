import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'
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
  baseForUrlsStartingWithHashMark: 'https://example.com/page'
})


describe('The "baseForUrlsStartingWithFragmentIdentifier" config setting', () => {
  it('is prefixed to link URLs that start with a hash mark ("#")', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: '#some-page',
      toProduce: insideDocumentAndParagraph([
        new Link([
          new PlainText('this site')
        ], '#some-page')
      ])
    })
  })

  it('is prefixed to image URLs that start with a hash mark', () => {
    const markup = '[image: Chrono Cross logo](#cc-logo.png)'

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Image('Chrono Cross logo', 'https://example.com/page#cc-logo.png')
      ]))
  })

  it('is prefixed to audio URLs that start with a hash mark', () => {
    const markup = '[audio: Chrono Cross ending theme](#radical dreamers.mp3)'

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Audio('Chrono Cross ending theme', 'https://example.com/page#radical dreamers.mp3')
      ]))
  })

  it('is prefixed to video URLs that start with a hash mark', () => {
    const markup = '[video: Chrono Cross ending cinematic][#radical dreamers.webm]'

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Video('Chrono Cross ending cinematic', 'https://example.com/page#radical dreamers.webm')
      ]))
  })

  it('is prefixed to linkified spoiler URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth](#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineSpoiler([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFW URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [NSFW: Blue Sky meth](#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfw([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFL URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [NSFL: Blue Sky meth](#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfl([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to linkified footnote URLs that start with a hash mark", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.)[#cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new Footnote([
      new Link([
        new PlainText('Well, I eat one.')
      ], 'https://example.com/page#cereals/lucky-charms?show=nutrition')
    ], { referenceNumber: 1 })

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new PlainText(" Never have."),
        ]),
        new FootnoteBlock([footnote])
      ]))
  })

  it('is prefixed to linkified audio URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg)(#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Audio('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified image URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png)(#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Image('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified video URLs that start with a hash mark', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm)(#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Video('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to link URLs that start with a hash mark when the link content and URL are separated by whitespace', () => {
    const markup = '[Chrono Cross] (#wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'https://example.com/page#wiki/Chrono_Chross')
      ]))
  })

  it('is prefixed to linkified spoiler URLs that start with a hash mark when the spoiler part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth] (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineSpoiler([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFW URLs that start with a hash mark when the NSFW part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [NSFW: Blue Sky meth] (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfw([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFL URLs that start with a hash mark when the NSFL part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [NSFL: Blue Sky meth] (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfl([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to linkified footnote URLs that start with a hash mark when the footnote part and the URL are separated by whitespace", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.) [#cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new Footnote([
      new Link([
        new PlainText('Well, I eat one.')
      ], 'https://example.com/page#cereals/lucky-charms?show=nutrition')
    ], { referenceNumber: 1 })

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new PlainText(" Never have."),
        ]),
        new FootnoteBlock([footnote])
      ]))
  })

  it('is prefixed to linkified audio URLs that start with a hash mark when the audio part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg) (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Audio('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified image URLs that start with a hash mark when the image part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png) (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Image('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified video URLs that start with a hash mark when the video part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm) (#wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Video('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'https://example.com/page#wiki/Blue_Sky')
      ]))
  })

  it('is not prefixed to schemeless URLs not starting with a hash mark (the default URL scheme is prefixed instead)', () => {
    const markup = '[Chrono Cross](localhost/#wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'https://localhost/#wiki/Chrono_Chross')
      ]))
  })

  it('is not prefixed to URLs that have a scheme (which by definition cannot start with a hash mark)', () => {
    const markup = '[Chrono Cross](my-app:localhost/wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'my-app:localhost/wiki/Chrono_Chross')
      ]))
  })
})
