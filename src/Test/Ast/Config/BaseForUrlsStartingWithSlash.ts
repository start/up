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
  baseForUrlsStartingWithSlash: 'ftp://example.com'
})


describe('The "baseForUrlsStartingWithSlash" config setting', () => {
  it('is prefixed to link URLs that start with a slash', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: '/some-page',
      toProduce: insideDocumentAndParagraph([
        new Link([
          new PlainText('this site')
        ], '/some-page')
      ])
    })
  })

  it('is prefixed to image URLs that start with a slash', () => {
    const markup = '[image: Chrono Cross logo](/cc-logo.png)'

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Image('Chrono Cross logo', 'ftp://example.com/cc-logo.png')
      ]))
  })

  it('is prefixed to audio URLs that start with a slash', () => {
    const markup = '[audio: Chrono Cross ending theme](/radical dreamers.mp3)'

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Audio('Chrono Cross ending theme', 'ftp://example.com/radical dreamers.mp3')
      ]))
  })

  it('is prefixed to video URLs that start with a slash', () => {
    const markup = '[video: Chrono Cross ending cinematic][/radical dreamers.webm]'

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Video('Chrono Cross ending cinematic', 'ftp://example.com/radical dreamers.webm')
      ]))
  })

  it('is prefixed to link URLs that start with a slash when the link content and URL are separated by whitespace', () => {
    const markup = '[Chrono Cross] (/wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'ftp://example.com/wiki/Chrono_Chross')
      ]))
  })

  it('is prefixed to linkified spoiler URLs that start with a slash', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth](/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineSpoiler([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFW URLs that start with a slash', () => {
    const markup = 'Walter White produces [NSFW: Blue Sky meth](/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfw([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFL URLs that start with a slash', () => {
    const markup = 'Walter White produces [NSFL: Blue Sky meth](/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfl([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to linkified footnote URLs that start with a slash", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.)[/cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new Footnote([
      new Link([
        new PlainText('Well, I eat one.')
      ], 'ftp://example.com/cereals/lucky-charms?show=nutrition')
    ], 1)

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

  it('is prefixed to linkified audio URLs that start with a slash', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg)(/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Audio('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified image URLs that start with a slash', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png)(/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Image('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified video URLs that start with a slash', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm)(/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Video('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified spoiler URLs that start with a slash when the spoiler part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth] (/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineSpoiler([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFW URLs that start with a slash when the NSFW part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [NSFW: Blue Sky meth] (/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfw([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified NSFL URLs that start with a slash when the NSFL part and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [NSFL: Blue Sky meth] (/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineNsfl([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to linkified footnote URLs that start with a slash when the footnote part and the URL are separated by whitespace", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.) [/cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new Footnote([
      new Link([
        new PlainText('Well, I eat one.')
      ], 'ftp://example.com/cereals/lucky-charms?show=nutrition')
    ], 1)

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

  it('is prefixed to linkified audio URLs that start with a slash when the audio part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg) (/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Audio('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified image URLs that start with a slash when the image part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png) (/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Image('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified video URLs that start with a slash when the video part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm) (/wiki/Blue_Sky)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new Link([
          new Video('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is not prefixed to schemeless URLs not starting with a slash (the default URL scheme is prefixed instead)', () => {
    const markup = '[Chrono Cross](localhost/wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'https://localhost/wiki/Chrono_Chross')
      ]))
  })

  it('is not prefixed to URLs that have a scheme (which by definition cannot start with a slash)', () => {
    const markup = '[Chrono Cross](my-app:localhost/wiki/Chrono_Chross)'

    expect(up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'my-app:localhost/wiki/Chrono_Chross')
      ]))
  })
})
