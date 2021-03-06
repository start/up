import { expect } from 'chai'
import * as Up from '../../Main'
import { expectEveryPermutationOfBracketsAroundContentAndUrl, insideDocumentAndParagraph } from './Helpers'



describe('The default URL scheme ("https://" unless changed via setting)', () => {
  it('is prefixed to schemeless link URLs', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: 'stackoverflow.com',
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('this site')
        ], 'https://stackoverflow.com')
      ])
    })
  })

  it('is prefixed to schemeless image URLs', () => {
    const markup = '[image: Chrono Cross logo](prod-web-2/cc-logo.png)'

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Image('Chrono Cross logo', 'https://prod-web-2/cc-logo.png')
      ]))
  })

  it('is prefixed to schemeless audio URLs', () => {
    const markup = '[audio: Chrono Cross ending theme](prod-web-2/radical dreamers.mp3)'

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Audio('Chrono Cross ending theme', 'https://prod-web-2/radical dreamers.mp3')
      ]))
  })

  it('is prefixed to schemeless video URLs', () => {
    const markup = '[video: Chrono Cross ending cinematic](prod-web-2/radical dreamers.mp3)'

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Video('Chrono Cross ending cinematic', 'https://prod-web-2/radical dreamers.mp3')
      ]))
  })

  it('is prefixed to schemeless linkified revealable URLs', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth](localhost/wiki/Blue_Sky)'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Walter White produces '),
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('Blue Sky meth')
          ], 'https://localhost/wiki/Blue_Sky')
        ])
      ]))
  })

  it('is prefixed to schemeless linkified footnote URLs', () => {
    const markup = "I don't eat cereal. (^Well, I eat one.)(prod-web-4/cereals/lucky-charms?show=nutrition) Never have."

    const footnote = new Up.Footnote([
      new Up.Link([
        new Up.Text('Well, I eat one.')
      ], 'https://prod-web-4/cereals/lucky-charms?show=nutrition')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I don't eat cereal."),
          footnote,
          new Up.Text(' Never have.')
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })

  it('is not prefixed to URLs with an explicit scheme', () => {
    const markup = '[say hi](mailto:daniel@wants.email)'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('say hi')
        ], 'mailto:daniel@wants.email')
      ]))
  })
})


describe('A link URL with a URL scheme other than "http://" or "https://"', () => {
  it('has no added prefix)', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'email me',
      url: 'mailto:daniel@wants.email',
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('email me')
        ], 'mailto:daniel@wants.email')
      ])
    })
  })
})


describe('A URL starting with a letter; followed by letters, numbers, periods, plus signs, or hyphens; followed by a colon', () => {
  it('has a scheme, and is not prefixed by the schemeless URL base', () => {
    const markup = '[Chrono Cross](Wiki.9-App+mcgee:wiki/Chrono_Chross)'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Chrono Cross')
        ], 'Wiki.9-App+mcgee:wiki/Chrono_Chross')
      ]))
  })
})


describe('A URL not starting with a slash, but with a slash before its first colon', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](wiki/chrono-cross:the-game)'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Chrono Cross')
        ], 'https://wiki/chrono-cross:the-game')
      ]))
  })
})


describe('A URL with an underscore before its first colon', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](super_admin:123abc@localhost/wiki/chrono-cross:the-game)'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Chrono Cross')
        ], 'https://super_admin:123abc@localhost/wiki/chrono-cross:the-game')
      ]))
  })
})


describe('A URL starting with a number but otherwise looking like it has a scheme', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](4wiki:wiki/Chrono_Chross)'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Chrono Cross')
        ], 'https://4wiki:wiki/Chrono_Chross')
      ]))
  })
})


describe('A URL with no colon (and not starting with a slash)', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](localhost/wiki/ChronoChross:TheGame)'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Chrono Cross')
        ], 'https://localhost/wiki/ChronoChross:TheGame')
      ]))
  })
})
