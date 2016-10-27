import { expect } from 'chai'
import * as Up from '../../../Up'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'


// TODO: Use bracket helper functions for more tests

describe('The "baseForUrlsStartingWithSlash" setting', () => {
  const settings = {
    baseForUrlsStartingWithSlash: 'fun-scheme://example.com'
  }

  it('is prefixed to link URLs that start with a slash', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: '/some-page',
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('this site')
        ], 'fun-scheme://example.com/some-page')
      ]),
      settings
    })
  })

  const up = new Up.Transformer({
    parsing: settings
  })

  it('is prefixed to image URLs that start with a slash', () => {
    const markup = '[image: Chrono Cross logo](/cc-logo.png)'

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Image('Chrono Cross logo', 'fun-scheme://example.com/cc-logo.png')
      ]))
  })

  it('is prefixed to audio URLs that start with a slash', () => {
    const markup = '[audio: Chrono Cross ending theme](/radical dreamers.mp3)'

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Audio('Chrono Cross ending theme', 'fun-scheme://example.com/radical dreamers.mp3')
      ]))
  })

  it('is prefixed to video URLs that start with a slash', () => {
    const markup = '[video: Chrono Cross ending cinematic][/radical dreamers.webm]'

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Video('Chrono Cross ending cinematic', 'fun-scheme://example.com/radical dreamers.webm')
      ]))
  })

  it("is prefixed to linified revealables' URLs that start with a slash", () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth](/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('Blue Sky meth')
          ], 'fun-scheme://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to linkified footnote URLs that start with a slash", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.)[/cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new Up.Footnote([
      new Up.Link([
        new Up.Text('Well, I eat one.')
      ], 'fun-scheme://example.com/cereals/lucky-charms?show=nutrition')
    ], { referenceNumber: 1 })

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I don't eat cereal."),
          footnote,
          new Up.Text(" Never have.")
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
        ], 'fun-scheme://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified image URLs that start with a slash', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png)(/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Link([
          new Up.Image('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'fun-scheme://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified video URLs that start with a slash', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm)(/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Link([
          new Up.Video('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'fun-scheme://example.com/wiki/Blue_Sky')
      ]))
  })

  it("is prefixed to linified revealables' URLs that start with a slash when the revealable and the URL are separated by whitespace", () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth] (/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('Blue Sky meth')
          ], 'fun-scheme://example.com/wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to linkified footnote URLs that start with a slash when the footnote part and the URL are separated by whitespace", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.) [/cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new Up.Footnote([
      new Up.Link([
        new Up.Text('Well, I eat one.')
      ], 'fun-scheme://example.com/cereals/lucky-charms?show=nutrition')
    ], { referenceNumber: 1 })

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I don't eat cereal."),
          footnote,
          new Up.Text(" Never have.")
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
        ], 'fun-scheme://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified image URLs that start with a slash when the image part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [image: Blue Sky meth](https://blueskymeth/sizzling.png) (/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Link([
          new Up.Image('Blue Sky meth', 'https://blueskymeth/sizzling.png')
        ], 'fun-scheme://example.com/wiki/Blue_Sky')
      ]))
  })

  it('is prefixed to linkified video URLs that start with a slash when the video part and the linkifying URL are separated by whitespace', () => {
    const markup = 'Walter White produces [video: Blue Sky meth](https://blueskymeth/sizzling.webm) (/wiki/Blue_Sky)'

    expect(up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.Link([
          new Up.Video('Blue Sky meth', 'https://blueskymeth/sizzling.webm')
        ], 'fun-scheme://example.com/wiki/Blue_Sky')
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


describe('The default "baseForUrlsStartingWithSlash" setting', () => {
  it('is an empty string', () => {
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
})
