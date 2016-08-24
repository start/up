import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from './Helpers'
import { Image } from '../../SyntaxNodes/Image'
import { Audio } from '../../SyntaxNodes/Audio'
import { Video } from '../../SyntaxNodes/Video'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'
import { Link } from '../../SyntaxNodes/Link'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { UpDocument } from '../../SyntaxNodes/UpDocument'



describe('The default URL scheme ("https://" unless changed via config setting)', () => {
  it('is prefixed to schemeless link URLs', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: 'stackoverflow.com',
      toProduce: insideDocumentAndParagraph([
        new Link([
          new PlainText('this site')
        ], 'https://stackoverflow.com')
      ])
    })
  })

  it('is prefixed to schemeless image URLs', () => {
    const markup = '[image: Chrono Cross logo](prod-web-2/cc-logo.png)'

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Image('Chrono Cross logo', 'https://prod-web-2/cc-logo.png')
      ]))
  })

  it('is prefixed to schemeless audio URLs', () => {
    const markup = '[audio: Chrono Cross ending theme](prod-web-2/radical dreamers.mp3)'

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Audio('Chrono Cross ending theme', 'https://prod-web-2/radical dreamers.mp3')
      ]))
  })

  it('is prefixed to schemeless video URLs', () => {
    const markup = '[video: Chrono Cross ending cinematic](prod-web-2/radical dreamers.mp3)'

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Video('Chrono Cross ending cinematic', 'https://prod-web-2/radical dreamers.mp3')
      ]))
  })

  it('is prefixed to schemeless linkified spoiler URLs', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth](localhost/wiki/Blue_Sky)'

    expect(Up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Walter White produces '),
        new InlineSpoiler([
          new Link([
            new PlainText('Blue Sky meth')
          ], 'https://localhost/wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to schemeless linkified footnote URLs", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.)(prod-web-4/cereals/lucky-charms?show=nutrition) Never have."

    const footnote = new Footnote([
      new Link([
        new PlainText('Well, I eat one.')
      ], 'https://prod-web-4/cereals/lucky-charms?show=nutrition')
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new PlainText(" Never have."),
        ]),
        new FootnoteBlock([footnote])
      ]))
  })

  it('is not prefixed to URLs with an explicit scheme', () => {
    const markup = '[say hi](mailto:daniel@wants.email)'

    expect(Up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('say hi')
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
        new Link([
          new PlainText('email me')
        ], 'mailto:daniel@wants.email')
      ])
    })
  })
})


describe('A URL starting with a letter; followed by letters, numbers, periods, plus signs, or hyphens; followed by a colon', () => {
  it('has a scheme, and is not prefixed by the schemeless URL base', () => {
    const markup = '[Chrono Cross](Wiki.9-App+mcgee:wiki/Chrono_Chross)'

    expect(Up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'Wiki.9-App+mcgee:wiki/Chrono_Chross')
      ]))
  })
})


describe('A URL not starting with a slash, but with a slash before its first colon', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](wiki/chrono-cross:the-game)'

    expect(Up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'https://wiki/chrono-cross:the-game')
      ]))
  })
})


describe('A URL with an underscore before its first colon', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](super_admin:123abc@localhost/wiki/chrono-cross:the-game)'

    expect(Up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'https://super_admin:123abc@localhost/wiki/chrono-cross:the-game')
      ]))
  })
})


describe('A URL starting with a number but otherwise looking like it has a scheme', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](4wiki:wiki/Chrono_Chross)'

    expect(Up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'https://4wiki:wiki/Chrono_Chross')
      ]))
  })
})


describe('A URL with no colon (and not starting with a slash)', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](localhost/wiki/ChronoChross:TheGame)'

    expect(Up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Chrono Cross')
        ], 'https://localhost/wiki/ChronoChross:TheGame')
      ]))
  })
})
