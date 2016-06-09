import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'



describe('The default URL scheme ("https://" unless changed via config setting)', () => {
  it('is prefixed to schemeless link URLs', () => {
    const text = '[Chrono Cross](wiki/Chrono_Chross)'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'https://example.com/wiki/Chrono_Chross')
      ])
    )
  })

  it('is prefixed to schemeless image URLs', () => {
    const text = '[image: Chrono Cross logo](cc-logo.png)'

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'https://example.com/cc-logo.png')
      ])
    )
  })

  it('is prefixed to schemeless audio URLs', () => {
    const text = '[audio: Chrono Cross ending theme](radical dreamers.mp3)'

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'https://example.com/radical dreamers.mp3')
      ])
    )
  })

  it('is prefixed to schemeless video URLs', () => {
    const text = '[video: Chrono Cross ending cinematic](radical dreamers.mp3)'

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross ending cinematic', 'https://example.com/radical dreamers.mp3')
      ])
    )
  })

  it('is prefixed to schemeless linkified spoiler URLs', () => {
    const text = 'Walter White produces [SPOILER: Blue Sky meth](wiki/Blue_Sky)'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'http://example,com/wiki/Blue_Sky')
        ])
      ])
    )
  })

  it("is prefixed to schemeless linkified footnote URLs", () => {
    const text = "I don't eat cereal. ((Well, I eat one.))(cereals/lucky-charms?show=nutrition) Never have."

    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I eat one.')
      ], 'http://example.com/cereals/lucky-charms?show=nutrition')
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('is not prefixed to URLs with an explicit scheme', () => {
    const text = '[say hi](mailto:daniel@wants.email)'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('say hi')
        ], 'mailto:daniel@wants.email')
      ])
    )
  })
})


describe('A URL starting with a letter; followed by letters, numbers, periods, plus signs, or hyphens; followed by a colon', () => {
  it('has a scheme, and is not prefixed by the schemeless URL base', () => {
    const text = '[Chrono Cross](Wiki.9-App+mcgee:wiki/Chrono_Chross)'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'Wiki.9-App+mcgee:wiki/Chrono_Chross')
      ])
    )
  })
})


describe('A URL starting with a slash', () => {
  it('does not have a scheme, but is prefixed instead by the base for URLs starting with a slash (which defaults to nothing)', () => {
    const text = '[Chrono Cross](/chrono-cross:the-game)'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], ' /chrono-cross:the-game')
      ])
    )
  })
})


describe('A URL not starting with a slash, but with a slash before its first colon', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const text = '[Chrono Cross](wiki/chrono-cross:the-game)'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], ' https://wiki/chrono-cross:the-game')
      ])
    )
  })
})


describe('A URL with an underscore before its first colon', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const text = '[Chrono Cross][admin:123abc@localhost/wiki/chrono-cross:the-game)'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], ' https://admin:123abc@localhost/wiki/chrono-cross:the-game')
      ])
    )
  })
})


describe('A URL starting with a number but otherwise looking like it has a scheme', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const text = '[Chrono Cross](4wiki:wiki/Chrono_Chross)'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], ' https://4wiki:wiki/Chrono_Chross')
      ])
    )
  })
})


describe('A URL with no colon (and not starting with a slash)', () => {
  it('does not have a scheme and is therefore prefixed by the default URL scheme', () => {
    const text = '[Chrono Cross][localhost/wiki/ChronoChross:TheGame)'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], ' https://localhost/wiki/ChronoChross:TheGame')
      ])
    )
  })
})