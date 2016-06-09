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
  defaultUrlScheme: 'my-app:'
})


describe('The "defaultUrlScheme" config setting', () => {
  it('is prefixed to schemeless link URLs', () => {
    const text = '[Chrono Cross](wiki/Chrono_Chross)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'my-app:wiki/Chrono_Chross')
      ])
    )
  })

  it('is prefixed to schemeless image URLs', () => {
    const text = '[image: Chrono Cross logo](cc-logo.png)'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'my-app:cc-logo.png')
      ])
    )
  })

  it('is prefixed to schemeless audio URLs', () => {
    const text = '[audio: Chrono Cross ending theme](radical dreamers.mp3)'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('Chrono Cross logo', 'my-app:radical dreamers.mp3')
      ])
    )
  })

  it('is prefixed to schemeless video URLs', () => {
    const text = '[video: Chrono Cross ending cinematic](radical dreamers.webm)'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new VideoNode('Chrono Cross ending cinematic', 'my-app:radical dreamers.webm')
      ])
    )
  })

  it('is prefixed to schemeless linkified spoiler URLs', () => {
    const text = 'Walter White produces [SPOILER: Blue Sky meth](wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Walter White produces '),
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('Blue Sky meth')
          ], 'my-app:wiki/Blue_Sky')
        ])
      ])
    )
  })

  it("is prefixed to schemeless linkified footnote URLs", () => {
    const text = "I don't eat cereal. ((Well, I eat one.))(cereals/lucky-charms?show=nutrition) Never have."

    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I eat one.')
      ], 'http://cereals/lucky-charms?show=nutrition')
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
    const text = '[Chrono Cross](their-app:localhost/wiki/Chrono_Chross)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'their-app:localhost/wiki/Chrono_Chross')
      ])
    )
  })
})