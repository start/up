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


describe('The "relativeUrlBase" config setting', () => {
  const up = new Up({
    'relativeUrlBase': 'https://example.com/'
  })

  it('is used as a prefix for relative link URLs', () => {
    const text = '[Chrono Cross](wiki/Chrono_Chross)'

    expect(up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], 'https://example.com/wiki/Chrono_Chross')
      ])
    )
  })

  it('is used as a prefix for relative image URLs', () => {
    const text = '[image: Chrono Cross logo](cc-logo.png)'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'https://example.com/cc-logo.png')
      ])
    )
  })

  it('is used as a prefix for relative audio URLs', () => {
    const text = '[audio: Chrono Cross ending theme](radical dreamers.mp3)'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross logo', 'https://example.com/radical dreamers.mp3')
      ])
    )
  })

  it('is used as a prefix for relative video URLs', () => {
    const text = '[video: Chrono Cross ending cinematic][radical dreamers.mp3]'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross ending cinematic', 'https://example.com/radical dreamers.mp3')
      ])
    )
  })

  it('is used as a prefix for linkified spoiler URLs', () => {
    const text = 'Walter White produces [SPOILER: Blue Sky meth](wiki/Blue_Sky)'

    expect(up.toAst(text)).to.be.eql(
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

  it("is used as a prefix for linkified footnote URLs", () => {
    const text = "I don't eat cereal. ((Well, I eat one.))[cereals/lucky-charms?show=nutrition] Never have."

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
})