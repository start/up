import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'

const up = new Up({
  baseForUrlsStartingWithFragmentIdentifier: 'https://example.com/page'
})


describe('The "baseForUrlsStartingWithFragmentIdentifier" config setting', () => {
  it('is prefixed to link URLs that start with a URL hashmark ("#")', () => {
    const text = '[Chrono Cross](#wiki/Chrono_Chross)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'https://example.com/page#wiki/Chrono_Chross')
      ])
    )
  })

  it('is prefixed to image URLs that start with a slash', () => {
    const text = '[image: Chrono Cross logo](#cc-logo.png)'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'https://example.com/page#cc-logo.png')
      ])
    )
  })

  it('is prefixed to audio URLs that start with a slash', () => {
    const text = '[audio: Chrono Cross ending theme](#radical dreamers.mp3)'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('Chrono Cross ending theme', 'https://example.com/page#radical dreamers.mp3')
      ])
    )
  })

  it('is prefixed to video URLs that start with a slash', () => {
    const text = '[video: Chrono Cross ending cinematic][#radical dreamers.webm]'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new VideoNode('Chrono Cross ending cinematic', 'https://example.com/page#radical dreamers.webm')
      ])
    )
  })

  it('is prefixed to linkified spoiler URLs that start with a URL hashmark', () => {
    const text = 'Walter White produces [SPOILER: Blue Sky meth](#wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'https://example.com/page#wiki/Blue_Sky')
        ])
      ])
    )
  })

  it("is prefixed to linkified footnote URLs that start with a URL hashmark", () => {
    const text = "I don't eat cereal. ((Well, I eat one.))[#cereals/lucky-charms?show=nutrition] Never have."

    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I eat one.')
      ], 'https://example.com/page#cereals/lucky-charms?show=nutrition')
    ], 1)

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('is not prefixed to schemeless URLs not starting with a URL hashmark (the default URL scheme is prefixed instead)', () => {
    const text = '[Chrono Cross](localhost#wiki/Chrono_Chross)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'https://localhost#wiki/Chrono_Chross')
      ])
    )
  })

  it('is not prefixed to URLs that have a scheme (which by definition cannot start with a URL hashmark)', () => {
    const text = '[Chrono Cross](my-app:localhost/wiki/Chrono_Chross)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'my-app:localhost/wiki/Chrono_Chross')
      ])
    )
  })
})
