import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from './Helpers'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { UpDocument } from '../../SyntaxNodes/UpDocument'



describe('The default URL scheme ("https://" unless changed via config setting)', () => {
  it('is prefixed to schemeless link URLs', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: 'stackoverflow.com',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com')
      ])
    })
  })

  it('is prefixed to schemeless image URLs', () => {
    const markup = '[image: Chrono Cross logo](prod-web-2/cc-logo.png)'

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ImageNode('Chrono Cross logo', 'https://prod-web-2/cc-logo.png')
      ]))
  })

  it('is prefixed to schemeless audio URLs', () => {
    const markup = '[audio: Chrono Cross ending theme](prod-web-2/radical dreamers.mp3)'

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new AudioNode('Chrono Cross ending theme', 'https://prod-web-2/radical dreamers.mp3')
      ]))
  })

  it('is prefixed to schemeless video URLs', () => {
    const markup = '[video: Chrono Cross ending cinematic](prod-web-2/radical dreamers.mp3)'

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new VideoNode('Chrono Cross ending cinematic', 'https://prod-web-2/radical dreamers.mp3')
      ]))
  })

  it('is prefixed to schemeless linkified spoiler URLs', () => {
    const markup = 'Walter White produces [SPOILER: Blue Sky meth](localhost/wiki/Blue_Sky)'

    expect(Up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new InlineSpoilerNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'https://localhost/wiki/Blue_Sky')
        ])
      ]))
  })

  it("is prefixed to schemeless linkified footnote URLs", () => {
    const markup = "I don't eat cereal. (^Well, I eat one.)(prod-web-4/cereals/lucky-charms?show=nutrition) Never have."

    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I eat one.')
      ], 'https://prod-web-4/cereals/lucky-charms?show=nutrition')
    ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('is not prefixed to URLs with an explicit scheme', () => {
    const markup = '[say hi](mailto:daniel@wants.email)'

    expect(Up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('say hi')
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
        new LinkNode([
          new PlainTextNode('email me')
        ], 'mailto:daniel@wants.email')
      ])
    })
  })
})


describe('A URL starting with a letter; followed by letters, numbers, periods, plus signs, or hyphens; followed by a colon', () => {
  it('has a scheme, and is not prefixed by the schemeless URL base', () => {
    const markup = '[Chrono Cross](Wiki.9-App+mcgee:wiki/Chrono_Chross)'

    expect(Up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'Wiki.9-App+mcgee:wiki/Chrono_Chross')
      ]))
  })
})


describe('A URL not starting with a slash, but with a slash before its first colon', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](wiki/chrono-cross:the-game)'

    expect(Up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'https://wiki/chrono-cross:the-game')
      ]))
  })
})


describe('A URL with an underscore before its first colon', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](super_admin:123abc@localhost/wiki/chrono-cross:the-game)'

    expect(Up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'https://super_admin:123abc@localhost/wiki/chrono-cross:the-game')
      ]))
  })
})


describe('A URL starting with a number but otherwise looking like it has a scheme', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](4wiki:wiki/Chrono_Chross)'

    expect(Up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'https://4wiki:wiki/Chrono_Chross')
      ]))
  })
})


describe('A URL with no colon (and not starting with a slash)', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const markup = '[Chrono Cross](localhost/wiki/ChronoChross:TheGame)'

    expect(Up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'https://localhost/wiki/ChronoChross:TheGame')
      ]))
  })
})
