import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'


const up = new Up.Transformer({
  parsing: {
    baseForUrlsStartingWithSlash: 'ftp://example.com'
  }
})


describe('The "baseForUrlsStartingWithSlash" setting', () => {
  it('is prefixed to link URLs that start with a slash', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: '/some-page',
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('this site')
        ], '/some-page')
      ])
    })
  })

  it('is prefixed to image URLs that start with a slash', () => {
    const markup = '[image: Chrono Cross logo](/cc-logo.png)'

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Image('Chrono Cross logo', 'ftp://example.com/cc-logo.png')
      ]))
  })

  it('is prefixed to audio URLs that start with a slash', () => {
    const markup = '[audio: Chrono Cross ending theme](/radical dreamers.mp3)'

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Audio('Chrono Cross ending theme', 'ftp://example.com/radical dreamers.mp3')
      ]))
  })

  it('is prefixed to video URLs that start with a slash', () => {
    const markup = '[video: Chrono Cross ending cinematic][/radical dreamers.webm]'

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Video('Chrono Cross ending cinematic', 'ftp://example.com/radical dreamers.webm')
      ]))
  })

  it('is prefixed to link URLs that start with a slash when the link content and URL are separated by whitespace', () => {
    const markup = '[Chrono Cross] (/wiki/Chrono_Chross)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Chrono Cross')
        ], 'ftp://example.com/wiki/Chrono_Chross')
      ]))
  })

  it('is prefixed to linkified inline revealable URLs that start with a slash', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth](/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified highlight URLs that start with a slash', () => {
    const markup = 'Walter White produces [highlight: Blue Sky meth](/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Highlight([
          new Up.Link([
            new Up.Text('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to linkified footnote URLs that start with a slash", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.)[/cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new Up.Footnote([
      new Up.Link([
        new Up.Text('Well, I eat one.')
      ], 'ftp://example.com/cereals/lucky-charms?show=nutrition')
    ], { referenceNumber: 1 })

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I don't eat cereal."),
          footnote,
          new Up.Text(" Never have."),
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })

  it('is prefixed to linkified audio URLs that start with a slash', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg)(/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Link([
          new Up.Audio('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified image URLs that start with a slash', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png)(/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Link([
          new Up.Image('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified video URLs that start with a slash', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm)(/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Link([
          new Up.Video('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified inline revealable URLs that start with a slash when the revealable and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth] (/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to linkified highlight URLs that start with a slash when the highlight and the URL are separated by whitespace', () => {
    const markup = 'Walter White produces [highlight: Blue Sky meth] (/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Highlight([
          new Up.Link([
            new Up.Text('Blue Sky meth')
          ], 'ftp://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to linkified footnote URLs that start with a slash when the footnote part and the URL are separated by whitespace", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.) [/cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new Up.Footnote([
      new Up.Link([
        new Up.Text('Well, I eat one.')
      ], 'ftp://example.com/cereals/lucky-charms?show=nutrition')
    ], { referenceNumber: 1 })

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I don't eat cereal."),
          footnote,
          new Up.Text(" Never have."),
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })

  it('is prefixed to linkified audio URLs that start with a slash when the audio part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [audio: Blue Sky meth](https://blueskymeth/sizzling.ogg) (/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Link([
          new Up.Audio('Blue Sky meth', 'https://blueskymeth/sizzling.ogg')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified image URLs that start with a slash when the image part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png) (/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Link([
          new Up.Image('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified video URLs that start with a slash when the video part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm) (/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Link([
          new Up.Video('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'ftp://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is not prefixed to schemeless URLs not starting with a slash (the default URL scheme is prefixed instead)', () => {
    const markup = '[Chrono Cross](localhost/wiki/Chrono_Chross)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Chrono Cross')
        ], 'https://localhost/wiki/Chrono_Chross')
      ]))
  })

  it('is not prefixed to URLs that have a scheme (which by definition cannot start with a slash)', () => {
    const markup = '[Chrono Cross](my-app:localhost/wiki/Chrono_Chross)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Chrono Cross')
        ], 'my-app:localhost/wiki/Chrono_Chross')
      ]))
  })
})
