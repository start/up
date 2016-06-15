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


describe('A link URL starting with a slash', () => {
  it('has no added prefix by default, because the default "baseForUrlsStartingWithSlash" config setting is blank', () => {
    const text = '[Chrono Cross](/wiki/Chrono_Chross)'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], '/wiki/Chrono_Chross')
      ])
    )
  })
})


describe('An audio URL starting with a slash', () => {
  it('has no added prefix by default, because the default "baseForUrlsStartingWithSlash" config setting is blank', () => {
    const text = '[audio: Chrono Cross ending theme](/wiki/Chrono_Chross.mp3)'

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('Chrono Cross ending theme', '/wiki/Chrono_Chross.mp3')
      ])
    )
  })
})


describe('An image URL starting with a slash', () => {
  it('has no added prefix by default, because the default "baseForUrlsStartingWithSlash" config setting is blank', () => {
    const text = '[image: Chrono Cross title screen](/wiki/Chrono_Chross.png)'

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ImageNode('Chrono Cross title screen', '/wiki/Chrono_Chross.png')
      ])
    )
  })
})


describe('A video URL starting with a slash', () => {
  it('has no added prefix by default, because the default "baseForUrlsStartingWithSlash" config setting is blank', () => {
    const text = '[video: Chrono Cross intro](/wiki/Chrono_Chross.webm)'

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new VideoNode('Chrono Cross intro', '/wiki/Chrono_Chross.webm')
        ])
    )
  })
})
